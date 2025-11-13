const express = require('express');
const router = express.Router();
const productController = require('../controllers/adminControllers/adminProductController.js');
const authenticateToken = require('../middleware/AuthenticationToken.js')

router.post("/adminAddProduct", authenticateToken, productController.adminAddProduct);

module.exports = router;