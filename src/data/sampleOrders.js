/**
 * Sample orders for dashboard demo.
 * Generates realistic order history for the past 7 days.
 */

const now = new Date();
const DAY_MS = 86400000;

function daysAgo(n) {
  return new Date(now.getTime() - n * DAY_MS).toISOString();
}

function hoursAgo(n) {
  return new Date(now.getTime() - n * 3600000).toISOString();
}

export const sampleOrders = [
  {
    id: 'ORD-001',
    tableNumber: 3,
    items: [
      { itemId: 'item-002', name: 'Cappuccino', quantity: 2, price: 199 },
      { itemId: 'item-017', name: 'Chocolate Cake', quantity: 1, price: 349 },
    ],
    subtotal: 747,
    tax: 37,
    total: 784,
    specialInstructions: 'Less sugar in cappuccino',
    status: 'completed',
    createdAt: hoursAgo(0.5),
    updatedAt: hoursAgo(0.2),
  },
  {
    id: 'ORD-002',
    tableNumber: 7,
    items: [
      { itemId: 'item-026', name: 'Margherita Pizza', quantity: 1, price: 449 },
      { itemId: 'item-012', name: 'Iced Coffee', quantity: 2, price: 189 },
    ],
    subtotal: 827,
    tax: 41,
    total: 868,
    specialInstructions: '',
    status: 'ready',
    createdAt: hoursAgo(0.8),
    updatedAt: hoursAgo(0.3),
  },
  {
    id: 'ORD-003',
    tableNumber: 1,
    items: [
      { itemId: 'item-009', name: 'Matcha Latte', quantity: 1, price: 249 },
      { itemId: 'item-023', name: 'Butter Croissant', quantity: 2, price: 159 },
    ],
    subtotal: 567,
    tax: 28,
    total: 595,
    specialInstructions: 'Extra hot please',
    status: 'preparing',
    createdAt: hoursAgo(0.3),
    updatedAt: hoursAgo(0.1),
  },
  {
    id: 'ORD-004',
    tableNumber: 5,
    items: [
      { itemId: 'item-028', name: 'Avocado Toast', quantity: 1, price: 299 },
      { itemId: 'item-003', name: 'Caffè Latte', quantity: 1, price: 219 },
      { itemId: 'item-020', name: 'Fudge Brownie', quantity: 1, price: 249 },
    ],
    subtotal: 767,
    tax: 38,
    total: 805,
    specialInstructions: 'Gluten-free bread for toast if available',
    status: 'new',
    createdAt: hoursAgo(0.1),
    updatedAt: hoursAgo(0.1),
  },
  {
    id: 'ORD-005',
    tableNumber: 2,
    items: [
      { itemId: 'item-007', name: 'Masala Chai', quantity: 3, price: 129 },
      { itemId: 'item-024', name: 'Club Sandwich', quantity: 2, price: 349 },
    ],
    subtotal: 1085,
    tax: 54,
    total: 1139,
    specialInstructions: '',
    status: 'completed',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(1.5),
  },
  {
    id: 'ORD-006',
    tableNumber: 9,
    items: [
      { itemId: 'item-013', name: 'Mango Smoothie', quantity: 2, price: 229 },
      { itemId: 'item-025', name: 'Caesar Salad', quantity: 1, price: 299 },
    ],
    subtotal: 757,
    tax: 38,
    total: 795,
    specialInstructions: 'No croutons in salad',
    status: 'completed',
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(2.5),
  },
  {
    id: 'ORD-007',
    tableNumber: 4,
    items: [
      { itemId: 'item-001', name: 'Espresso', quantity: 2, price: 149 },
      { itemId: 'item-018', name: 'Tiramisu', quantity: 1, price: 379 },
    ],
    subtotal: 677,
    tax: 34,
    total: 711,
    specialInstructions: '',
    status: 'completed',
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(3.5),
  },
  {
    id: 'ORD-008',
    tableNumber: 6,
    items: [
      { itemId: 'item-030', name: 'Classic Burger', quantity: 2, price: 399 },
      { itemId: 'item-016', name: 'Chocolate Frappé', quantity: 2, price: 269 },
      { itemId: 'item-022', name: 'Chocolate Chip Cookie', quantity: 3, price: 129 },
    ],
    subtotal: 1723,
    tax: 86,
    total: 1809,
    specialInstructions: 'No onions in burgers',
    status: 'completed',
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(4.2),
  },
  // Yesterday's orders
  {
    id: 'ORD-009',
    tableNumber: 3,
    items: [
      { itemId: 'item-002', name: 'Cappuccino', quantity: 1, price: 199 },
      { itemId: 'item-027', name: 'Pasta Alfredo', quantity: 1, price: 399 },
    ],
    subtotal: 598,
    tax: 30,
    total: 628,
    specialInstructions: '',
    status: 'completed',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ORD-010',
    tableNumber: 8,
    items: [
      { itemId: 'item-006', name: 'Cold Brew', quantity: 2, price: 229 },
      { itemId: 'item-017', name: 'Chocolate Cake', quantity: 2, price: 349 },
    ],
    subtotal: 1156,
    tax: 58,
    total: 1214,
    specialInstructions: '',
    status: 'completed',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ORD-011',
    tableNumber: 1,
    items: [
      { itemId: 'item-026', name: 'Margherita Pizza', quantity: 2, price: 449 },
      { itemId: 'item-015', name: 'Fresh Lime Soda', quantity: 4, price: 119 },
    ],
    subtotal: 1374,
    tax: 69,
    total: 1443,
    specialInstructions: 'Extra cheese on pizza',
    status: 'completed',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  // 2 days ago
  {
    id: 'ORD-012',
    tableNumber: 5,
    items: [
      { itemId: 'item-004', name: 'Mocha', quantity: 1, price: 249 },
      { itemId: 'item-019', name: 'New York Cheesecake', quantity: 1, price: 349 },
    ],
    subtotal: 598,
    tax: 30,
    total: 628,
    specialInstructions: '',
    status: 'completed',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'ORD-013',
    tableNumber: 7,
    items: [
      { itemId: 'item-029', name: 'Grilled Panini', quantity: 3, price: 329 },
      { itemId: 'item-007', name: 'Masala Chai', quantity: 3, price: 129 },
    ],
    subtotal: 1374,
    tax: 69,
    total: 1443,
    specialInstructions: '',
    status: 'completed',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  // 3 days ago
  {
    id: 'ORD-014',
    tableNumber: 2,
    items: [
      { itemId: 'item-003', name: 'Caffè Latte', quantity: 4, price: 219 },
      { itemId: 'item-021', name: 'Blueberry Muffin', quantity: 4, price: 179 },
    ],
    subtotal: 1592,
    tax: 80,
    total: 1672,
    specialInstructions: '',
    status: 'completed',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: 'ORD-015',
    tableNumber: 10,
    items: [
      { itemId: 'item-024', name: 'Club Sandwich', quantity: 1, price: 349 },
      { itemId: 'item-014', name: 'Berry Shake', quantity: 1, price: 249 },
    ],
    subtotal: 598,
    tax: 30,
    total: 628,
    specialInstructions: '',
    status: 'completed',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  // 4-6 days ago
  {
    id: 'ORD-016', tableNumber: 4, items: [{ itemId: 'item-002', name: 'Cappuccino', quantity: 3, price: 199 }], subtotal: 597, tax: 30, total: 627, specialInstructions: '', status: 'completed', createdAt: daysAgo(4), updatedAt: daysAgo(4),
  },
  {
    id: 'ORD-017', tableNumber: 6, items: [{ itemId: 'item-026', name: 'Margherita Pizza', quantity: 1, price: 449 }, { itemId: 'item-005', name: 'Americano', quantity: 2, price: 169 }], subtotal: 787, tax: 39, total: 826, specialInstructions: '', status: 'completed', createdAt: daysAgo(4), updatedAt: daysAgo(4),
  },
  {
    id: 'ORD-018', tableNumber: 3, items: [{ itemId: 'item-009', name: 'Matcha Latte', quantity: 2, price: 249 }, { itemId: 'item-028', name: 'Avocado Toast', quantity: 2, price: 299 }], subtotal: 1096, tax: 55, total: 1151, specialInstructions: '', status: 'completed', createdAt: daysAgo(5), updatedAt: daysAgo(5),
  },
  {
    id: 'ORD-019', tableNumber: 8, items: [{ itemId: 'item-030', name: 'Classic Burger', quantity: 1, price: 399 }, { itemId: 'item-012', name: 'Iced Coffee', quantity: 1, price: 189 }], subtotal: 588, tax: 29, total: 617, specialInstructions: '', status: 'completed', createdAt: daysAgo(5), updatedAt: daysAgo(5),
  },
  {
    id: 'ORD-020', tableNumber: 1, items: [{ itemId: 'item-013', name: 'Mango Smoothie', quantity: 3, price: 229 }, { itemId: 'item-023', name: 'Butter Croissant', quantity: 3, price: 159 }], subtotal: 1164, tax: 58, total: 1222, specialInstructions: '', status: 'completed', createdAt: daysAgo(6), updatedAt: daysAgo(6),
  },
];

/**
 * Generates daily revenue data for the past 7 days from orders.
 */
export function getDailyRevenue(orders) {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * DAY_MS);
    const dateStr = date.toISOString().split('T')[0];
    const dayOrders = orders.filter(o => o.createdAt.split('T')[0] === dateStr);
    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = dayOrders.length;
    days.push({
      day: dayNames[date.getDay()],
      date: dateStr,
      revenue,
      orders: orderCount,
    });
  }
  return days;
}

/**
 * Gets the most ordered items from order history.
 */
export function getTopItems(orders) {
  const itemCounts = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
      }
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].revenue += item.price * item.quantity;
    });
  });
  return Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export default sampleOrders;
