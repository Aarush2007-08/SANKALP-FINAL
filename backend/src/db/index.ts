import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

export async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      image TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      caption TEXT NOT NULL,
      hashtags TEXT NOT NULL,
      artisan TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 1,
      created_at BIGINT NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      product_id VARCHAR(255) NOT NULL,
      product_title TEXT NOT NULL,
      product_image TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL,
      customer TEXT NOT NULL
    );
  `);
}
