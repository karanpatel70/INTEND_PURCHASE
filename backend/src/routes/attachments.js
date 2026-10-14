import { Router } from 'express';

// Owner: Rahul. Endpoints are listed in the team guide, section 4.
const router = Router();

router.get('/', (req, res) => res.status(501).json({ error: 'Not built yet' }));

export default router;
