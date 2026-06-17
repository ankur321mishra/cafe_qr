import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'MANAGER'));

router.get('/dashboard', analyticsController.getDashboard);
router.get('/revenue', analyticsController.getDailyRevenue);
router.get('/top-items', analyticsController.getTopItems);
router.get('/categories', analyticsController.getCategorySales);

export default router;
