// Owner: Karan. The heart of the system.
// performAction(indentId, user, action, payload):
//   1 load indent + its workflow template
//   2 check this user may act at this step
//   3 move to the next step (approve / forward / fill / revise / reject)
//   4 write IndentHistory
//   5 queue the email
// All inside ONE database transaction, with a version check.

// --- Audit log (was auditService) ---
// Owner: Karan. logAction(userId, what, before, after) writes to AuditLog.
// Owner: Karan. The heart of the system. It follows shared/workflows/standard.json exactly.
//
// Two layers, on purpose:
//   decide(...)        PURE logic. Looks at the indent + the action and says what must change. No database here,
//                      so it is easy to read and to test.
//   performAction(...) The database part. Loads the indent, calls decide(), saves everything in ONE transaction
//                      (with a version check), then sends the emails.
import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import { stages, stageForTier, resetPoints, buttonState, isOpen, SECTION_NAMES } from '../../../shared/workflow.js';
import { nameDesig } from '../../../shared/roles.js';
import { loadIndent, getIndentFor, SECTIONS } from './indentView.js';
import { getApiUser, listApiUsers } from './authService.js';
import { getForm, checkSection } from './formService.js';
import { sendMail, mails } from './emailService.js';

const today = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- who can receive an indent
// Can this person be picked for a tier?  hod = HOD of the owner's department.
// final = the Registrar, or the HOD of the owner's department.
export function eligibleFor(tier, person, owner) {
  if (person.status !== 'authorised') return false;
  if (tier === 'hod') return person.tiers.includes('hod') && person.dept === owner.dept;
  if (tier === 'final') return person.tiers.includes('final') && (!person.tiers.includes('hod') || person.dept === owner.dept);
  return person.tiers.includes(tier);
}

// The people shown in the dialog of approve / forward / revise: { groups: [{label, people}], prefer: [ids] }
export function listTargets({ indent, owner, users, action }) {
  const pick = (u) => ({ id: u.id, name: u.name, desig: u.desig, email: u.email, tiers: u.tiers });
  if (action === 'revise') {
    const earlier = [...new Set(indent.trail.map((x) => x.pid))].filter((p) => p !== indent.by);
    const people = earlier.map((id) => users.find((u) => u.id === id)).filter(Boolean).map(pick);
    return { groups: [{ label: 'Indenter', people: [pick(owner)] }, ...(people.length ? [{ label: 'Earlier in the path', people }] : [])], prefer: [] };
  }
  const st = stages[indent.stage];
  const tiers = (action === 'approve' ? st.approve && st.approve.to : st.forward) || [];
  const tierLabels = { a_top: 'AR/DR/JR (Accounts)', a_mid: 'JAO/AO (Accounts)', a_low: 'JAA/SAA (Accounts)', p_top: 'AR/DR/JR (Purchase)', p_mid: 'JS/Supdt. (Purchase)', p_low: 'OA/JA/SA (Purchase)', final: 'Final approver', hod: 'HOD' };
  const groups = tiers
    .map((t) => ({ label: tierLabels[t], people: users.filter((u) => eligibleFor(t, u, owner)).map(pick) }))
    .filter((g) => g.people.length);
  return { groups, prefer: indent.trail.map((x) => x.pid) };
}

