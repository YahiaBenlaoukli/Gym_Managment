import express from 'express';
const router = express.Router();
import adminAuthController from '../../controllers/adminControllers/adminAuthController.js';

router.post("/adminLogin", adminAuthController.loginAdmin);
router.post("/adminLogout", adminAuthController.logoutAdmin);

export default router; 