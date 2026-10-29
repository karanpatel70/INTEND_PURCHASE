import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { wrap } from '../middleware/errorHandler.js';

// Owner: Manvendra. GET /api/lists -> { department: [...], budgetHead: [...], designation: [...], deliveryPeriod: [...] }
// Public on purpose: the sign-up page needs the department list before anyone is signed in.
// The Admin changes the lists in routes/admin.js.
const router = Router();

router.get('/', wrap(async (req, res) => {
  const rows = await prisma.listItem.findMany({ orderBy: { id: 'asc' } });
  const out = { department: [], budgetHead: [], designation: [], deliveryPeriod: [] };
  for (const r of rows) (out[r.list] = out[r.list] || []).push(r.value);
  res.json(out);
}));

export default router;
