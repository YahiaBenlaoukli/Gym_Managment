const express = require('express');
const router = express.Router();
const adminproductController = require('../../controllers/adminControllers/adminProductController.js');
const productController = require('../../controllers/productController.js');
const authenticateToken = require('../../middleware/adminAuthenticateToken.js')

router.post("/adminAddProduct", authenticateToken, adminproductController.uploadProductImages, adminproductController.adminAddProduct);
router.delete("/adminDeleteProduct", authenticateToken, adminproductController.adminDeleteProduct);
router.put("/adminUpdateProduct", authenticateToken, adminproductController.adminUpdateProduct);
router.put("/adminDiscountProduct", authenticateToken, adminproductController.adminDiscountProduct);
router.get("/dashboardStats", authenticateToken, adminproductController.dashboardStats);
router.get("/showAllProducts", authenticateToken, productController.showallproducts);
router.post("/showProductDetails", authenticateToken, productController.showproductdetails);
router.post("/searchProductsByName", authenticateToken, productController.searchproductsbyname);

module.exports = router;