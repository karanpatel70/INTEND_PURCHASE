// Owner: Sujeet. hashPassword(), checkLogin(): bcrypt compare + JWT (see guide section 4.4).
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma, toId } from '../config/prisma.js';
import { env } from '../config/env.js';
import { HttpError } from '../middleware/errorHandler.js';
import { ROLES } from '../../../shared/roles.js';
import { sendMail, mails } from './emailService.js';

// The database has a Role (indenter, acc_top ...). The frontend has a role key (ind, a_top ...). This table joins them.
const ROLE_TO_KEY = { admin: 'admin', registrar: 'reg', hod: 'hod', indenter: 'ind', acc_top: 'a_top', acc_mid: 'a_mid', acc_low: 'a_low', pur_top: 'p_top', pur_mid: 'p_mid', pur_low: 'p_low' };
const KEY_TO_ROLE = Object.fromEntries(Object.entries(ROLE_TO_KEY).map(([role, key]) => [key, role]));
export const roleFromKey = (key) => KEY_TO_ROLE[key] || 'indenter';

const STATUS_TO_API = { active: 'authorised', pending: 'pending', blocked: 'blocked' };
export const statusFromApi = (s) => ({ authorised: 'active', pending: 'pending', blocked: 'blocked', declined: 'blocked' }[s]);

// ---------- passwords and tokens ----------
export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const checkPassword = (plain, hash) => (hash ? bcrypt.compare(plain, hash) : false);
export const signToken = (user) => jwt.sign({ id: Number(user.id) }, env.jwtSecret, { expiresIn: '8h' });
export const randomPassword = () => crypto.randomBytes(4).toString('hex'); // e.g. "a3f9c1d2"

// ---------- database user -> frontend user ----------
// { id, email, name, desig, dept, tiers, status, roleLabel }   (same as src/mocks/users.js)
export function toApiUser(row, deptName = '') {
  const key = ROLE_TO_KEY[row.role];
  const status = STATUS_TO_API[row.status];
  return {
    id: String(row.id),
    email: row.email,
    name: row.name,
    desig: row.designation || '',
    dept: deptName,
    // a waiting user has no tiers: they cannot do anything until the Admin gives a role
    tiers: status === 'authorised' ? ROLES[key].tiers : [],
    status,
    roleLabel: status === 'authorised' ? ROLES[key].label : ROLES.none.label,
  };
}

// department names live in ListItem, so we load them once and look them up by id
async function deptNames(db) {
  const rows = await db.listItem.findMany({ where: { list: 'department' } });
  return Object.fromEntries(rows.map((r) => [r.id, r.value]));
}

export async function getApiUser(id, db = prisma) {
  const row = await db.user.findUnique({ where: { id: toId(id) } });
  if (!row) return null;
  const depts = await deptNames(db);
  return toApiUser(row, depts[row.departmentId] || '');
}

export async function listApiUsers(db = prisma, where = {}) {
  const rows = await db.user.findMany({ where, orderBy: { name: 'asc' } });
  const depts = await deptNames(db);
  return rows.map((r) => toApiUser(r, depts[r.departmentId] || ''));
}

// finds a department in the lists, or adds it
export async function departmentId(db, name) {
  if (!name) return null;
  let item = await db.listItem.findFirst({ where: { list: 'department', value: name } });
  if (!item) item = await db.listItem.create({ data: { list: 'department', value: name } });
  return item.id;
}

// ---------- login ----------
export async function checkLogin(email, password) {
  let mail = String(email || '').trim().toLowerCase();
  if (mail && !mail.includes('@')) mail += '@iitrpr.ac.in'; // "rohit.m" is enough
  const row = await prisma.user.findUnique({ where: { email: mail } });

  // One message for "no such email" and "wrong password", so nobody can find out which emails exist.
  if (!row || !(await checkPassword(password || '', row.passwordHash))) {
    throw new HttpError(401, 'Wrong email or password.');
  }
  if (row.status === 'pending') throw new HttpError(403, 'This account is waiting for Admin approval.');
  if (row.status === 'blocked') throw new HttpError(403, 'This account is blocked. Contact the Admin.');

  const user = await getApiUser(row.id);
  return { token: signToken(row), user };
}

// ---------- sign up ----------
// The new user is saved as "pending". The Admin gets an email, then authorises them and gives a role.
export async function registerUser(form) {
  let email = form.email.trim().toLowerCase();
  if (!email.includes('@')) email += '@iitrpr.ac.in';
  if (!email.endsWith('@iitrpr.ac.in')) throw new HttpError(400, 'Use your IIT Ropar email.');
  if (await prisma.user.findUnique({ where: { email } })) throw new HttpError(409, 'This email is already registered.');
  await prisma.user.create({
    data: {
      name: form.name.trim(),
      email,
      designation: form.desig || null,
      departmentId: await departmentId(prisma, form.dept),
      passwordHash: form.password ? await hashPassword(form.password) : null,
      status: 'pending',
    },
  });
  const admins = await prisma.user.findMany({ where: { role: 'admin', status: 'active' } });
  for (const a of admins) sendMail(a.email, ...mails.newSignup(form.name, email, form.req));
  return { ok: true, email: email.split('@')[0] };
}

// Called by the Admin when a user becomes active. If they never chose a password, we make one and email it.
export async function giveFirstPassword(row) {
  if (row.passwordHash) return;
  const temp = randomPassword();
  await prisma.user.update({ where: { id: row.id }, data: { passwordHash: await hashPassword(temp) } });
  sendMail(row.email, ...mails.authorised(row.name, temp));
}
