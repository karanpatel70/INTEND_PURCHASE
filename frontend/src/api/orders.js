// Owner: Rahul. One function per endpoint. If USE_MOCKS is true, return data from src/mocks.
// Owner: Rahul. Purchase orders after they are issued.
// In mock mode the orders are read from the sample indents (the ones that have a PO form). Changes are preview only.
import { api, USE_MOCKS } from './client.js';
import { indents as seed } from '../mocks/indents.js';
import { isPurchase } from '../utils/roles.js';

const load = () => {
  try { return JSON.parse(localStorage.getItem('pis_indents')) || seed; } catch (e) { return seed; }
};

// One row per order: Purchase staff see all of them, everyone else only the orders of their own indents.
export async function listOrders(user) {
  if (!USE_MOCKS) return api('/orders');
  return load()
    .filter((i) => i.data.po && (isPurchase(user) || i.by === user.id))
    .map((i) => ({
      id: i.id, no: i.no, title: i.data.indenter.title, po: i.po, stage: i.stage, vendor: i.data.po.vendor,
      date: i.data.po.date, byDate: i.data.po.byDate, order: i.order || { status: 'open', ext: [] },
    }));
}

// extend, deliver, cancel: not connected yet (preview only)
export const extendOrder = async (id, newDate, reason, password) =>
  USE_MOCKS ? { ok: true } : api(`/orders/${id}/extend`, { method: 'POST', body: { newDate, reason, password } });
export const deliverOrder = async (id, remarks, password) =>
  USE_MOCKS ? { ok: true } : api(`/orders/${id}/deliver`, { method: 'POST', body: { remarks, password } });
export const cancelOrder = async (id, reason, password) =>
  USE_MOCKS ? { ok: true } : api(`/orders/${id}/cancel`, { method: 'POST', body: { reason, password } });
