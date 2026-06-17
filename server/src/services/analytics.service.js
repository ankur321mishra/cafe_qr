import prisma from '../config/database.js';

/**
 * Dashboard stats: today's revenue, orders, average, active tables, new orders count, and trends.
 */
export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Today's aggregated stats
  const todayStats = await prisma.order.aggregate({
    where: {
      createdAt: { gte: today, lt: tomorrow },
      status: { not: 'CANCELLED' },
    },
    _sum: { total: true },
    _count: { id: true },
  });

  // Yesterday's stats for trend comparison
  const yesterdayStats = await prisma.order.aggregate({
    where: {
      createdAt: { gte: yesterday, lt: today },
      status: { not: 'CANCELLED' },
    },
    _sum: { total: true },
    _count: { id: true },
  });

  // Active tables (tables with non-completed orders today)
  const activeTables = await prisma.order.findMany({
    where: {
      createdAt: { gte: today },
      status: { in: ['NEW', 'PREPARING', 'READY'] },
    },
    select: { tableId: true },
    distinct: ['tableId'],
  });

  const totalTables = await prisma.cafeTable.count({
    where: { isActive: true },
  });

  const newOrdersCount = await prisma.order.count({
    where: { status: 'NEW' },
  });

  const todayRevenue = todayStats._sum.total || 0;
  const todayOrders = todayStats._count.id || 0;
  const yesterdayRevenue = yesterdayStats._sum.total || 0;
  const yesterdayOrders = yesterdayStats._count.id || 0;

  return {
    todayRevenue,
    todayOrders,
    avgOrderValue: todayOrders > 0 ? Math.round(todayRevenue / todayOrders) : 0,
    activeTables: { active: activeTables.length, total: totalTables },
    newOrdersCount,
    revenueChange: calculateChange(todayRevenue, yesterdayRevenue),
    ordersChange: calculateChange(todayOrders, yesterdayOrders),
  };
}

/**
 * Daily revenue for the last N days.
 */
export async function getDailyRevenue(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { not: 'CANCELLED' },
    },
    select: { total: true, createdAt: true },
  });

  // Aggregate by day
  const dailyMap = new Map();
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyMap.set(key, 0);
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().split('T')[0];
    if (dailyMap.has(key)) {
      dailyMap.set(key, dailyMap.get(key) + order.total);
    }
  }

  return Array.from(dailyMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .reverse();
}

/**
 * Top selling items.
 */
export async function getTopItems(limit = 5) {
  const items = await prisma.orderItem.groupBy({
    by: ['name'],
    where: { order: { status: { not: 'CANCELLED' } } },
    _sum: { quantity: true },
    _count: { id: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit,
  });

  return items.map((item) => ({
    name: item.name,
    totalQuantity: item._sum.quantity,
    orderCount: item._count.id,
  }));
}

/**
 * Sales breakdown by category.
 */
export async function getCategorySales() {
  const items = await prisma.orderItem.findMany({
    where: { order: { status: { not: 'CANCELLED' } } },
    include: { menuItem: { include: { category: true } } },
  });

  const categoryMap = new Map();
  for (const item of items) {
    const catName = item.menuItem?.category?.name || 'Other';
    const current = categoryMap.get(catName) || { revenue: 0, quantity: 0 };
    current.revenue += item.unitPrice * item.quantity;
    current.quantity += item.quantity;
    categoryMap.set(catName, current);
  }

  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    category: name,
    revenue: data.revenue,
    quantity: data.quantity,
  }));
}

// ---- Helpers ----

function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
}
