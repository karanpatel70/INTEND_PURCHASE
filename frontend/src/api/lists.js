//Dropdown lists (departments, budget heads, designations, delivery periods).
import { api } from './client.js';

export const getLists = () => api('/lists');