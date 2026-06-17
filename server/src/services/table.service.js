import prisma from '../config/database.js';
import { NotFoundError, BadRequestError } from '../utils/apiError.js';

export async function listTables() {
  const tables = await prisma.cafeTable.findMany({
    orderBy: { number: 'asc' },
  });
  return tables.map(serializeTable);
}

export async function validateTable(number) {
  const table = await prisma.cafeTable.findUnique({
    where: { number: parseInt(number) },
  });
  if (!table || !table.isActive) throw new NotFoundError('Table not found or inactive');
  return serializeTable(table);
}

export async function createTable(data) {
  const table = await prisma.cafeTable.create({
    data: { ...data },
  });
  return serializeTable(table);
}

export async function updateTable(tableId, data) {
  const existing = await prisma.cafeTable.findFirst({
    where: { id: tableId },
  });
  if (!existing) throw new NotFoundError('Table');

  const table = await prisma.cafeTable.update({
    where: { id: tableId },
    data,
  });
  return serializeTable(table);
}

export async function deleteTable(tableId) {
  const existing = await prisma.cafeTable.findFirst({
    where: { id: tableId },
    include: { orders: { select: { id: true }, take: 1 } },
  });
  if (!existing) throw new NotFoundError('Table');
  if (existing.orders.length > 0) {
    throw new BadRequestError('Cannot delete table that has order history');
  }

  await prisma.cafeTable.delete({ where: { id: tableId } });
}

function serializeTable(table) {
  return {
    id: table.id,
    tableNumber: table.number,
    label: table.label,
    isActive: table.isActive,
  };
}
