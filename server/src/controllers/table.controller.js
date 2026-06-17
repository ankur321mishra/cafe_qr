import * as tableService from '../services/table.service.js';
import { success, created } from '../utils/apiResponse.js';

export async function listTables(req, res) {
  const tables = await tableService.listTables();
  return success(res, tables);
}

export async function validateTable(req, res) {
  const table = await tableService.validateTable(req.params.number);
  return success(res, table);
}

export async function createTable(req, res) {
  const table = await tableService.createTable(req.body);
  return created(res, table, 'Table created successfully');
}

export async function updateTable(req, res) {
  const table = await tableService.updateTable(req.params.id, req.body);
  return success(res, table, 'Table updated successfully');
}

export async function deleteTable(req, res) {
  await tableService.deleteTable(req.params.id);
  return success(res, null, 'Table deleted successfully');
}
