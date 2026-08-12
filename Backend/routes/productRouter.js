import express from 'express';
import { createProduct, createProductReview, deleteProduct, getAllProducts, getSingleProduct, productUpdate , viewProductReview ,getAllProductsByAdmin , adminDeleteReview} from '../controllers/productController.js';
import { roleBasedAccess, verifyUser } from '../helper/userAuth.js';

const router = express.Router();

//function chaining

//user side 
router.get("/products",getAllProducts)
router.route("/product/:id").get(getSingleProduct)
router.route("/review").put(verifyUser,createProductReview)

//Admin (admin only can add , update , delete)
router.route("/admin/product/create" ).post(verifyUser,roleBasedAccess("admin"),createProduct)
router.route('/admin/product/product/:id').put(verifyUser,roleBasedAccess("admin"),productUpdate).delete(verifyUser,roleBasedAccess("admin"),deleteProduct)
//AdminView All Products
router.route("/admin/products").get(verifyUser,roleBasedAccess("admin"),getAllProductsByAdmin)

//View Review & Delete Review
router.route("/admin/reviews").get(verifyUser,roleBasedAccess("admin"),viewProductReview).delete(verifyUser,roleBasedAccess("admin"),adminDeleteReview)



export default router 
