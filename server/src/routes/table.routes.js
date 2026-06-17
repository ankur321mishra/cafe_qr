import { Router } from 'express';
import * as tableController from '../controllers/table.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createTableSchema, updateTableSchema } from '../validators/table.validator.js';

const router = Router();

// Public validation endpoint for QR code scans
router.get('/validate/:number', tableController.validateTable);

// Protected admin endpoints
router.use(authenticate);

router.get('/', authorize('ADMIN', 'MANAGER', 'STAFF'), tableController.listTables);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER'),
  validate({ body: createTableSchema }),
  tableController.createTable
);

router.patch(
  '/:id',
  authorize('ADMIN', 'MANAGER'),
  validate({ body: updateTableSchema }),
  tableController.updateTable
);

router.delete('/:id', authorize('ADMIN'), tableController.deleteTable);

export default router;
