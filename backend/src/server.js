import app from './app.js';
import { env } from './config/env.js';
import { startReminderJob } from './services/reminderJob.js';

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
  startReminderJob();
});