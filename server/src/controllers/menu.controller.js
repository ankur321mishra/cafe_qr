import * as menuService from '../services/menu.service.js';
import { success, created } from '../utils/apiResponse.js';

// ---- Public endpoints ----

export async function listItems(req, res) {
  if (req.user) {
    // For admin access, return all
    const items = await menuService.listAllItems();
    return success(res, items);
  }

  const items = await menuService.listItems(req.query);
  return success(res, items);
}

export async function getItem(req, res) {
  const item = await menuService.getItem(req.params.id);
  return success(res, item);
}

export async function listCategories(req, res) {
  const categories = await menuService.listCategories();
  return success(res, categories);
}

// ---- Admin endpoints ----

export async function createItem(req, res) {
  const item = await menuService.createItem(req.body);
  return created(res, item, 'Item created successfully');
}

export async function updateItem(req, res) {
  const item = await menuService.updateItem(req.params.id, req.body);
  return success(res, item, 'Item updated successfully');
}

export async function toggleAvailability(req, res) {
  const item = await menuService.toggleAvailability(req.params.id);
  return success(res, item, 'Item availability updated');
}

export async function deleteItem(req, res) {
  await menuService.deleteItem(req.params.id);
  return success(res, null, 'Item deleted successfully');
}

export async function createCategory(req, res) {
  const category = await menuService.createCategory(req.body);
  return created(res, category, 'Category created successfully');
}

export async function updateCategory(req, res) {
  const category = await menuService.updateCategory(req.params.id, req.body);
  return success(res, category, 'Category updated successfully');
}

export async function deleteCategory(req, res) {
  await menuService.deleteCategory(req.params.id);
  return success(res, null, 'Category deleted successfully');
}
