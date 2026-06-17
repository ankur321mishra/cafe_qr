import * as orderService from '../services/order.service.js';
import { success, created } from '../utils/apiResponse.js';

export async function createOrder(req, res) {
  const order = await orderService.createOrder(req.body);
  return created(res, order, 'Order created successfully');
}

export async function getOrder(req, res) {
  const order = await orderService.getOrder(req.params.id);
  return success(res, order);
}

export async function listOrders(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await orderService.listOrders({
    ...req.query,
    page,
    limit,
  });

  return success(res, result);
}

export async function updateOrderStatus(req, res) {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  return success(res, order, 'Order status updated');
}

export async function deleteOrder(req, res) {
  await orderService.deleteOrder(req.params.id);
  return success(res, null, 'Order deleted successfully');
}