// ---------------------------------------------------------------- the pure decision
// indent  = the frontend-shaped indent (see indentView.js)
// actor   = the signed-in user, owner = the user who created the indent, target = the person chosen in the dialog
// Returns a "patch": what to change + the history line + who to email.
export function decide({ indent, actor, owner, target, action, payload = {}, poNumber, now = new Date().toISOString() }) {
  const st = stages[indent.stage];
  const remark = String(payload.remark || '').trim();
  const fail = (message, status = 400) => { throw new HttpError(status, message); };
  const isAdmin = actor.tiers.includes('admin');
  const holds = indent.holder === actor.id;
  const isOwner = indent.by === actor.id;
  if (payload.version !== undefined && Number(payload.version) !== indent.version) {
    fail('Someone else just changed this indent. Reload the page and try again.', 409);
  }

  // a fresh copy of the things an action may change
  const patch = {
    stage: indent.stage, holder: indent.holder, trail: [...indent.trail], signs: JSON.parse(JSON.stringify(indent.signs || {})),
    clear: [], sections: {}, rejIdx: indent.rejIdx, cancelIdx: indent.cancelIdx, cancel: indent.cancel, po: null, notify: [],
    event: null, // { kind: g|y|o|r, text, remark }
  };
  const event = (kind, text) => { patch.event = { kind, text, remark }; };
  const needHolder = () => { if (!holds) fail('This indent is not with you right now.', 403); };
  const needTarget = (tiers) => {
    if (!target) fail('Choose who it goes to.');
    const ok = tiers.some((t) => eligibleFor(t, target, owner));
    if (!ok) fail('That person cannot receive it at this step.');
  };
  // write my signature for this stage (HOD, final, or a section + tier)
  const sign = () => {
    const mark = { pid: actor.id, t: now };
    if (st.tier === 'hod') patch.signs.hod = mark;
    else if (st.tier === 'final') patch.signs.final = mark;
    else if (st.fillSection) patch.signs[st.fillSection] = { ...(patch.signs[st.fillSection] || {}), [st.tier]: mark };
  };
  // Who handled it so far. If the indent goes back to someone already in the trail, cut the trail there.
  const moveTrail = (to) => {
    const at = patch.trail.findIndex((x) => x.pid === to.id);
    if (at >= 0) patch.trail = patch.trail.slice(0, at);
    else patch.trail.push({ pid: actor.id, stage: indent.stage });
  };

  switch (action) {
    case 'submit': {
      if (!isOwner) fail('Only the person who created the indent can submit it.', 403);
      if (!['DRAFT', 'RETURNED'].includes(indent.stage)) fail('This indent is already submitted.');
      if (!target) fail('No HOD found for your department. Ask the Admin.');
      event('y', indent.stage === 'DRAFT' ? 'Created the indent and submitted it to HOD' : 'Submitted the indent to HOD');
      Object.assign(patch, { stage: 'HOD', holder: target.id, trail: [], signs: {}, clear: ['accounts', 'purchase', 'po'] });
      patch.notify = [target.id];
      break;
    }
    case 'cancel': {
      if (!isOwner) fail('Only the person who created the indent can cancel it.', 403);
      if (!isOpen(indent) || indent.stage === 'DONE') fail('This indent can no longer be cancelled.');
      if (!remark) fail('Give a reason for cancelling.');
      event('r', 'Cancelled the indent');
      Object.assign(patch, { stage: 'CANCELLED', holder: null, cancelIdx: st.step, cancel: { reason: remark, by: actor.id, t: now } });
      break;
    }
    case 'fill': {
      needHolder();
      if (!st.fillSection) fail('There is nothing for you to fill at this step.');
      if (payload.section !== st.fillSection) fail('This section is not filled at this step.');
      patch.sections[st.fillSection] = { ...payload.values, by: actor.id, t: now };
      event('y', `Filled the ${SECTION_NAMES[st.fillSection]} section`);
      break;
    }
    case 'forward': {
      needHolder();
      if (!buttonState(indent).forward.on) fail(buttonState(indent).forward.why || 'You cannot forward this now.');
      needTarget(st.forward);
      const tier = st.forward.find((t) => eligibleFor(t, target, owner));
      moveTrail(target);
      Object.assign(patch, { stage: stageForTier(st.fillSection, tier), holder: target.id });
      event('y', `Forwarded to ${nameDesig(target)}`);
      patch.notify = [target.id];
      break;
    }
    case 'approve': {
      needHolder();
      if (!st.approve) fail('There is nothing to approve at this step.');
      if (!buttonState(indent).approve.on) fail(buttonState(indent).approve.why);
      sign();
      if (st.approve.generate) {
        // last step: the purchase order is created
        const po = indent.data.po;
        if (!po.vendor) fail('The PO form needs a vendor.');
        patch.po = { number: poNumber, vendor: po.vendor, orderDate: po.date || today(), dueDate: po.byDate };
        if (!patch.po.dueDate) fail('The PO form needs a delivery date.');
        patch.sections.po = { ...po, ref: poNumber };
        Object.assign(patch, { stage: 'DONE', holder: null, trail: [] });
        event('g', `Generated purchase order ${poNumber}`);
        patch.notify = [indent.by];
        break;
      }
      needTarget(st.approve.to);
      moveTrail(target);
      Object.assign(patch, { stage: st.approve.next, holder: target.id });
      event('g', `Approved and sent to ${nameDesig(target)}`);
      patch.notify = [target.id];
      break;
    }
    case 'revise': {
      needHolder();
      if (!remark) fail('Tell them what to change.');
      if (!target) fail('Choose who to send it back to.');
      if (target.id === indent.by) {
        Object.assign(patch, { stage: 'RETURNED', holder: target.id, trail: [] });
      } else {
        const at = patch.trail.findIndex((x) => x.pid === target.id);
        if (at < 0) fail('You can only send it back to someone earlier in the path.');
        Object.assign(patch, { stage: patch.trail[at].stage, holder: target.id, trail: patch.trail.slice(0, at) });
      }
      event('o', `Sent back for revision to ${nameDesig(target)}`);
      patch.notify = [target.id];
      break;
    }
    case 'reject': {
      needHolder();
      if (st.noReject) fail('This indent is already approved.');
      if (!remark) fail('Give the reason for rejecting.');
      event('r', 'Rejected the indent');
      Object.assign(patch, { stage: 'REJECTED', holder: null, rejIdx: st.step });
      patch.notify = [indent.by];
      break;
    }
    case 'reroute': {
      if (!isAdmin) fail('Only the Admin can reroute.', 403);
      if (!isOpen(indent) || indent.stage === 'DONE' || indent.stage === 'DRAFT') fail('This indent cannot be rerouted now.');
      if (!target) fail('Choose who to move it to.');
      // pick the stage of the target's tier; prefer one in the same step of the progress bar
      const tier = target.tiers.find((t) => Object.values(stages).some((s) => s.tier === t));
      if (!tier && target.id !== indent.by) fail('That person has no role in the approval path.');
      const same = Object.keys(stages).find((k) => stages[k].tier === tier && stages[k].step === st.step);
      const stage = target.id === indent.by ? 'RETURNED' : same || Object.keys(stages).find((k) => stages[k].tier === tier);
      Object.assign(patch, { stage, holder: target.id });
      event('y', `Admin moved the indent to ${nameDesig(target)}`);
      patch.notify = [target.id];
      break;
    }
    case 'reset': {
      if (!isAdmin) fail('Only the Admin can reset.', 403);
      const rp = resetPoints.find((p) => p.id === payload.point);
      if (!rp) fail('Choose where to restart from.');
      needTarget([rp.tier]);
      const keep = {};
      for (const k of rp.keepSigns) if (patch.signs[k]) keep[k] = patch.signs[k];
      Object.assign(patch, { stage: rp.stage, holder: target.id, trail: [], signs: keep, clear: rp.clears });
      event('y', `Admin restarted the approval from: ${rp.label}`);
      patch.notify = [target.id];
      break;
    }
    default:
      fail('Unknown action.');
  }
  return patch;
}

