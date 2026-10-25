import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { wrap, HttpError } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { performAction, targetsFor } from '../services/workflowEngine.js';
import { getIndentFor } from '../services/indentView.js';

// Owner: Karan. Every button on an indent. All of them call workflowEngine.performAction().
//   POST /api/indents/:id/submit    (owner) send the draft to the HOD
//   POST /api/indents/:id/cancel    (owner) { remark }
//   POST /api/indents/:id/approve   { target, remark }       target = person id (not needed for "Generate PO")
//   POST /api/indents/:id/forward   { target, remark }
//   POST /api/indents/:id/fill      { section, values }
//   POST /api/indents/:id/revise    { target, remark }       remark is required
//   POST /api/indents/:id/reject    { remark }               remark is required
//   POST /api/indents/:id/reroute   (Admin) { target, remark }
//   POST /api/indents/:id/reset     (Admin) { point, target, remark }
//   POST /api/indents/:id/delete    (Admin)
//   GET  /api/indents/:id/targets/:action   people for the dialog: { groups, prefer }
const router = Router();
const ACTIONS = ['submit', 'cancel', 'approve', 'forward', 'fill', 'revise', 'reject', 'reroute', 'reset', 'delete'];

router.get('/:id/targets/:action', requireLogin, wrap(async (req, res) => {
  if (!['approve', 'forward', 'revise'].includes(req.params.action)) throw new HttpError(400, 'Unknown action.');
  res.json(await targetsFor(req.params.id, req.params.action));
}));

router.post('/:id/:action', requireLogin, wrap(async (req, res) => {
  const { id, action } = req.params;
  if (!ACTIONS.includes(action)) throw new HttpError(404, 'Unknown action.');
  const done = await performAction(id, req.user, action, req.body || {});
  if (done && done.deleted) return res.json({ ok: true, deleted: true });
  res.json(await getIndentFor(prisma, req.user, id));
}));

export default router;
