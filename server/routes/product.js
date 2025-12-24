import express from 'express';
const router = express.Router();
import productController from '../controllers/productController.js';

router.post("/showProductsByCategory", productController.showproductsbycategory);
router.get("/showAllProducts", productController.showallproducts);
router.post("/showProductDetails", productController.showproductdetails);
router.post("/searchProductsByName", productController.searchproductsbyname);
router.get("/getDiscountedProducts", productController.getDiscountedProducts);


export default router;