// ---------------------------------------------------------------- the database part
export async function addHistory(db, { indentId, actorId, action, fromStage, toStage, kind, text, remark }) {
  return db.indentHistory.create({
    data: { indentId: Number(indentId), actorId: Number(actorId), action, fromStage, toStage, kind, text, remark: remark || null },
  });
}

async function nextPoNumber(db) {
  const year = new Date().getFullYear();
  let n = (await db.purchaseOrder.count()) + 1;
  while (await db.purchaseOrder.findUnique({ where: { poNumber: `PO/${year}/${String(n).padStart(4, '0')}` } })) n += 1;
  return `PO/${year}/${String(n).padStart(4, '0')}`;
}

// HOD of the owner's department (used when an indent is submitted)
async function findHod(db, owner) {
  const users = await listApiUsers(db, { status: 'active', role: 'hod' });
  return users.find((u) => u.dept === owner.dept) || null;
}

// Do one action on one indent. Used by routes/indentActions.js.
export async function performAction(id, actor, action, payload = {}) {
  const outcome = await prisma.$transaction(async (tx) => {
    const indent = await loadIndent(tx, id);
    if (!indent) throw new HttpError(404, 'Indent not found');
    const owner = await getApiUser(indent.by, tx);

    if (action === 'delete') {
      if (!actor.tiers.includes('admin')) throw new HttpError(403, 'Only the Admin can delete an indent.');
      await tx.attachment.deleteMany({ where: { indentId: Number(id) } });
      await tx.reminder.deleteMany({ where: { indentId: Number(id) } });
      await tx.indentHistory.deleteMany({ where: { indentId: Number(id) } });
      await tx.purchaseOrder.deleteMany({ where: { indentId: Number(id) } });
      await tx.indent.delete({ where: { id: Number(id) } });
      await logAction(actor.id, 'indent_deleted', indent.no, { stage: indent.stage }, null, tx);
      return { deleted: true, notify: [] };
    }

    let target = payload.target ? await getApiUser(payload.target, tx) : null;
    if (action === 'submit') target = await findHod(tx, owner);
    if (action === 'fill') {
      const template = await getForm(indent.formCode);
      payload = { ...payload, values: checkSection(template, payload.section, payload.values) };
    }
    const poNumber = action === 'approve' && stages[indent.stage].approve?.generate ? await nextPoNumber(tx) : undefined;
    const patch = decide({ indent, actor, owner, target, action, payload, poNumber });

    // ---- save the new state ----
    const data = {};
    for (const s of SECTIONS) data[s] = patch.clear.includes(s) ? null : patch.sections[s] || indent.data[s];
    data._meta = { trail: patch.trail, signs: patch.signs, rejIdx: patch.rejIdx, cancelIdx: patch.cancelIdx, cancel: patch.cancel };
    const saved = await tx.indent.updateMany({
      where: { id: Number(id), version: indent.version },
      data: { stage: patch.stage, holderId: patch.holder ? Number(patch.holder) : null, data, version: { increment: 1 } },
    });
    if (saved.count === 0) throw new HttpError(409, 'Someone else just changed this indent. Reload the page and try again.');
    await addHistory(tx, { indentId: id, actorId: actor.id, action, fromStage: indent.stage, toStage: patch.stage, ...patch.event });
    if (patch.po) {
      await tx.purchaseOrder.create({
        data: {
          indentId: Number(id), poNumber: patch.po.number, vendor: patch.po.vendor, status: 'open',
          orderDate: new Date(patch.po.orderDate), dueDate: new Date(patch.po.dueDate), data: { ext: [] },
        },
      });
    }
    return { notify: patch.notify, no: indent.no, id: indent.id, kind: patch.stage === 'DONE' ? 'done' : patch.stage === 'REJECTED' ? 'rejected' : 'moved' };
  });

  if (!outcome.deleted) await sendNotifications(outcome);
  return outcome.deleted ? { deleted: true } : null;
}

