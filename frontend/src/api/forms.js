// Owner: Rahul. Form templates and price limits.
import { api, USE_MOCKS } from './client.js';
import templates from '../mocks/formTemplates.js';
import { limits } from '../mocks/limits.js';

export const getForms = async () => (USE_MOCKS ? templates : api('/forms'));
export const getForm = async (code) => (USE_MOCKS ? templates.find((t) => t.code === code) : api(`/forms/${encodeURIComponent(code)}`));
// the limit in force now, per form and rule
export const getLimits = async () => (USE_MOCKS ? limits : api('/admin/limits'));
