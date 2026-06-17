import * as settingsService from '../services/settings.service.js';
import { success } from '../utils/apiResponse.js';

export async function getPublicSettings(req, res) {
  const settings = await settingsService.getSettings();
  return success(res, {
    name: settings.name,
    primaryColor: settings.primaryColor,
    taxRate: settings.taxRate,
    taxInclusive: settings.taxInclusive,
    currency: settings.currency,
    acceptOrders: settings.acceptOrders,
  });
}

export async function getSettings(req, res) {
  const settings = await settingsService.getSettings();
  return success(res, settings);
}

export async function updateSettings(req, res) {
  const settings = await settingsService.updateSettings(req.body);
  return success(res, settings, 'Settings updated successfully');
}
