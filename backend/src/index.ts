import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, initDb } from './db/index.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import earningsRouter from './routes/earnings.js';
import aiRouter from './routes/ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

initDb();

import { seedDatabase } from './seed.js';

seedDatabase();

const app = express();
const PORT = process.env.PORT ?? 3001;
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174').split(',');

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'artisynk-api', timestamp: Date.now() });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/earnings', earningsRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`ARTISYNK API running at http://localhost:${PORT}`);
});
