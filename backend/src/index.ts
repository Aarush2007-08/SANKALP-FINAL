import express from 'express';
import cors from 'cors';
import { db, initDb } from './db/index.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import earningsRouter from './routes/earnings.js';
import aiRouter from './routes/ai.js';
import { seedDatabase } from './seed.js';

const app = express();
const PORT = process.env.PORT ?? 3001;
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174,http://localhost:3000').split(',');

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'she-can-market-api', timestamp: Date.now() });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/earnings', earningsRouter);
app.use('/api/ai', aiRouter);

// Allow Vercel to export the app without running .listen unless local
if (process.env.NODE_ENV !== 'production') {
  initDb().then(() => {
    seedDatabase();
    app.listen(PORT, () => {
      console.log(`She Can Market API running at http://localhost:${PORT}`);
    });
  }).catch(console.error);
}

// For Vercel Serverless
export default app;
