import { api } from './client.js';

export const listOrders = () => api('/orders');

export const extendOrder = (id, newDate, reason, password) =>
  api(`/orders/${id}/extend`, { method: 'POST', body: { newDate, reason, password } });
export const deliverOrder = (id, remarks, password) =>
  api(`/orders/${id}/deliver`, { method: 'POST', body: { remarks, password } });
export const cancelOrder = (id, reason, password) =>
  api(`/orders/${id}/cancel`, { method: 'POST', body: { reason, password } });