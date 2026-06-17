import prisma from '../config/database.js';
import { NotFoundError } from '../utils/apiError.js';

export async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: 'default' } });
  
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 'default',
        name: 'My Cafe',
      }
    });
  }

  return {
    name: settings.name,
    description: settings.description,
    email: settings.email,
    phone: settings.phone,
    currency: settings.currency,
    taxRate: settings.taxRate,
    taxInclusive: settings.taxInclusive,
    acceptOrders: settings.acceptOrders,
    primaryColor: settings.primaryColor,
    logoUrl: settings.logoUrl,
  };
}

export async function updateSettings(data) {
  const settings = await prisma.settings.update({
    where: { id: 'default' },
    data,
  });

  return {
    name: settings.name,
    description: settings.description,
    email: settings.email,
    phone: settings.phone,
    currency: settings.currency,
    taxRate: settings.taxRate,
    taxInclusive: settings.taxInclusive,
    acceptOrders: settings.acceptOrders,
    primaryColor: settings.primaryColor,
    logoUrl: settings.logoUrl,
  };
}
