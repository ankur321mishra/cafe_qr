import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { orderLimiter } from '../middleware/rateLimiter.js';
import { createOrderSchema, updateStatusSchema, orderQuerySchema } from '../validators/order.validator.js';

const router = Router();

// ---- Public endpoints (Customer facing) ----

// Create an order (rate limited to prevent spam)
router.post(
  '/',
  orderLimiter,
  validate({ body: createOrderSchema }),
  orderController.createOrder
);

// Get order status (public, customer tracking)
router.get('/:id', orderController.getOrder);

// ---- Protected endpoints (Admin facing) ----

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'MANAGER', 'STAFF'),
  validate({ query: orderQuerySchema }),
  orderController.listOrders
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'MANAGER', 'STAFF'),
  validate({ body: updateStatusSchema }),
  orderController.updateOrderStatus
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  orderController.deleteOrder
);

export default router;
