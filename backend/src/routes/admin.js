import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { toId } from '../config/prisma.js';
import { wrap, HttpError } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { requireLogin } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { listApiUsers, roleFromKey, statusFromApi, departmentId, giveFirstPassword } from '../services/authService.js';
import { listCurrentLimits, addLimit } from '../services/limitService.js';
import { logAction } from '../services/workflowEngine.js';

// Owner: Sujeet. The Admin's tools.
//   GET  /api/admin/users          every user (also the ones waiting for approval)
//   PUT  /api/admin/users/:id      { status, role, dept, desig }   authorise, block, decline, change role
//   PUT  /api/admin/users/new      { name, email, dept, role }     the Admin creates a user directly
//   GET  /api/admin/limits         the limit in force now, per form and rule (any signed-in user may read it)
//   POST /api/admin/limits         { formCode, rule, amount, reason, effectiveFrom }  adds a NEW row, never edits
//   POST   /api/admin/lists        { list, value }       add a dropdown value
//   DELETE /api/admin/lists/:list/:value                 remove one
const router = Router();
const admin = [requireLogin, requireRole('admin')];

router.get('/users', ...admin, wrap(async (req, res) => res.json(await listApiUsers())));

router.put('/users/:id', ...admin, wrap(async (req, res) => {
  const { status, role, dept, desig, name, email } = req.body;

  // the Admin creates a user directly (active at once, first password is emailed)
  if (req.params.id === 'new') {
    if (!name || !email) throw new HttpError(400, 'Fill in the name and the email.');
    const mail = email.includes('@') ? email.toLowerCase() : email.toLowerCase() + '@iitrpr.ac.in';
    if (await prisma.user.findUnique({ where: { email: mail } })) throw new HttpError(409, 'This email is already registered.');
    const row = await prisma.user.create({
      data: { name, email: mail, role: roleFromKey(role), designation: desig || null, departmentId: await departmentId(prisma, dept), status: 'active', passwordHash: null },
    });
    await giveFirstPassword(row);
    await logAction(req.user.id, 'user_created', mail, null, { role });
    return res.json({ ok: true });
  }

  const row = await prisma.user.findUnique({ where: { id: toId(req.params.id) } });
  if (!row) throw new HttpError(404, 'User not found');
  const change = {};
  if (status) change.status = statusFromApi(status);
  if (role) change.role = roleFromKey(role);
  if (desig !== undefined) change.designation = desig || null;
  if (dept !== undefined) change.departmentId = await departmentId(prisma, dept);
  if (row.id === Number(req.user.id) && change.status && change.status !== 'active') throw new HttpError(400, 'You cannot block yourself.');
  const saved = await prisma.user.update({ where: { id: row.id }, data: change });
  if (row.status !== 'active' && saved.status === 'active') await giveFirstPassword(saved);
  await logAction(req.user.id, 'user_changed', row.email, { status: row.status, role: row.role }, change);
  res.json({ ok: true });
}));

router.get('/limits', requireLogin, wrap(async (req, res) => res.json(await listCurrentLimits())));

const limitSchema = z.object({
  formCode: z.string().min(1), rule: z.string().min(1), amount: z.number().positive('Enter an amount above zero.'),
  reason: z.string().optional(), effectiveFrom: z.string().optional(),
});
router.post('/limits', ...admin, validate(limitSchema), wrap(async (req, res) => {
  await addLimit(req.body, req.user.id);
  await logAction(req.user.id, 'limit_added', req.body.formCode + ' / ' + req.body.rule, null, req.body);
  res.json({ ok: true });
}));

router.post('/lists', ...admin, wrap(async (req, res) => {
  const { list, value } = req.body;
  if (!list || !value) throw new HttpError(400, 'Give the list and the value.');
  const found = await prisma.listItem.findFirst({ where: { list, value } });
  if (!found) await prisma.listItem.create({ data: { list, value } });
  res.json({ ok: true });
}));

router.delete('/lists/:list/:value', ...admin, wrap(async (req, res) => {
  await prisma.listItem.deleteMany({ where: { list: req.params.list, value: req.params.value } });
  res.json({ ok: true });
}));

export default router;
