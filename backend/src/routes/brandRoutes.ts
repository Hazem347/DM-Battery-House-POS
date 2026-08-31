import { Router } from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getBrands);
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), createBrand);
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), updateBrand);
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), deleteBrand);

export default router;
