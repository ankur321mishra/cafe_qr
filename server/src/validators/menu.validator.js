import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().int().positive('Price must be a positive integer (in paise)'),
  categoryId: z.string().uuid('Invalid category ID'),
  image: z.string().optional().nullable(),
  isPopular: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  price: z.number().int().positive().optional(),
  categoryId: z.string().uuid().optional(),
  image: z.string().optional().nullable(),
  isPopular: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  emoji: z.string().max(4).optional().default('🍽️'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code').optional().default('#8B6F47'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  emoji: z.string().max(4).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const menuQuerySchema = z.object({
  category: z.string().optional(),
  popular: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().max(100).optional(),
  available: z.enum(['true', 'false']).optional().default('true'),
});
