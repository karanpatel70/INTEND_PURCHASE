// Owner: Sujeet. Nodemailer: sendMail(to, subject, html) + templates.
// Owner: Sujeet. Nodemailer: sendMail(to, subject, html) + the email texts.
// If SMTP_HOST is empty in .env, nothing is sent: the email is printed in the terminal instead.
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = env.smtpHost
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
    })
  : null;

// Never throws. A broken mail server must not stop an approval from being saved.
export async function sendMail(to, subject, html) {
  try {
    if (!transporter) {
      console.log(`[email not sent: SMTP not set] To: ${to} | ${subject}`);
      return;
    }
    await transporter.sendMail({ from: env.mailFrom, to, subject, html });
  } catch (err) {
    console.error('Email failed:', err.message);
  }
}

const link = (path) => `${env.frontendUrl}${path}`;

// Each template returns [subject, html]. Use it like: sendMail(to, ...mails.waiting(...))
export const mails = {
  waiting: (indent) => [
    `Indent ${indent.no} is waiting for you`,
    `<p>The indent <b>${indent.no}</b> is now with you.</p><p><a href="${link('/indents/' + indent.id)}">Open the indent</a></p>`,
  ],
  finished: (indent, text) => [
    `Indent ${indent.no}: ${text}`,
    `<p>Your indent <b>${indent.no}</b>: ${text}.</p><p><a href="${link('/indents/' + indent.id)}">Open the indent</a></p>`,
  ],
  stale: (indent, days) => [
    `Reminder: indent ${indent.no} has waited ${days} days`,
    `<p>The indent <b>${indent.no}</b> has been with you for ${days} days.</p><p><a href="${link('/indents/' + indent.id)}">Open the indent</a></p>`,
  ],
  poDue: (indent, po, text) => [
    `Purchase order ${po}: ${text}`,
    `<p>The purchase order <b>${po}</b> (indent ${indent.no}) ${text}.</p><p><a href="${link('/orders')}">Open purchase orders</a></p>`,
  ],
  newSignup: (name, email, wanted) => [
    `New sign-up waiting: ${name}`,
    `<p><b>${name}</b> (${email}) asked for the role: ${wanted || 'not given'}.</p><p><a href="${link('/admin/users')}">Review the request</a></p>`,
  ],
  authorised: (name, tempPassword) => [
    'Your account is ready',
    `<p>Hello ${name}, the Admin has authorised your account.</p>` +
      (tempPassword ? `<p>Your first password is <b>${tempPassword}</b>. Please change it after signing in.</p>` : '') +
      `<p><a href="${link('/login')}">Sign in</a></p>`,
  ],
};
