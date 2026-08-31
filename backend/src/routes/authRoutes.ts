import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/login', login);
// In a real system, registration might be restricted to ADMIN, but we'll leave it open for setup.
router.post('/register', register);
router.get('/me', authenticate, getMe);

export default router;
