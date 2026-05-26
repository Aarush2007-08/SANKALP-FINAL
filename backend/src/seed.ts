import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, initDb } from './db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

export function seedDatabase(clear = false) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  initDb();

  if (clear) {
    db.exec('DELETE FROM products; DELETE FROM orders;');
  }

  const count = db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number };
  if (count.c > 0 && !clear) return;

  if (clear || count.c === 0) {
    db.exec('DELETE FROM products; DELETE FROM orders;');
  }

  const demoProducts = [
    {
      id: 'demo_1',
      image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800',
      title: 'Handcrafted Bamboo Basket',
      description:
        '✨ Authentic handmade creation by rural women artisans. Beautiful bamboo basket woven with traditional techniques. Each piece is unique and crafted with traditional techniques passed down through generations. Support local artisans and bring home a piece of heritage.',
      price: 899,
      category: 'Handicrafts',
      caption:
        '🌟 Discover the beauty of handmade craftsmanship! Beautiful bamboo basket woven with traditional techniques. Every piece tells a story of tradition and passion. Made with love by rural women artisans. 💚',
      hashtags: JSON.stringify([
        '#Handmade',
        '#Artisan',
        '#RuralCrafts',
        '#Handicrafts',
        '#SupportLocal',
        '#Sustainable',
        '#WomenEmpowerment',
        '#MadeInIndia',
      ]),
      artisan: 'Rural Women Artisan',
      synced: 1,
      created_at: Date.now() - 86400000,
    },
    {
      id: 'demo_2',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      title: 'Handcrafted Clay Pottery',
      description:
        '✨ Authentic handmade creation by rural women artisans. Elegant clay pottery with intricate designs. Each piece is unique and crafted with traditional techniques passed down through generations. Support local artisans and bring home a piece of heritage.',
      price: 1299,
      category: 'Pottery',
      caption:
        '🌟 Discover the beauty of handmade craftsmanship! Elegant clay pottery with intricate designs. Every piece tells a story of tradition and passion. Made with love by rural women artisans. 💚',
      hashtags: JSON.stringify([
        '#Handmade',
        '#Artisan',
        '#RuralCrafts',
        '#Pottery',
        '#SupportLocal',
        '#Sustainable',
        '#WomenEmpowerment',
        '#MadeInIndia',
      ]),
      artisan: 'Rural Women Artisan',
      synced: 1,
      created_at: Date.now() - 172800000,
    },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (id, image, title, description, price, category, caption, hashtags, artisan, synced, created_at)
    VALUES (@id, @image, @title, @description, @price, @category, @caption, @hashtags, @artisan, @synced, @created_at)
  `);

  for (const p of demoProducts) {
    insertProduct.run(p);
  }

  const demoOrders = [
    {
      id: 'ORD001',
      product_id: 'demo_1',
      product_title: 'Handwoven Basket',
      product_image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400',
      amount: 899,
      status: 'delivered',
      date: '2026-05-20',
      customer: 'Priya Sharma',
    },
    {
      id: 'ORD002',
      product_id: 'demo_2',
      product_title: 'Clay Pottery Set',
      product_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
      amount: 1499,
      status: 'shipped',
      date: '2026-05-22',
      customer: 'Rajesh Kumar',
    },
    {
      id: 'ORD003',
      product_id: 'demo_3',
      product_title: 'Embroidered Scarf',
      product_image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400',
      amount: 699,
      status: 'packed',
      date: '2026-05-24',
      customer: 'Anita Desai',
    },
    {
      id: 'ORD004',
      product_id: 'demo_4',
      product_title: 'Wooden Craft Box',
      product_image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
      amount: 1299,
      status: 'pending',
      date: '2026-05-25',
      customer: 'Vikram Singh',
    },
  ];

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, product_id, product_title, product_image, amount, status, date, customer)
    VALUES (@id, @product_id, @product_title, @product_image, @amount, @status, @date, @customer)
  `);

  for (const o of demoOrders) {
    insertOrder.run(o);
  }
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase(true);
  console.log('Database seeded successfully.');
}
