import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'The Brew House',
      description: 'Artisanal coffee and fresh pastries in the heart of the city.',
      email: 'hello@brewhouse.com',
      phone: '9876543210',
      currency: 'INR',
      taxRate: 5.0,
      taxInclusive: false,
      primaryColor: '#8B6F47',
      acceptOrders: true,
    },
  });
  console.log('✅ Created Settings:', settings.name);

  // 2. Create Admin user (admin@brewhouse.com / demo123)
  const passwordHash = await bcrypt.hash('demo123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@brewhouse.com' },
    update: {},
    create: {
      email: 'admin@brewhouse.com',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created Admin account:', admin.email);

  // 3. Create Tables
  const tableData = [
    { number: 1, label: 'Table 1', isActive: true },
    { number: 2, label: 'Table 2', isActive: true },
    { number: 3, label: 'Table 3', isActive: true },
    { number: 4, label: 'Table 4', isActive: true },
    { number: 5, label: 'Table 5', isActive: true },
    { number: 9, label: 'Table 9 (Outdoor)', isActive: true },
    { number: 10, label: 'Table 10 (Outdoor)', isActive: true },
    { number: 11, label: 'Table 11 (VIP)', isActive: false },
  ];

  for (const t of tableData) {
    await prisma.cafeTable.upsert({
      where: { number: t.number },
      update: {},
      create: t,
    });
  }
  console.log('✅ Created Tables');

  // 4. Create Categories
  const categoriesData = [
    { name: 'Coffee', slug: 'coffee', emoji: '☕', color: '#8B6F47', sortOrder: 1 },
    { name: 'Tea', slug: 'tea', emoji: '🍵', color: '#7A9E7E', sortOrder: 2 },
    { name: 'Cold Drinks', slug: 'cold-drinks', emoji: '🧊', color: '#5B9BD5', sortOrder: 3 },
    { name: 'Desserts', slug: 'desserts', emoji: '🍰', color: '#C07C56', sortOrder: 4 },
    { name: 'Food', slug: 'food', emoji: '🍽️', color: '#D4A852', sortOrder: 5 },
  ];

  const categoryMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categoryMap[c.slug] = cat.id;
  }
  console.log('✅ Created Categories');

  // 5. Create Menu Items
  const menuData = [
    {
      name: 'Espresso',
      description: 'A bold, concentrated shot of pure coffee with a rich crema on top.',
      price: 149,
      categoryId: categoryMap['coffee'],
      image: '/menu-images/espresso.jpg',
      isPopular: true,
      tags: ['hot', 'strong'],
    },
    {
      name: 'Cappuccino',
      description: 'Rich espresso topped with velvety steamed milk and a thick layer of frothy foam.',
      price: 199,
      categoryId: categoryMap['coffee'],
      image: '/menu-images/cappuccino.jpg',
      isPopular: true,
      isFeatured: true,
      tags: ['hot', 'bestseller'],
    },
    {
      name: 'Iced Coffee',
      description: 'Chilled freshly brewed coffee served over ice.',
      price: 189,
      categoryId: categoryMap['cold-drinks'],
      image: '/menu-images/iced-coffee.jpg',
      isPopular: true,
      tags: ['cold', 'refreshing'],
    },
    {
      name: 'Chocolate Cake',
      description: 'Decadent chocolate cake with fudge frosting.',
      price: 349,
      categoryId: categoryMap['desserts'],
      image: '/menu-images/chocolate-cake.jpg',
      isFeatured: true,
      tags: ['sweet', 'bestseller'],
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh tomatoes, mozzarella, and basil.',
      price: 449,
      categoryId: categoryMap['food'],
      image: '/menu-images/pizza.jpg',
      isPopular: true,
      tags: ['savory', 'sharing'],
    },
  ];

  for (const m of menuData) {
    await prisma.menuItem.create({
      data: m,
    });
  }
  console.log('✅ Created Menu Items');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
