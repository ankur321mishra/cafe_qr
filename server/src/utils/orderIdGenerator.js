import prisma from '../config/database.js';

/**
 * Generate a sequential human-readable order number (e.g., ORD-001, ORD-002).
 * Uses the database to determine the next number — no in-memory counters that reset.
 */
export async function generateOrderNumber() {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { orderNumber: true },
  });

  let nextNum = 1;
  if (lastOrder?.orderNumber) {
    const match = lastOrder.orderNumber.match(/ORD-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `ORD-${String(nextNum).padStart(3, '0')}`;
}
