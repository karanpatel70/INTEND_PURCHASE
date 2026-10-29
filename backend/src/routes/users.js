import { Router } from 'express';
import { wrap } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { listApiUsers } from '../services/authService.js';

const router = Router();

router.get('/', requireLogin, wrap(async (req, res) => {
  res.json(await listApiUsers(undefined, { status: 'active' }));
}));

export default router;
