import { Router } from 'express';
import { createSale, getSales, getSaleById } from '../controllers/saleController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Cashiers, Managers, Admins can all view and create sales
router.get('/', getSales);
router.get('/:id', getSaleById);
router.post('/', createSale);

export default router;
