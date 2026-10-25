import { HttpError } from './errorHandler.js';

export const requireRole = (...tiers) => (req, res, next) => {
  const ok = req.user && req.user.tiers.some((t) => tiers.includes(t));
  next(ok ? undefined : new HttpError(403, 'You are not allowed to do this.'));
};
