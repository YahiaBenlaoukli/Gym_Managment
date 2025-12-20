import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/AuthenticationToken.js';
import cartContoller from '../controllers/cartController.js';

router.post("/addToCart", authenticateToken, cartContoller.addToCart);
router.get("/viewCart", authenticateToken, cartContoller.viewCart);
router.put("/updateCartItem", authenticateToken, cartContoller.updateCartItemQuantity);
router.delete("/removeFromCart", authenticateToken, cartContoller.removeFromCart);
router.post("/confirmOrder", authenticateToken, cartContoller.confirmedOrder);
router.delete("/clearCart", authenticateToken, cartContoller.clearCart);

export default router;