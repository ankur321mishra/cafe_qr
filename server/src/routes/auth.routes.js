import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { loginSchema, registerSchema, createStaffSchema } from '../validators/auth.validator.js';

const router = Router();

// Public routes (rate limited)
router.post('/register', authLimiter, validate({ body: registerSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
router.post('/refresh', authLimiter, authController.refresh);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.get('/staff', authenticate, authorize('ADMIN'), authController.getStaff);
router.post('/staff', authenticate, authorize('ADMIN'), validate({ body: createStaffSchema }), authController.createStaff);

export default router;
