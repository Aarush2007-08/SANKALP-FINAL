# ARTISYNK API

Express + SQLite backend for the seller (and future buyer) simulation.

## Run

```bash
cd backend
npm install
npm run dev
```

API base: `http://localhost:3001`

## Seed / reset data

```bash
npm run seed
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| DELETE | `/api/products/:id` | Delete product |
| PATCH | `/api/products/:id/sync` | Mark product synced |
| POST | `/api/products/sync-all` | Sync all pending products |
| GET | `/api/orders` | List orders |
| PATCH | `/api/orders/:id/status` | Set order status |
| POST | `/api/orders/:id/advance` | Advance order to next status |
| GET | `/api/earnings/summary` | Earnings aggregates + chart data |
| POST | `/api/ai/generate-listing` | AI listing stub `{ description, locale? }` |

## Buyer integration (planned)

- **POST** `/api/orders` — create order from buyer checkout (to be added)
- Products returned by **GET** `/api/products` use the same JSON shape as the seller app

## Environment

| Variable | Default |
|----------|---------|
| `PORT` | `3001` |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` |
