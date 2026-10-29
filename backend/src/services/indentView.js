import { prisma, toId } from '../config/prisma.js';
import { toApiUser } from './authService.js';

export const SECTIONS = ['indenter', 'accounts', 'purchase', 'po'];
const iso = (d) => (d ? new Date(d).toISOString() : null);
const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);

export const person = (u) => ({ id: u.id, name: u.name, desig: u.desig, email: u.email, tiers: u.tiers });

// the "order" part of an indent: { status, ext, cancel, deliveredOn }
export function orderView(po) {
  if (!po) return null;
  const d = po.data || {};
  return { status: po.status, ext: d.ext || [], ...(d.cancel ? { cancel: d.cancel } : {}), ...(d.deliveredOn ? { deliveredOn: d.deliveredOn } : {}) };
}

// one database row (+ its history and PO) -> the frontend indent
export function toApiIndent(row, history, po, codes) {
  const d = row.data || {};
  const meta = d._meta || {};
  const data = {};
  for (const s of SECTIONS) data[s] = d[s] || null;
  return {
    id: String(row.id),
    no: row.number,
    formCode: codes[row.formTemplateId],
    by: String(row.createdById),
    stage: row.stage,
    holder: row.holderId ? String(row.holderId) : null,
    total: Number(row.total),
    gem: !!data.indenter && data.indenter.gem === 'Yes',
    trail: meta.trail || [],
    signs: meta.signs || {},
    po: po ? po.poNumber : null,
    order: orderView(po),
    rejIdx: meta.rejIdx,
    cancelIdx: meta.cancelIdx,
    cancel: meta.cancel,
    version: row.version,
    updatedAt: iso(row.updatedAt),
    history: history.map((h) => ({ pid: String(h.actorId), type: h.kind || 'y', text: h.text || h.action, remark: h.remark || '', t: iso(h.at) })),
    data,
  };
}

export async function templateCodes(db = prisma) {
  const rows = await db.formTemplate.findMany();
  return Object.fromEntries(rows.map((r) => [r.id, r.code]));
}

// load one indent (db can be prisma or a transaction)
export async function loadIndent(db, id) {
  const row = await db.indent.findUnique({ where: { id: toId(id) } });
  if (!row) return null;
  const history = await db.indentHistory.findMany({ where: { indentId: row.id }, orderBy: { id: 'asc' } });
  const po = await db.purchaseOrder.findUnique({ where: { indentId: row.id } });
  return toApiIndent(row, history, po, await templateCodes(db));
}

// every person mentioned in an indent, as { id: {id,name,desig,email,tiers} }
export async function peopleOf(db, indent) {
  const ids = new Set([indent.by, indent.holder, ...indent.history.map((h) => h.pid), ...indent.trail.map((x) => x.pid)]);
  const addSigns = (s) => s && (s.pid ? ids.add(s.pid) : Object.values(s).forEach(addSigns));
  addSigns(indent.signs);
  Object.values(indent.data).forEach((sec) => sec && sec.by && ids.add(String(sec.by)));
  if (indent.cancel) ids.add(indent.cancel.by);
  ids.delete(null);
  ids.delete(undefined);
  const rows = await db.user.findMany({ where: { id: { in: [...ids].map(toId) } } });
  const depts = await db.listItem.findMany({ where: { list: 'department' } });
  const name = Object.fromEntries(depts.map((x) => [x.id, x.value]));
  return Object.fromEntries(rows.map((r) => [String(r.id), person(toApiUser(r, name[r.departmentId] || ''))]));
}

// Who may open this indent? Admin, the owner, whoever holds it or touched it, and the HOD of the owner's department.
export function canSee(user, indent, ownerDept) {
  if (user.tiers.includes('admin')) return true;
  if (indent.by === user.id || indent.holder === user.id) return true;
  if (indent.history.some((h) => h.pid === user.id)) return true;
  if (user.tiers.includes('hod') && ownerDept && ownerDept === user.dept) return true;
  return false;
}

// the indent + people, if this user may see it (otherwise null)
export async function getIndentFor(db, user, id) {
  const indent = await loadIndent(db, id);
  if (!indent) return null;
  const people = await peopleOf(db, indent);
  const owner = await db.user.findUnique({ where: { id: toId(indent.by) } });
  const dept = owner ? (await db.listItem.findUnique({ where: { id: owner.departmentId || 0 } }))?.value : '';
  if (!canSee(user, indent, dept)) return { forbidden: true };
  return { ...indent, people };
}

// the short rows for the lists (My indents, Inbox, Track, Admin)
export async function listSummaries(user) {
  const rows = await prisma.indent.findMany({ orderBy: { id: 'desc' } });
  const history = await prisma.indentHistory.findMany({ orderBy: { id: 'asc' } });
  const orders = await prisma.purchaseOrder.findMany();
  const users = await prisma.user.findMany();
  const depts = await prisma.listItem.findMany({ where: { list: 'department' } });
  const deptName = Object.fromEntries(depts.map((x) => [x.id, x.value]));
  const apiUsers = Object.fromEntries(users.map((u) => [String(u.id), toApiUser(u, deptName[u.departmentId] || '')]));
  const codes = await templateCodes();

  const out = [];
  for (const row of rows) {
    const hist = history.filter((h) => h.indentId === row.id);
    const po = orders.find((o) => o.indentId === row.id);
    const i = toApiIndent(row, hist, po, codes);
    if (!canSee(user, i, apiUsers[i.by]?.dept)) continue;
    const holder = i.holder ? apiUsers[i.holder] : null;
    out.push({
      id: i.id, no: i.no, title: i.data.indenter?.title || '', formCode: i.formCode, gem: i.gem, total: i.total, stage: i.stage,
      by: i.by, byName: apiUsers[i.by]?.name || '',
      holder: i.holder, holderName: holder ? holder.name : '', holderDesig: holder ? holder.desig : '',
      updatedAt: i.updatedAt, handledBy: [...new Set(i.history.map((h) => h.pid))],
      rejIdx: i.rejIdx, cancelIdx: i.cancelIdx, po: i.po,
    });
  }
  return out;
}
