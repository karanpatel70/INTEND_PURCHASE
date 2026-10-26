import { api } from './client.js';

export const listIndents = () => api('/indents');
export const getIndent = (id) => api(`/indents/${id}`);

// data = { indenter: {...answers} } ; submit=false saves a draft
export const createIndent = (user, formCode, data, submit) =>
  api('/indents', { method: 'POST', body: { formCode, data, submit } });

export const updateIndent = (id, user, formCode, data, submit) =>
  api(`/indents/${id}`, { method: 'PUT', body: { formCode, data, submit } });

// People who can be picked in the dialog of an action (approve, forward, revise).
export const getTargets = (id, action) => api(`/indents/${id}/targets/${action}`);

// approve, forward, fill, revise, reject, reroute, reset, delete, cancel, submit.
// The dialogs send "remarks"; the backend wants "remark".
export const doAction = (id, action, body = {}) =>
  api(`/indents/${id}/${action}`, { method: 'POST', body: { ...body, remark: body.remarks } });