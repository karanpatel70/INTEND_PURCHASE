
import { api, USE_MOCKS } from './client.js';
import { users } from '../mocks/users.js';
import { roleLabel } from '../utils/roles.js';

export async function listUsers() {
  if (USE_MOCKS) return users.map((u) => ({ ...u, roleLabel: roleLabel(u) }));
  return api('/admin/users');
}

// changes = { role, dept, desig, status }
export async function saveUser(id, changes) {
  if (USE_MOCKS) return { ok: true };
  return api(`/admin/users/${id}`, { method: 'PUT', body: changes });
}

// A limit is never edited: this adds a NEW row that starts today. { formCode, rule, amount, reason }
export async function addLimit(body) {
  if (USE_MOCKS) return { ok: true };
  return api('/admin/limits', { method: 'POST', body });
}
