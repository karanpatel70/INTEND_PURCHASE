// Owner: Manvendra. Dropdown lists (departments, budget heads, designations, delivery periods).
import { api, USE_MOCKS } from './client.js';
import { lists } from '../mocks/lists.js';

export const getLists = async () => (USE_MOCKS ? lists : api('/lists'));
