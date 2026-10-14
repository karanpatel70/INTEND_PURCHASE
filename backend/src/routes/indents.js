import { Router } from 'express';

// Owner: Manvendra. List, create, edit, history. See guide section 4.7.
const router = Router();

router.get('/', (req, res) => res.status(501).json({ error: 'Not built yet' }));

export default router;
