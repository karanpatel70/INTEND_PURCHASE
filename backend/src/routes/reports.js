import { Router } from 'express';
import { wrap } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { listSummaries } from '../services/indentView.js';
import { toCsv } from '../services/exportService.js';

const router = Router();
const DEAD = ['REJECTED', 'CANCELLED'];

router.get('/stats', requireLogin, wrap(async (req, res) => {
  const rows = await listSummaries(req.user);
  const byStage = {};
  for (const r of rows) byStage[r.stage] = (byStage[r.stage] || 0) + 1;
  res.json({
    total: rows.length,
    open: rows.filter((r) => !['DONE', ...DEAD].includes(r.stage)).length,
    waitingForMe: rows.filter((r) => r.holder === req.user.id).length,
    approved: rows.filter((r) => r.stage === 'DONE').length,
    rejected: rows.filter((r) => r.stage === 'REJECTED').length,
    cancelled: rows.filter((r) => r.stage === 'CANCELLED').length,
    amountApproved: rows.filter((r) => r.stage === 'DONE').reduce((sum, r) => sum + r.total, 0),
    byStage,
  });
}));

router.get('/export', requireLogin, wrap(async (req, res) => {
  const rows = await listSummaries(req.user);
  const csv = toCsv(rows, [
    { key: 'no', label: 'Indent no.' }, { key: 'title', label: 'Item' }, { key: 'formCode', label: 'Form' },
    { key: 'byName', label: 'Created by' }, { key: 'stage', label: 'Stage' }, { key: 'holderName', label: 'With' },
    { key: 'total', label: 'Total (INR)' }, { key: 'po', label: 'PO number' }, { key: 'updatedAt', label: 'Last updated' },
  ]);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="indents.csv"');
  res.send(csv);
}));

export default router;
