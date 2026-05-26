import { Router } from 'express';
import { db } from '../db/index.js';
import type { CreateOrderInput, Order, OrderStatus } from '../types.js';

const router = Router();
const STATUS_FLOW: OrderStatus[] = ['pending', 'packed', 'shipped', 'delivered'];

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    productImage: row.product_image,
    amount: Number(row.amount),
    status: row.status as OrderStatus,
    date: row.date,
    customer: row.customer,
  };
}

function createOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

router.get('/', async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY date DESC');
    res.json(result.rows.map(rowToOrder));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/customer/:customer', async (req, res) => {
  const customer = req.params.customer.trim();
  try {
    const result = await db.query('SELECT * FROM orders WHERE lower(customer) = lower($1) ORDER BY date DESC', [customer]);
    res.json(result.rows.map(rowToOrder));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/', async (req, res) => {
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

  try {
    await db.query(
      `INSERT INTO orders (id, product_id, product_title, product_image, amount, status, date, customer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, body.productId, body.productTitle, body.productImage, body.amount, 'pending', date, customer]
    );

    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    res.status(201).json(rowToOrder(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body as { status?: OrderStatus };
  if (!status || !STATUS_FLOW.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    const updateRes = await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
    if (updateRes.rowCount === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const selectRes = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(rowToOrder(selectRes.rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/:id/advance', async (req, res) => {
  try {
    const selectRes = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    const row = selectRes.rows[0];

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
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [next, req.params.id]);
    const updatedRes = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(rowToOrder(updatedRes.rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
