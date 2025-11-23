const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const authenticateToken = require('../middleware/AuthenticationToken.js')

router.post("/showProductsByCategory", productController.showproductsbycategory);
router.get("/showAllProducts", productController.showallproducts);
router.post("/showProductDetails", productController.showproductdetails);
router.post("/searchProductsByName", productController.searchproductsbyname);

module.exports = router;