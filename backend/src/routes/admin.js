import { Router } from 'express';

// Owner: Sujeet. Dropdown lists (/admin/lists) and form limits (/admin/limits).
// Admin changes a limit by adding a new FormLimit row. See guide sections 4.7 and 8.
const router = Router();

router.get('/lists', (req, res) => res.status(501).json({ error: 'Not built yet' }));
router.get('/limits', (req, res) => res.status(501).json({ error: 'Not built yet' }));

export default router;
