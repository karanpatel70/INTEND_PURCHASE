// Karan: allow only some roles, e.g. requireRole('admin').
export const requireRole = (...roles) => (req, res, next) => next(); // TODO
