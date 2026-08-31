import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN', 'MANAGER', 'CASHIER']), getCustomers);
router.get('/:id', authenticate, authorize(['ADMIN', 'MANAGER', 'CASHIER']), getCustomerById);
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER', 'CASHIER']), createCustomer);
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), updateCustomer);
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), deleteCustomer);

export default router;
