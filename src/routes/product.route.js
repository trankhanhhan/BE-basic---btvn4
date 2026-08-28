import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { requireAdminRole } from '../middlewares/auth.middleware.js';
import { validateCreateProduct } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', requireAdminRole, validateCreateProduct, productController.createProduct);

export default router;