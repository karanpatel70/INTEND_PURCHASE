import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { wrap, HttpError } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { getForm, getFormRow, checkIndenter } from '../services/formService.js';
import { listSummaries, getIndentFor } from '../services/indentView.js';
import { performAction, addHistory } from '../services/workflowEngine.js';

// Owner: Manvendra. List, open, create and edit indents.
//   GET  /api/indents        short rows for the lists (only the indents this user may see)
//   GET  /api/indents/:id    one full indent, with `people` (id -> name, designation, email)
//   POST /api/indents        { formCode, data: { indenter }, submit }   submit=false saves a draft
//   PUT  /api/indents/:id    same body; only the owner, only while Draft or Returned
// Approve, forward, reject ... are in routes/indentActions.js.
const router = Router();

router.get('/', requireLogin, wrap(async (req, res) => res.json(await listSummaries(req.user))));

router.get('/:id', requireLogin, wrap(async (req, res) => {
  const indent = await getIndentFor(prisma, req.user, req.params.id);
  if (!indent) throw new HttpError(404, 'Indent not found');
  if (indent.forbidden) throw new HttpError(403, 'You cannot open this indent.');
  res.json(indent);
}));

router.post('/', requireLogin, wrap(async (req, res) => {
  const { formCode, data, submit } = req.body;
  if (!data || !data.indenter) throw new HttpError(400, 'The indenter section is missing.');
  const templateRow = await getFormRow(formCode);
  if (!templateRow) throw new HttpError(404, 'Form not found');
  const template = await getForm(formCode);
  const checked = await checkIndenter(template, data.indenter, !!submit);
  const workflow = await prisma.workflowTemplate.findFirst({ where: { code: template.workflowCode }, orderBy: { version: 'desc' } });
  if (!workflow) throw new HttpError(500, 'The workflow is not loaded. Run npm run db:seed:templates.');

  const row = await prisma.$transaction(async (tx) => {
    // the number needs the new id, so we create the row first and then write the number
    const made = await tx.indent.create({
      data: {
        number: 'NEW-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8), formTemplateId: templateRow.id, workflowId: workflow.id, createdById: Number(req.user.id),
        holderId: Number(req.user.id), stage: 'DRAFT', total: checked.total, limitApplied: checked.limitApplied,
        data: { indenter: checked.values, accounts: null, purchase: null, po: null, _meta: {} },
      },
    });
    const number = `IND-${new Date().getFullYear()}-${String(made.id).padStart(4, '0')}`;
    await tx.indent.update({ where: { id: made.id }, data: { number } });
    if (!submit) await addHistory(tx, { indentId: made.id, actorId: req.user.id, action: 'draft', fromStage: 'DRAFT', toStage: 'DRAFT', kind: 'y', text: 'Saved a draft' });
    return made;
  });
  if (submit) await performAction(row.id, req.user, 'submit');
  res.status(201).json(await getIndentFor(prisma, req.user, row.id));
}));

router.put('/:id', requireLogin, wrap(async (req, res) => {
  const { formCode, data, submit } = req.body;
  const indent = await getIndentFor(prisma, req.user, req.params.id);
  if (!indent) throw new HttpError(404, 'Indent not found');
  if (indent.forbidden || indent.by !== req.user.id) throw new HttpError(403, 'Only the owner can edit this indent.');
  if (!['DRAFT', 'RETURNED'].includes(indent.stage)) throw new HttpError(400, 'This indent can no longer be edited.');
  const template = await getForm(formCode || indent.formCode);
  const checked = await checkIndenter(template, data.indenter, !!submit);
  const sections = { ...indent.data, indenter: checked.values };
  const saved = await prisma.indent.updateMany({
    where: { id: Number(indent.id), version: indent.version },
    data: { total: checked.total, limitApplied: checked.limitApplied, data: { ...sections, _meta: { trail: indent.trail, signs: indent.signs, rejIdx: indent.rejIdx, cancelIdx: indent.cancelIdx, cancel: indent.cancel } }, version: { increment: 1 } },
  });
  if (saved.count === 0) throw new HttpError(409, 'Someone else just changed this indent. Reload the page and try again.');
  if (submit) await performAction(indent.id, req.user, 'submit');
  res.json(await getIndentFor(prisma, req.user, indent.id));
}));

export default router;
