import express from 'express';
const router = express.Router();
import adminorderController from '../../controllers/adminControllers/adminOrderController.js';
import authenticateToken from '../../middleware/adminAuthenticateToken.js';

router.get("/getOrderDetails", authenticateToken, adminorderController.getOrderDetails);
router.get("/getOrdersByStatus", authenticateToken, adminorderController.getOrdersByStatus);
router.delete("/deleteOrder", authenticateToken, adminorderController.deleteOrder);
router.put("/orderShipped", authenticateToken, adminorderController.orderShipped);
router.put("/orderDelivered", authenticateToken, adminorderController.orderDelivered);
router.put("/orderCancelled", authenticateToken, adminorderController.orderCancelled);
router.get("/getAllOrders", authenticateToken, adminorderController.getAllOrders);

export default router;