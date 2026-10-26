//Form templates and price limits.
import { api } from './client.js';

export const getForms = () => api('/forms');
export const getForm = (code) => api(`/forms/${encodeURIComponent(code)}`);
// the limit in force now, per form and rule
export const getLimits = () => api('/admin/limits');