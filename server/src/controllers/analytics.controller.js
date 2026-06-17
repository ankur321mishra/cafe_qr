import * as analyticsService from '../services/analytics.service.js';
import { success } from '../utils/apiResponse.js';

export async function getDashboard(req, res) {
  const stats = await analyticsService.getDashboardStats();
  return success(res, stats);
}

export async function getDailyRevenue(req, res) {
  const days = parseInt(req.query.days, 10) || 7;
  const revenue = await analyticsService.getDailyRevenue(days);
  return success(res, revenue);
}

export async function getTopItems(req, res) {
  const limit = parseInt(req.query.limit, 10) || 5;
  const items = await analyticsService.getTopItems(limit);
  return success(res, items);
}

export async function getCategorySales(req, res) {
  const categories = await analyticsService.getCategorySales();
  return success(res, categories);
}
