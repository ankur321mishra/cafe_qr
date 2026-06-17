import prisma from '../config/database.js';
import { NotFoundError, BadRequestError } from '../utils/apiError.js';
import { generateOrderNumber } from '../utils/orderIdGenerator.js';
import { getSettings } from './settings.service.js';

const STATUS_TRANSITIONS = {
  NEW: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

/** Resolve order by UUID or orderNumber */
function orderWhere(id) {
  return { OR: [{ id }, { orderNumber: id }] };
}

export async function createOrder(data) {
  const settings = await getSettings();
  if (!settings.acceptOrders) throw new BadRequestError('Not accepting orders right now');

  const table = await prisma.cafeTable.findUnique({
    where: { number: data.tableNumber },
  });
  if (!table || !table.isActive) throw new BadRequestError('Invalid or inactive table number');

  const menuItemIds = data.items.map((i) => i.menuItemId);
  const uniqueIds = [...new Set(menuItemIds)];
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: uniqueIds }, isAvailable: true },
  });

  if (menuItems.length !== uniqueIds.length) {
    throw new BadRequestError('One or more menu items are invalid or unavailable');
  }

  const itemMap = new Map(menuItems.map((m) => [m.id, m]));
  const orderItems = data.items.map((i) => {
    const menuItem = itemMap.get(i.menuItemId);
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      unitPrice: menuItem.price,
      quantity: i.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const tax = Math.round(subtotal * (settings.taxRate / 100));
  const total = subtotal + tax;

  const orderNumber = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: 'NEW',
      subtotal,
      tax,
      total,
      specialInstructions: data.specialInstructions || '',
      tableId: table.id,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
      table: { select: { number: true } },
    },
  });

  return serializeOrder(order);
}

export async function getOrder(orderId) {
  const order = await prisma.order.findFirst({
    where: orderWhere(orderId),
    include: {
      items: true,
      table: { select: { number: true } },
    },
  });

  if (!order) throw new NotFoundError('Order');
  return serializeOrder(order);
}

export async function listOrders(filters = {}) {
  const where = {};

  if (filters.status && filters.status !== 'all') {
    where.status = filters.status.toUpperCase();
  }

  if (filters.date === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    where.createdAt = { gte: today, lt: tomorrow };
  }

  const skip = (filters.page - 1) * filters.limit;

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        table: { select: { number: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: filters.limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map(serializeOrder),
    meta: {
      page: filters.page,
      limit: filters.limit,
      totalCount,
      totalPages: Math.ceil(totalCount / filters.limit),
    },
  };
}

export async function updateOrderStatus(orderId, newStatus) {
  const order = await prisma.order.findFirst({
    where: orderWhere(orderId),
  });

  if (!order) throw new NotFoundError('Order');

  const allowed = STATUS_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new BadRequestError(
      `Cannot transition from ${order.status} to ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}`
    );
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: newStatus },
    include: {
      items: true,
      table: { select: { number: true } },
    },
  });

  return serializeOrder(updated);
}

export async function deleteOrder(orderId) {
  const order = await prisma.order.findFirst({
    where: orderWhere(orderId),
  });
  if (!order) throw new NotFoundError('Order');

  await prisma.order.delete({ where: { id: order.id } });
}

function serializeOrder(order) {
  return {
    id: order.orderNumber,
    _dbId: order.id,
    tableNumber: order.table.number,
    items: order.items.map((i) => ({
      itemId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      price: i.unitPrice,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    specialInstructions: order.specialInstructions,
    status: order.status.toLowerCase(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
