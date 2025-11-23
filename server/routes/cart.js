const express = require('express');
const router = express.Router();
const cartContoller = require('../controllers/cartController.js');
const authenticateToken = require('../middleware/AuthenticationToken.js')

router.post("/addToCart", authenticateToken, cartContoller.addToCart);
router.get("/viewCart", authenticateToken, cartContoller.viewCart);
router.put("/updateCartItem", authenticateToken, cartContoller.updateCartItemQuantity);
router.delete("/removeFromCart", authenticateToken, cartContoller.removeFromCart);
router.post("/confirmOrder", authenticateToken, cartContoller.confirmedOrder);
router.delete("/clearCart", authenticateToken, cartContoller.clearCart);