import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes (or basic authenticated, depending on requirements)
// Let's assume anyone can view products, but only admin/manager can create/edit.
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), createProduct);
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), deleteProduct);

export default router;
