import { z } from 'zod';

export const createOrderSchema = z.object({
  tableNumber: z.number().int().positive('Table number must be a positive integer'),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Invalid menu item ID'),
        quantity: z.number().int().min(1).max(50, 'Maximum 50 per item'),
      })
    )
    .min(1, 'Order must contain at least one item')
    .max(30, 'Maximum 30 different items per order'),
  specialInstructions: z.string().max(500).optional().default(''),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PREPARING', 'READY', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Invalid status. Must be PREPARING, READY, COMPLETED, or CANCELLED' }),
  }),
});

export const orderQuerySchema = z.object({
  status: z.enum(['all', 'new', 'preparing', 'ready', 'completed', 'cancelled']).optional().default('all'),
  date: z.enum(['today', 'all']).optional().default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});