// Emails go out AFTER the save, and a failed email never undoes an approval.
async function sendNotifications({ notify, no, id, kind }) {
  const people = await prisma.user.findMany({ where: { id: { in: notify.map(Number) } } });
  for (const p of people) {
    if (kind === 'done') sendMail(p.email, ...mails.finished({ no, id }, 'the purchase order was generated'));
    else if (kind === 'rejected') sendMail(p.email, ...mails.finished({ no, id }, 'it was rejected'));
    else sendMail(p.email, ...mails.waiting({ no, id }));
  }
}

// The people for the dialog of approve / forward / revise
export async function targetsFor(indentId, action) {
  const indent = await loadIndent(prisma, indentId);
  if (!indent) throw new HttpError(404, 'Indent not found');
  const owner = await getApiUser(indent.by);
  const users = await listApiUsers(prisma, { status: 'active' });
  return listTargets({ indent, owner, users, action });
}

// ---------------------------------------------------------------- audit log
// logAction(who, what, target, before, after) writes one row to AuditLog. Used for Admin and security actions.
export async function logAction(actorId, what, target, before, after, db = prisma) {
  return db.auditLog.create({ data: { actorId: actorId ? Number(actorId) : null, action: what, target: target || null, detail: { before, after } } });
}

export { getIndentFor };
