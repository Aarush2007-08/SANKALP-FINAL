import { Router } from 'express';
import { db } from '../db/index.js';
import type { CreateOrderInput, Order, OrderStatus } from '../types.js';

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

function createOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM orders ORDER BY date DESC')
    .all() as Record<string, unknown>[];
  res.json(rows.map(rowToOrder));
});

router.get('/customer/:customer', (req, res) => {
  const customer = req.params.customer.trim();
  const rows = db
    .prepare('SELECT * FROM orders WHERE lower(customer) = lower(?) ORDER BY date DESC')
    .all(customer) as Record<string, unknown>[];
  res.json(rows.map(rowToOrder));
});

router.post('/', (req, res) => {
  const body = req.body as Partial<CreateOrderInput>;
  const customer = body.customer?.trim();

  if (
    !body.productId ||
    !body.productTitle ||
    !body.productImage ||
    !customer ||
    typeof body.amount !== 'number' ||
    !Number.isFinite(body.amount) ||
    body.amount <= 0
  ) {
    res.status(400).json({ error: 'Invalid order details' });
    return;
  }

  const id = createOrderId();
  const date = new Date().toISOString();

  db.prepare(
    `INSERT INTO orders (id, product_id, product_title, product_image, amount, status, date, customer)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, body.productId, body.productTitle, body.productImage, body.amount, 'pending', date, customer);

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Record<string, unknown>;
  res.status(201).json(rowToOrder(row));
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
