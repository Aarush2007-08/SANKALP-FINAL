# ARTISYNK — Seller Commerce Assistant

Empowering rural women artisans: upload products with AI assistance, manage a storefront, track orders, and view earnings.

## Features

- **AI product upload** — image, voice input (en/hi/kn), editable AI-generated listing
- **Storefront** — search, filter, QR authenticity, social promo copy, delete listings
- **Orders** — status pipeline with advance actions
- **Earnings** — API-driven charts and transactions
- **Offline sync** — queue products when offline, sync when back online
- **Languages** — English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ)

## Quick start (API + frontend)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd "SELLER SIDE BASIC LOGIC"
npm install
npm run dev
```

Or run both from the seller folder:

```bash
npm run dev:all
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to `http://localhost:3001`.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Optional API base (default: use Vite proxy `/api`) |

## API documentation

See [backend/README.md](../backend/README.md) for REST endpoints shared with the future buyer app.
