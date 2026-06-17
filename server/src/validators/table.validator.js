import { z } from 'zod';

export const createTableSchema = z.object({
  number: z.number().int().positive('Table number must be positive'),
  label: z.string().min(1).max(50),
  isActive: z.boolean().optional().default(true),
});

export const updateTableSchema = z.object({
  label: z.string().min(1).max(50).optional(),
  isActive: z.boolean().optional(),
});
