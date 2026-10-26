import { Router } from 'express';
import { z } from 'zod';
import { wrap } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { requireLogin } from '../middleware/auth.js';
import { checkLogin, registerUser, listApiUsers } from '../services/authService.js';

// Owner: Sujeet. Sign in, sign up, who am I.
//   GET  /api/auth/users     people shown in the sign-in list (authorised users only)
//   POST /api/auth/login     { userId, password } -> { token, user }
//   GET  /api/auth/me        the signed-in user (needs the token)
//   POST /api/auth/register  { name, email, dept, desig, req, password, password2 } -> waits for Admin
const router = Router();

const loginSchema = z.object({ userId: z.union([z.string(), z.number()]), password: z.string().optional() });
const registerSchema = z.object({
  name: z.string().min(2, 'Enter your name.'),
  email: z.string().min(2, 'Enter your college email.'),
  dept: z.string().min(1, 'Choose your department.'),
  desig: z.string().optional(),
  req: z.string().optional(),
  password: z.string().optional(),
  password2: z.string().optional(),
}).refine((v) => !v.password || v.password.length >= 6, { message: 'Choose a password of at least 6 characters, or leave both empty.' })
  .refine((v) => (v.password || '') === (v.password2 || ''), { message: 'The two passwords do not match.' });

router.get('/users', wrap(async (req, res) => res.json(await listApiUsers(undefined, { status: 'active' }))));

router.post('/login', validate(loginSchema), wrap(async (req, res) => {
  res.json(await checkLogin(req.body.userId, req.body.password));
}));

router.get('/me', requireLogin, (req, res) => res.json(req.user));

router.post('/register', validate(registerSchema), wrap(async (req, res) => {
  res.json(await registerUser(req.body));
}));

export default router;
