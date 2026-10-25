//An error we throw on purpose, with the HTTP status the browser should get.
//Example: throw new HttpError(404, 'Indent not found');
export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra; 
  }
}

export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function errorHandler(err, req, res, next) {
  if (err.name === 'ZodError') {
    const first = err.issues[0];
    return res.status(400).json({ error: first ? first.message : 'Invalid request' });
  }
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Something went wrong on the server', ...(err.extra || {}) });
}
