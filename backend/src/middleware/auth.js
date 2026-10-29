import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from './errorHandler.js';
import { getApiUser } from '../services/authService.js';

//It reads "Authorization: Bearer <token>", checks the token, and puts the user on req.user.
export async function requireLogin(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) throw new HttpError(401, 'Please sign in.');
    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch (e) {
      throw new HttpError(401, 'Your session has ended. Please sign in again.');
    }
    const user = await getApiUser(payload.id);
    if (!user || user.status !== 'authorised') throw new HttpError(401, 'This account cannot sign in.');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
