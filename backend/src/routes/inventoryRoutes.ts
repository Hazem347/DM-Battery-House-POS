import { Router } from 'express';
import { getInventory, addStock, adjustStock, getInventoryHistory } from '../controllers/inventoryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Everyone authenticated can view inventory
router.get('/', getInventory);
router.get('/history/:productId', getInventoryHistory);

// Only admins and managers can modify inventory
router.post('/add', authorize(['ADMIN', 'MANAGER']), addStock);
router.post('/adjust', authorize(['ADMIN', 'MANAGER']), adjustStock);

export default router;
