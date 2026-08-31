import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), createCategory);
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), updateCategory);
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), deleteCategory);

export default router;
