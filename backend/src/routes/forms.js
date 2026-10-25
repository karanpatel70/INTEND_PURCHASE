import { Router } from 'express';
import { wrap, HttpError } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { listForms, getForm } from '../services/formService.js';


//   GET /api/forms/:code 
const router = Router();

router.get('/', requireLogin, wrap(async (req, res) => res.json(await listForms())));

router.get('/:code', requireLogin, wrap(async (req, res) => {
  const form = await getForm(req.params.code);
  if (!form) throw new HttpError(404, 'Form not found');
  res.json(form);
}));

export default router;
