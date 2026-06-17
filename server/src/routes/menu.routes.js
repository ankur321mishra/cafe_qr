import { Router } from 'express';
import * as menuController from '../controllers/menu.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { optionalAuthenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createItemSchema,
  updateItemSchema,
  createCategorySchema,
  updateCategorySchema,
  menuQuerySchema,
} from '../validators/menu.validator.js';

const router = Router();

// ---- Public endpoints (Customer facing) ----

router.get('/items', optionalAuthenticate, validate({ query: menuQuerySchema }), menuController.listItems);
router.get('/items/:id', menuController.getItem);
router.get('/categories', menuController.listCategories);

// ---- Protected endpoints (Admin facing) ----

// Menu Items
router.post(
  '/items',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  validate({ body: createItemSchema }),
  menuController.createItem
);

router.patch(
  '/items/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  validate({ body: updateItemSchema }),
  menuController.updateItem
);

router.patch(
  '/items/:id/availability',
  authenticate,
  authorize('ADMIN', 'MANAGER', 'STAFF'),
  menuController.toggleAvailability
);

router.delete(
  '/items/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  menuController.deleteItem
);

// Categories
router.post(
  '/categories',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  validate({ body: createCategorySchema }),
  menuController.createCategory
);

router.patch(
  '/categories/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  validate({ body: updateCategorySchema }),
  menuController.updateCategory
);

router.delete(
  '/categories/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  menuController.deleteCategory
);

export default router;
