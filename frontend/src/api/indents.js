// Owner: Manvendra. Everything about indents.
// In mock mode the indents live in the browser (localStorage), starting from src/mocks/indents.js.
// Every indent we return also carries `people`: { id: {name, desig, email} } for every person it mentions,
// so pages can show names without asking again. The real backend will send the same.
import { api, USE_MOCKS } from './client.js';
import { indents as seed } from '../mocks/indents.js';
import { users } from '../mocks/users.js';
import { stages, tierLabels } from '@shared/workflow.js';

const KEY = 'pis_indents';
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch (e) { return seed; }
};
const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));

const userById = (id) => users.find((u) => u.id === id);
const person = (id) => {
  const u = userById(id);
  return u ? { id, name: u.name, desig: u.desig, email: u.email, tiers: u.tiers } : { id, name: id, desig: '', email: '', tiers: [] };
};
const lastTime = (i) => (i.history.length ? i.history[i.history.length - 1].t : new Date().toISOString());

// every person id that appears anywhere in the indent
function peopleIn(i) {
  const ids = new Set([i.by, i.holder, ...i.history.map((h) => h.pid), ...i.trail.map((x) => x.pid)]);
  const addSigns = (s) => s && (s.pid ? ids.add(s.pid) : Object.values(s).forEach(addSigns));
  addSigns(i.signs);
  Object.values(i.data).forEach((sec) => sec && sec.by && ids.add(sec.by));
  if (i.cancel) ids.add(i.cancel.by);
  ids.delete(null);
  return Object.fromEntries([...ids].map((id) => [id, person(id)]));
}

const summary = (i) => ({
  id: i.id, no: i.no, title: i.data.indenter.title, formCode: i.formCode, gem: i.gem, total: i.total, stage: i.stage,
  by: i.by, byName: person(i.by).name,
  holder: i.holder, holderName: i.holder ? person(i.holder).name : '', holderDesig: i.holder ? person(i.holder).desig : '',
  updatedAt: lastTime(i), handledBy: [...new Set(i.history.map((h) => h.pid))],
});

export async function listIndents() {
  if (USE_MOCKS) return load().map(summary);
  return api('/indents');
}

export async function getIndent(id) {
  if (USE_MOCKS) {
    const i = load().find((x) => x.id === id);
    if (!i) throw new Error('Indent not found');
    return { ...i, updatedAt: lastTime(i), people: peopleIn(i) };
  }
  return api(`/indents/${id}`);
}

// data = { indenter: {...answers} } ; submit=false saves a draft
export async function createIndent(user, formCode, data, submit) {
  if (!USE_MOCKS) return api('/indents', { method: 'POST', body: { formCode, data, submit } });
  const list = load();
  const hod = users.find((u) => u.tiers.includes('hod') && u.dept === user.dept);
  const now = new Date().toISOString();
  const indent = {
    id: 'i' + Date.now(), no: `IND-2026-${String(list.length + 200).padStart(4, '0')}`, formCode, by: user.id,
    stage: submit ? 'HOD' : 'DRAFT', holder: submit ? hod.id : user.id, total: data.indenter.total, gem: data.indenter.gem === 'Yes',
    trail: [], signs: {}, po: null, order: null, version: 1,
    history: submit ? [{ pid: user.id, type: 'g', text: 'Created the indent and submitted it to HOD', remark: '', t: now }] : [],
    data: { indenter: data.indenter, accounts: null, purchase: null, po: null },
  };
  save([indent, ...list]);
  return indent;
}

export async function updateIndent(id, user, formCode, data, submit) {
  if (!USE_MOCKS) return api(`/indents/${id}`, { method: 'PUT', body: { formCode, data, submit } });
  const list = load();
  const indent = list.find((x) => x.id === id);
  indent.formCode = formCode;
  indent.data.indenter = data.indenter;
  indent.total = data.indenter.total;
  if (submit) {
    const hod = users.find((u) => u.tiers.includes('hod') && u.dept === user.dept);
    indent.stage = 'HOD';
    indent.holder = hod.id;
    indent.history.push({ pid: user.id, type: 'g', text: 'Submitted the indent to HOD', remark: '', t: new Date().toISOString() });
  }
  save(list);
  return indent;
}

// People who can be picked in the dialog of an action (approve, forward, revise).
export async function getTargets(id, action) {
  if (!USE_MOCKS) return api(`/indents/${id}/targets/${action}`);
  const i = load().find((x) => x.id === id);
  const owner = userById(i.by);
  const st = stages[i.stage];
  const dirOf = (list) => list.map((u) => person(u.id));
  if (action === 'revise') {
    const earlier = [...new Set(i.trail.map((x) => x.pid))].filter((p) => p !== i.by).map(userById);
    return { groups: [{ label: 'Indenter', people: dirOf([owner]) }, ...(earlier.length ? [{ label: 'Earlier in the path', people: dirOf(earlier) }] : [])], prefer: [] };
  }
  const tiers = (action === 'approve' ? st.approve && st.approve.to : st.forward) || [];
  const peopleFor = (t) => users.filter((u) => u.tiers.includes(t) && (t !== 'hod' || u.dept === owner.dept) && u.status === 'authorised');
  const groups = tiers.map((t) => ({ label: tierLabels[t], people: dirOf(peopleFor(t)) })).filter((g) => g.people.length);
  return { groups, prefer: i.trail.map((x) => x.pid) };
}

// Approve, forward, revise, reject. Not connected yet: only the buttons and dialogs are built.
export async function doAction(id, action, body) {
  if (USE_MOCKS) return { ok: true };
  return api(`/indents/${id}/${action}`, { method: 'POST', body });
}

