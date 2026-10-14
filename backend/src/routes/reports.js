import { Router } from 'express';

// Owner: Rahul. Dashboard stats (/reports/stats) and Excel/PDF exports (/reports/export).
const router = Router();

router.get('/stats', (req, res) => res.status(501).json({ error: 'Not built yet' }));
router.get('/export', (req, res) => res.status(501).json({ error: 'Not built yet' }));

export default router;
