import { Router } from 'express';
import { db } from '../db/index.js';
import type { Order, OrderStatus } from '../types.js';

const router = Router();
const STATUS_FLOW: OrderStatus[] = ['pending', 'packed', 'shipped', 'delivered'];

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    productTitle: row.product_title as string,
    productImage: row.product_image as string,
    amount: row.amount as number,
    status: row.status as OrderStatus,
    date: row.date as string,
    customer: row.customer as string,
  };
}

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM orders ORDER BY date DESC')
    .all() as Record<string, unknown>[];
  res.json(rows.map(rowToOrder));
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body as { status?: OrderStatus };
  if (!status || !STATUS_FLOW.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as Record<string, unknown>;
  res.json(rowToOrder(row));
});

router.post('/:id/advance', (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as
    | Record<string, unknown>
    | undefined;

  if (!row) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const current = row.status as OrderStatus;
  const idx = STATUS_FLOW.indexOf(current);
  if (idx < 0 || idx >= STATUS_FLOW.length - 1) {
    res.status(400).json({ error: 'Order already at final status' });
    return;
  }

  const next = STATUS_FLOW[idx + 1];
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(next, req.params.id);
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as Record<string, unknown>;
  res.json(rowToOrder(updated));
});

export default router;
