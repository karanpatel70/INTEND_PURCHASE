import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', routes);
// anything that matched no route
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

export default app;