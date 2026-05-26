import { Router } from 'express';
import { db } from '../db/index.js';
import type { CreateProductInput, Product } from '../types.js';

const router = Router();

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    image: row.image,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    caption: row.caption,
    hashtags: typeof row.hashtags === 'string' ? JSON.parse(row.hashtags) : row.hashtags,
    artisan: row.artisan,
    timestamp: Number(row.created_at),
    synced: Boolean(row.synced),
  };
}

router.get('/', async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows.map(rowToProduct));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/', async (req, res) => {
  const body = req.body as CreateProductInput;
  const id = `prod_${Date.now()}`;
  const created_at = Date.now();
  const synced = body.synced !== false ? 1 : 0;

  try {
    await db.query(
      `INSERT INTO products (id, image, title, description, price, category, caption, hashtags, artisan, synced, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
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
      ]
    );

    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    res.status(201).json(rowToProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.patch('/:id/sync', async (req, res) => {
  try {
    const result = await db.query('UPDATE products SET synced = 1 WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const selectRes = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.json(rowToProduct(selectRes.rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/sync-all', async (_req, res) => {
  try {
    await db.query('UPDATE products SET synced = 1 WHERE synced = 0');
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows.map(rowToProduct));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
