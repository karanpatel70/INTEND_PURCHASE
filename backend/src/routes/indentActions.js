import { Router } from 'express';

// Owner: Karan. submit, cancel, approve, forward, fill, revise, reject, reroute, reset, delete. Calls workflowEngine.
const router = Router();

router.get('/', (req, res) => res.status(501).json({ error: 'Not built yet' }));

export default router;
