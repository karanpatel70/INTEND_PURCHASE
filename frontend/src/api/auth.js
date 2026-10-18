// Owner: Manvendra. Sign in, register, who am I.
// With USE_MOCKS=true the answers come from src/mocks (no backend). Later the real server answers instead.
import { api, USE_MOCKS } from './client.js';
import { users } from '../mocks/users.js';
import { roleLabel } from '../utils/roles.js';

const userById = (id) => users.find((u) => u.id === id);

export async function listLoginUsers() {
  if (USE_MOCKS) return users.map((u) => ({ ...u, roleLabel: roleLabel(u) }));
  return api('/auth/users');
}

export async function login(userId, password) {
  if (USE_MOCKS) {
    const user = userById(userId);
    if (!user) throw new Error('Choose a user from the list.');
    return { token: user.id, user }; // any password works in mock mode
  }
  return api('/auth/login', { method: 'POST', body: { userId, password } });
}

// demo helper: jump to another user without a password (mock mode only)
export const switchUser = (userId) => login(userId, '');

export async function getMe() {
  if (USE_MOCKS) {
    const user = userById(localStorage.getItem('token'));
    if (!user) throw new Error('Not signed in');
    return user;
  }
  return api('/auth/me');
}

// Sign-ups are not saved in mock mode: this only checks the form and says "sent".
export async function register(form) {
  if (USE_MOCKS) {
    const name = form.email.trim().toLowerCase();
    const parts = name.split('@');
    if (!form.name || !form.email || !form.dept) throw new Error('Fill in your name, college email and department.');
    if (parts[1] !== undefined && parts[1] !== 'iitrpr.ac.in') throw new Error('Use your IIT Ropar email. Type only the part before @iitrpr.ac.in.');
    if (!/^[a-z0-9._-]{2,}$/.test(parts[0])) throw new Error('Type only the part before @iitrpr.ac.in, for example rohit.m.');
    if ((form.password || form.password2) && form.password.length < 6) throw new Error('Choose a password of at least 6 characters, or leave both empty.');
    if (form.password !== form.password2) throw new Error('The two passwords do not match.');
    return { ok: true, email: parts[0] };
  }
  return api('/auth/register', { method: 'POST', body: form });
}
