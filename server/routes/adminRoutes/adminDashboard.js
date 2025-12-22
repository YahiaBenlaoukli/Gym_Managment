import express from 'express';
import { getDashboardAnalytics } from '../../controllers/adminControllers/adminDashboardController.js';
import authenticateToken from '../../middleware/adminAuthenticateToken.js';

const router = express.Router();

router.get('/analytics', authenticateToken, getDashboardAnalytics);

export default router;
