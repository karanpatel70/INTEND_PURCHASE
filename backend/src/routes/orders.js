import { Router } from 'express';
import { prisma, toId } from '../config/prisma.js';
import { wrap, HttpError } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { checkPassword } from '../services/authService.js';
import { orderView } from '../services/indentView.js';
import { addHistory } from '../services/workflowEngine.js';
import { sendMail, mails } from '../services/emailService.js';

// Owner: Sujeet. Purchase orders after they are issued (the PO exists once an indent is DONE).
//   GET  /api/orders              Purchase staff see all, an indenter sees only the orders of their own indents
//   POST /api/orders/:id/extend   { newDate, reason, password }   :id is the INDENT id (same as the frontend)
//   POST /api/orders/:id/deliver  { remarks, password }
//   POST /api/orders/:id/cancel   { reason, password }
// extend / deliver / cancel: Purchase staff only, and they must type their password again.
const router = Router();
const day = (d) => new Date(d).toISOString().slice(0, 10);
const isPurchase = (u) => u.tiers.some((t) => t[0] === 'p');

router.get('/', requireLogin, wrap(async (req, res) => {
  const orders = await prisma.purchaseOrder.findMany({ orderBy: { id: 'desc' } });
  const indents = await prisma.indent.findMany({ where: { id: { in: orders.map((o) => o.indentId) } } });
  const rows = [];
  for (const o of orders) {
    const i = indents.find((x) => x.id === o.indentId);
    if (!i) continue;
    if (!isPurchase(req.user) && String(i.createdById) !== req.user.id) continue;
    rows.push({
      id: String(i.id), no: i.number, title: (i.data.indenter || {}).title || '', po: o.poNumber, stage: i.stage,
      vendor: o.vendor, date: day(o.orderDate), byDate: day(o.dueDate), order: orderView(o),
    });
  }
  res.json(rows);
}));

// shared steps of the three actions: purchase staff only, password again, the order must still be open
async function openOrder(req) {
  if (!isPurchase(req.user)) throw new HttpError(403, 'Only the Purchase section can do this.');
  const row = await prisma.user.findUnique({ where: { id: Number(req.user.id) } });
  if (!(await checkPassword(req.body.password || '', row.passwordHash))) throw new HttpError(401, 'Wrong password.');
  const order = await prisma.purchaseOrder.findUnique({ where: { indentId: toId(req.params.id) } });
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.status !== 'open') throw new HttpError(400, 'This order is already closed.');
  const indent = await prisma.indent.findUnique({ where: { id: order.indentId } });
  return { order, indent };
}

async function save(order, indent, req, { status, due, patch, text, kind, remark, mail }) {
  const data = { ...(order.data || { ext: [] }), ...patch };
  await prisma.purchaseOrder.update({ where: { id: order.id }, data: { status: status || order.status, dueDate: due || order.dueDate, data } });
  await addHistory(prisma, { indentId: indent.id, actorId: req.user.id, action: 'order', fromStage: 'DONE', toStage: 'DONE', kind, text, remark });
  const owner = await prisma.user.findUnique({ where: { id: indent.createdById } });
  if (owner) sendMail(owner.email, ...mails.poDue({ no: indent.number }, order.poNumber, mail));
}

router.post('/:id/extend', requireLogin, wrap(async (req, res) => {
  const { order, indent } = await openOrder(req);
  const { newDate, reason } = req.body;
  if (!newDate || !reason) throw new HttpError(400, 'Give the new date and the reason.');
  if (new Date(newDate) <= new Date(order.dueDate)) throw new HttpError(400, 'The new date must be after the current delivery date.');
  const ext = [...((order.data || {}).ext || []), { from: day(order.dueDate), to: newDate, reason, by: req.user.id, t: new Date().toISOString() }];
  await save(order, indent, req, { due: new Date(newDate), patch: { ext }, kind: 'y', text: `Extended the delivery of ${order.poNumber} to ${newDate}`, remark: reason, mail: `was extended to ${newDate}` });
  res.json({ ok: true });
}));

router.post('/:id/deliver', requireLogin, wrap(async (req, res) => {
  const { order, indent } = await openOrder(req);
  await save(order, indent, req, { status: 'delivered', patch: { deliveredOn: day(new Date()) }, kind: 'g', text: 'Marked the order as delivered', remark: req.body.remarks, mail: 'was marked as delivered' });
  res.json({ ok: true });
}));

router.post('/:id/cancel', requireLogin, wrap(async (req, res) => {
  const { order, indent } = await openOrder(req);
  if (!req.body.reason) throw new HttpError(400, 'Give a reason for cancelling.');
  const cancel = { reason: req.body.reason, by: req.user.id, t: new Date().toISOString() };
  await save(order, indent, req, { status: 'cancelled', patch: { cancel }, kind: 'r', text: `Cancelled purchase order ${order.poNumber}`, remark: req.body.reason, mail: 'was cancelled' });
  res.json({ ok: true });
}));

export default router;
