import { Router } from 'express';
import { generateReceipt, exportSalesToExcel } from '../controllers/exportController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/receipt/:id', authenticate, generateReceipt);
router.get('/sales/excel', authenticate, authorize(['ADMIN', 'MANAGER']), exportSalesToExcel);

export default router;
