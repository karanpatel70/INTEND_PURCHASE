import { api } from './client.js';

export const listUsers = () => api('/admin/users');

// changes = { role, dept, desig, status }. Use id 'new' to create a user.
export const saveUser = (id, changes) => api(`/admin/users/${id}`, { method: 'PUT', body: changes });

// A limit is never edited: this adds a NEW row that starts today. { formCode, rule, amount, reason, effectiveFrom }
export const addLimit = (body) => api('/admin/limits', { method: 'POST', body });

// dropdown lists
export const addListItem = (list, value) => api('/admin/lists', { method: 'POST', body: { list, value } });
export const removeListItem = (list, value) => api(`/admin/lists/${encodeURIComponent(list)}/${encodeURIComponent(value)}`, { method: 'DELETE' });