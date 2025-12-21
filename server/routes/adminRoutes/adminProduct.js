import express from 'express';
const router = express.Router();
import adminproductController from '../../controllers/adminControllers/adminProductController.js';
import productController from '../../controllers/productController.js';
import authenticateToken from '../../middleware/adminAuthenticateToken.js';

router.post("/adminAddProduct", authenticateToken, adminproductController.uploadProductImages, adminproductController.adminAddProduct);
router.delete("/adminDeleteProduct", authenticateToken, adminproductController.adminDeleteProduct);
router.put("/adminUpdateProduct", authenticateToken, adminproductController.adminUpdateProduct);
router.put("/adminDiscountProduct", authenticateToken, adminproductController.adminDiscountProduct);
router.get("/dashboardStats", authenticateToken, adminproductController.dashboardStats);
router.get("/showAllProducts", authenticateToken, productController.showallproducts);
router.post("/showProductDetails", authenticateToken, productController.showproductdetails);
router.post("/searchProductsByName", authenticateToken, productController.searchproductsbyname);
router.post("/showProductsByCategory", authenticateToken, productController.showproductsbycategory);

export default router;