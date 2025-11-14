const express = require('express');
const router = express.Router();
const productController = require('../../controllers/adminControllers/adminProductController.js');
const authenticateToken = require('../../middleware/AuthenticationToken.js')

router.post("/adminAddProduct", authenticateToken, productController.adminAddProduct);
router.delete("/adminDeleteProduct", authenticateToken, productController.adminDeleteProduct);
router.put("/adminUpdateProduct", authenticateToken, productController.adminUpdateProduct);

module.exports = router;    