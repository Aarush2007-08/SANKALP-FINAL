import { Router } from 'express';
import { db } from '../db/index.js';
import type { CreateProductInput, Product } from '../types.js';

const router = Router();

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    image: row.image as string,
    title: row.title as string,
    description: row.description as string,
    price: row.price as number,
    category: row.category as string,
    caption: row.caption as string,
    hashtags: JSON.parse(row.hashtags as string) as string[],
    artisan: row.artisan as string,
    timestamp: row.created_at as number,
    synced: Boolean(row.synced),
  };
}

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM products ORDER BY created_at DESC')
    .all() as Record<string, unknown>[];
  res.json(rows.map(rowToProduct));
});

router.post('/', (req, res) => {
  const body = req.body as CreateProductInput;
  const id = `prod_${Date.now()}`;
  const created_at = Date.now();
  const synced = body.synced !== false ? 1 : 0;

  db.prepare(
    `INSERT INTO products (id, image, title, description, price, category, caption, hashtags, artisan, synced, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    body.image,
    body.title,
    body.description,
    body.price,
    body.category,
    body.caption,
    JSON.stringify(body.hashtags),
    body.artisan,
    synced,
    created_at
  );

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, unknown>;
  res.status(201).json(rowToProduct(row));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.status(204).send();
});

router.patch('/:id/sync', (req, res) => {
  const result = db.prepare('UPDATE products SET synced = 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as Record<string, unknown>;
  res.json(rowToProduct(row));
});

router.post('/sync-all', (_req, res) => {
  db.prepare('UPDATE products SET synced = 1 WHERE synced = 0').run();
  const rows = db
    .prepare('SELECT * FROM products ORDER BY created_at DESC')
    .all() as Record<string, unknown>[];
  res.json(rows.map(rowToProduct));
});

export default router;
