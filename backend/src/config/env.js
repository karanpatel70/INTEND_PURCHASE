import 'dotenv/config';

// All settings come from backend/.env. If a value is missing we use a safe default for development.
export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // email: if SMTP_HOST is empty, emails are only printed in the terminal (nothing is sent)
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  mailFrom: process.env.MAIL_FROM || 'Purchase Indent System <no-reply@iitrpr.ac.in>',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  // set CRON_ENABLED=false to switch the daily reminder job off
  cronEnabled: process.env.CRON_ENABLED !== 'false',
};

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') throw new Error('Set JWT_SECRET in backend/.env before running in production.');
if (!process.env.JWT_SECRET) console.warn('Warning: JWT_SECRET is not set in .env. Using an unsafe development value.');