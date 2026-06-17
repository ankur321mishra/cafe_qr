import prisma from '../config/database.js';
import { NotFoundError, BadRequestError } from '../utils/apiError.js';

// ---- ITEMS ----

export async function listItems(filters = {}) {
  const where = {};

  if (filters.available !== 'false') {
    where.isAvailable = true;
  }
  if (filters.category) {
    const cat = await prisma.category.findUnique({
      where: { slug: filters.category },
    });
    if (cat) where.categoryId = cat.id;
  }
  if (filters.popular === 'true') where.isPopular = true;
  if (filters.featured === 'true') where.isFeatured = true;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: { select: { slug: true, name: true, emoji: true } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return items.map(serializeItem);
}

export async function listAllItems() {
  const items = await prisma.menuItem.findMany({
    include: { category: { select: { slug: true, name: true, emoji: true } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return items.map(serializeItem);
}

export async function getItem(itemId) {
  const item = await prisma.menuItem.findFirst({
    where: { id: itemId },
    include: { category: { select: { slug: true, name: true, emoji: true } } },
  });

  if (!item) throw new NotFoundError('Menu item');
  return serializeItem(item);
}

export async function createItem(data) {
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId },
  });
  if (!category) throw new BadRequestError('Invalid category');

  const item = await prisma.menuItem.create({
    data: { ...data },
    include: { category: { select: { slug: true, name: true, emoji: true } } },
  });

  return serializeItem(item);
}

export async function updateItem(itemId, data) {
  const existing = await prisma.menuItem.findFirst({
    where: { id: itemId },
  });
  if (!existing) throw new NotFoundError('Menu item');

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId },
    });
    if (!category) throw new BadRequestError('Invalid category');
  }

  const item = await prisma.menuItem.update({
    where: { id: itemId },
    data,
    include: { category: { select: { slug: true, name: true, emoji: true } } },
  });

  return serializeItem(item);
}

export async function toggleAvailability(itemId) {
  const existing = await prisma.menuItem.findFirst({
    where: { id: itemId },
  });
  if (!existing) throw new NotFoundError('Menu item');

  const item = await prisma.menuItem.update({
    where: { id: itemId },
    data: { isAvailable: !existing.isAvailable },
    include: { category: { select: { slug: true, name: true, emoji: true } } },
  });

  return serializeItem(item);
}

export async function deleteItem(itemId) {
  const existing = await prisma.menuItem.findFirst({
    where: { id: itemId },
  });
  if (!existing) throw new NotFoundError('Menu item');

  await prisma.menuItem.delete({ where: { id: itemId } });
}

// ---- CATEGORIES ----

export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return categories.map((c) => ({
    id: c.slug,
    _dbId: c.id,
    name: c.name,
    emoji: c.emoji,
    color: c.color,
  }));
}

export async function createCategory(data) {
  const category = await prisma.category.create({
    data: { ...data },
  });

  return {
    id: category.slug,
    _dbId: category.id,
    name: category.name,
    emoji: category.emoji,
    color: category.color,
  };
}

export async function updateCategory(categoryId, data) {
  const existing = await prisma.category.findFirst({
    where: { id: categoryId },
  });
  if (!existing) throw new NotFoundError('Category');

  const category = await prisma.category.update({
    where: { id: categoryId },
    data,
  });

  return {
    id: category.slug,
    _dbId: category.id,
    name: category.name,
    emoji: category.emoji,
    color: category.color,
  };
}

export async function deleteCategory(categoryId) {
  const existing = await prisma.category.findFirst({
    where: { id: categoryId },
    include: { items: { select: { id: true }, take: 1 } },
  });
  if (!existing) throw new NotFoundError('Category');
  if (existing.items.length > 0) {
    throw new BadRequestError('Cannot delete a category that still has menu items');
  }

  await prisma.category.delete({ where: { id: categoryId } });
}

// ---- Serializer ----

function serializeItem(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category.slug,
    image: item.image,
    isPopular: item.isPopular,
    isFeatured: item.isFeatured,
    isAvailable: item.isAvailable,
    tags: item.tags,
  };
}
