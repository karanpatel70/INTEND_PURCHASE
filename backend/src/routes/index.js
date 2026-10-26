import { Router } from 'express';
import auth from './auth.js';
import users from './users.js';
import admin from './admin.js';
import forms from './forms.js';
import indents from './indents.js';
import indentActions from './indentActions.js';
import orders from './orders.js';
import reminders from './reminders.js';
import reports from './reports.js';
import attachments from './attachments.js';
import lists from './lists.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true }));
router.use('/auth', auth);
router.use('/users', users);
router.use('/admin', admin);
router.use('/lists', lists);
router.use('/forms', forms);
router.use('/indents', indents);
router.use('/indents', indentActions);
router.use('/orders', orders);
router.use('/reminders', reminders);
router.use('/reports', reports);
router.use('/attachments', attachments);

export default router;