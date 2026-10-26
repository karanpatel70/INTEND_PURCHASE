//Sign in, register, who am I.
import { api } from './client.js';

export const listLoginUsers = () => api('/auth/users');
export const login = (userId, password) => api('/auth/login', { method: 'POST', body: { userId, password } });
export const getMe = () => api('/auth/me');
export const register = (form) => api('/auth/register', { method: 'POST', body: form });