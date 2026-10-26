// Owner: Sujeet. node-cron job, runs every day at 9:00.
//  1. An indent that has waited 7+ days with someone: email that person.
//  2. A purchase order that is overdue, or due within 3 days: email the indenter.
// Every email is saved in the Reminder table, so nobody gets the same reminder more than once every 3 days.
import cron from 'node-cron';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { sendMail, mails } from './emailService.js';

const DAY = 24 * 60 * 60 * 1000;

// did we already send this kind of reminder for this indent in the last 3 days?
async function alreadySent(where) {
  return prisma.reminder.findFirst({ where: { ...where, sentAt: { gte: new Date(Date.now() - 3 * DAY) } } });
}

export async function runReminders() {
  const now = new Date();
  let sent = 0;

  // 1. indents that wait too long
  const waiting = await prisma.indent.findMany({
    where: { stage: { notIn: ['DRAFT', 'RETURNED', 'DONE', 'REJECTED', 'CANCELLED'] }, holderId: { not: null }, updatedAt: { lte: new Date(now - 7 * DAY) } },
  });
  for (const i of waiting) {
    if (await alreadySent({ indentId: i.id, kind: 'pending_action' })) continue;
    const holder = await prisma.user.findUnique({ where: { id: i.holderId } });
    if (!holder) continue;
    const days = Math.floor((now - i.updatedAt) / DAY);
    await sendMail(holder.email, ...mails.stale({ no: i.number, id: i.id }, days));
    await prisma.reminder.create({ data: { userId: holder.id, indentId: i.id, kind: 'pending_action', sendAt: now, sentAt: now } });
    sent += 1;
  }

  // 2. purchase orders that are late or almost due
  const orders = await prisma.purchaseOrder.findMany({ where: { status: 'open', dueDate: { lte: new Date(now.getTime() + 3 * DAY) } } });
  for (const o of orders) {
    if (await alreadySent({ orderId: o.id, kind: 'po_due' })) continue;
    const indent = await prisma.indent.findUnique({ where: { id: o.indentId } });
    const owner = indent && (await prisma.user.findUnique({ where: { id: indent.createdById } }));
    if (!owner) continue;
    const late = o.dueDate < now;
    await sendMail(owner.email, ...mails.poDue({ no: indent.number }, o.poNumber, late ? 'is overdue' : 'is due within 3 days'));
    await prisma.reminder.create({ data: { userId: owner.id, indentId: indent.id, orderId: o.id, kind: 'po_due', sendAt: now, sentAt: now } });
    sent += 1;
  }
  console.log(`Reminder job finished: ${sent} email(s).`);
  return { sent };
}

export function startReminderJob() {
  if (!env.cronEnabled) return console.log('Reminder job is switched off (CRON_ENABLED=false).');
  cron.schedule('0 9 * * *', () => runReminders().catch((e) => console.error('Reminder job failed:', e.message)));
  console.log('Reminder job scheduled for 9:00 every day.');
}
