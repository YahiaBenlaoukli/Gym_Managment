import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';
import authenticateToken from '../middleware/AuthenticationToken.js';

router.post("/register", authController.newUser);
router.post("/login", authController.login);
router.post("/verify_otp", authController.verifyOTP);
router.get("/profile", authenticateToken, authController.getProfile);
router.post("/logout", authController.logout);

export default router;