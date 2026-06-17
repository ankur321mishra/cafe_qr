import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/settings.validator.js';

const router = Router();

// Public endpoint (no auth required)
router.get('/public', settingsController.getPublicSettings);

// Protected endpoints
router.use(authenticate);
router.get('/', authorize('ADMIN', 'MANAGER'), settingsController.getSettings);

router.patch(
  '/',
  authorize('ADMIN'),
  validate({ body: updateSettingsSchema }),
  settingsController.updateSettings
);

export default router;
