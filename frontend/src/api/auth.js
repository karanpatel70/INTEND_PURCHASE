//Sign in, register, who am I.
import { api } from './client.js';

export const login = (email, password) => api('/auth/login', { method: 'POST', body: { email, password } });
export const getMe = () => api('/auth/me');
export const register = (form) => api('/auth/register', { method: 'POST', body: form });