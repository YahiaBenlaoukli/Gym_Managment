const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const authenticateToken = require('../middleware/AuthenticationToken.js')

router.post("/showProductsByCategory", authenticateToken, productController.showproductsbycategory);
router.get("/showAllProducts", authenticateToken, productController.showallproducts);
router.post("/showProductDetails", authenticateToken, productController.showproductdetails);

module.exports = router;