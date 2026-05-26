import { db, initDb } from './db/index.js';

export async function seedDatabase(clear = false) {
  try {
    await initDb();
  } catch (err) {
    console.error('Failed to init DB, make sure POSTGRES_URL is set:', err);
    return;
  }

  if (clear) {
    await db.query('DELETE FROM products');
    await db.query('DELETE FROM orders');
  }

  const result = await db.query('SELECT COUNT(*) as c FROM products');
  const count = Number(result.rows[0].c);
  if (count > 0 && !clear) return;

  if (clear || count === 0) {
    await db.query('DELETE FROM products');
    await db.query('DELETE FROM orders');
  }

  const demoProducts = [
    {
      id: 'demo_1',
      image:
        'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=900&q=80',
      title: 'Handwoven Palm Basket',
      description:
        'A sturdy handwoven basket made from natural palm fibers by women artisan groups.',
      price: 799,
      category: 'Handicrafts',
      caption:
        'Bring home eco-friendly storage with this handwoven palm basket made by rural artisans.',
      hashtags: JSON.stringify([
        '#Handmade',
        '#WomenArtisans',
        '#Sustainable',
        '#Handicrafts',
        '#MadeInIndia',
      ]),
      artisan: 'Savitri Collective',
      synced: 1,
      created_at: Date.now() - 86400000,
    },
    {
      id: 'demo_2',
      image:
        'https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?auto=format&fit=crop&w=900&q=80',
      title: 'Terracotta Table Vase',
      description:
        'Traditional terracotta vase with hand-etched floral patterns and natural matte finish.',
      price: 1199,
      category: 'Pottery',
      caption: 'Handcrafted terracotta elegance for your living space.',
      hashtags: JSON.stringify([
        '#Pottery',
        '#Terracotta',
        '#ArtisanMade',
        '#HomeDecor',
        '#SupportLocal',
      ]),
      artisan: 'Madhavi Pottery Unit',
      synced: 1,
      created_at: Date.now() - 172800000,
    },
    {
      id: 'demo_3',
      image:
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      title: 'Block Print Cotton Stole',
      description:
        'Soft cotton stole featuring hand block-printed motifs inspired by village art patterns.',
      price: 649,
      category: 'Textiles',
      caption: 'A breathable cotton stole with authentic hand block print work.',
      hashtags: JSON.stringify([
        '#Textiles',
        '#BlockPrint',
        '#Cotton',
        '#WomenLed',
        '#SlowFashion',
      ]),
      artisan: 'Narmada Stitch Circle',
      synced: 1,
      created_at: Date.now() - 259200000,
    },
    {
      id: 'demo_4',
      image:
        'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=80',
      title: 'Beaded Thread Earrings',
      description:
        'Lightweight handmade earrings crafted with glass beads and dyed cotton thread.',
      price: 499,
      category: 'Jewelry',
      caption: 'Everyday handmade earrings that add color and character.',
      hashtags: JSON.stringify([
        '#Jewelry',
        '#HandmadeAccessories',
        '#Beadwork',
        '#Crafts',
        '#RuralMakers',
      ]),
      artisan: 'Jyoti Self Help Group',
      synced: 1,
      created_at: Date.now() - 345600000,
    },
    {
      id: 'demo_5',
      image:
        'https://images.unsplash.com/photo-1616628182509-6f03f56a2b35?auto=format&fit=crop&w=900&q=80',
      title: 'Jute Storage Organizer',
      description:
        'Durable jute organizer with stitched handles, ideal for shelves, toys, and laundry.',
      price: 949,
      category: 'Home Decor',
      caption: 'Functional handcrafted jute organizer for neat and stylish storage.',
      hashtags: JSON.stringify(['#Jute', '#HomeDecor', '#EcoFriendly', '#Handmade', '#SupportWomen']),
      artisan: 'Kamla Women Weavers',
      synced: 1,
      created_at: Date.now() - 432000000,
    },
  ];

  for (const p of demoProducts) {
    await db.query(
      `
      INSERT INTO products (id, image, title, description, price, category, caption, hashtags, artisan, synced, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [p.id, p.image, p.title, p.description, p.price, p.category, p.caption, p.hashtags, p.artisan, p.synced, p.created_at]
    );
  }

  const demoOrders = [
    {
      id: 'ORD001',
      product_id: 'demo_1',
      product_title: 'Handwoven Palm Basket',
      product_image:
        'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=500&q=80',
      amount: 799,
      status: 'delivered',
      date: '2026-05-20',
      customer: 'Priya Sharma',
    },
    {
      id: 'ORD002',
      product_id: 'demo_2',
      product_title: 'Terracotta Table Vase',
      product_image:
        'https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?auto=format&fit=crop&w=500&q=80',
      amount: 1199,
      status: 'shipped',
      date: '2026-05-22',
      customer: 'Rajesh Kumar',
    },
    {
      id: 'ORD003',
      product_id: 'demo_3',
      product_title: 'Block Print Cotton Stole',
      product_image:
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80',
      amount: 649,
      status: 'packed',
      date: '2026-05-24',
      customer: 'Anita Desai',
    },
    {
      id: 'ORD004',
      product_id: 'demo_5',
      product_title: 'Jute Storage Organizer',
      product_image:
        'https://images.unsplash.com/photo-1616628182509-6f03f56a2b35?auto=format&fit=crop&w=500&q=80',
      amount: 949,
      status: 'pending',
      date: '2026-05-25',
      customer: 'Vikram Singh',
    },
  ];

  for (const o of demoOrders) {
    await db.query(
      `
      INSERT INTO orders (id, product_id, product_title, product_image, amount, status, date, customer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [o.id, o.product_id, o.product_title, o.product_image, o.amount, o.status, o.date, o.customer]
    );
  }
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase(true).then(() => {
    console.log('Database seeded successfully.');
    process.exit(0);
  });
}
