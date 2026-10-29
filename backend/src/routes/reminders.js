import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { wrap } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { runReminders } from '../services/reminderJob.js';

// Owner: Sujeet. For the Admin only.
//   GET  /api/reminders        the last 100 reminders that were sent
//   POST /api/reminders/run    run the daily job now (handy for testing the emails)
const router = Router();

router.get('/', requireLogin, requireRole('admin'), wrap(async (req, res) => {
  res.json(await prisma.reminder.findMany({ orderBy: { id: 'desc' }, take: 100 }));
}));

router.post('/run', requireLogin, requireRole('admin'), wrap(async (req, res) => {
  res.json(await runReminders());
}));

export default router;
