import type { EarningsSummary, Order, Product } from '../api/client';

const now = Date.now();

export const sampleProducts: Product[] = [
  {
    id: 'sample_1',
    image:
      'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=900&q=80',
    title: 'Handwoven Palm Basket',
    description:
      'A sturdy handwoven basket made from natural palm fibers by women artisan groups.',
    price: 799,
    category: 'Handicrafts',
    caption:
      'Bring home eco-friendly storage with this handwoven palm basket made by rural artisans.',
    hashtags: [
      '#Handmade',
      '#WomenArtisans',
      '#Sustainable',
      '#Handicrafts',
      '#MadeInIndia',
    ],
    artisan: 'Savitri Collective',
    timestamp: now - 86400000 * 1,
    synced: true,
  },
  {
    id: 'sample_2',
    image:
      'https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?auto=format&fit=crop&w=900&q=80',
    title: 'Terracotta Table Vase',
    description:
      'Traditional terracotta vase with hand-etched floral patterns and natural matte finish.',
    price: 1199,
    category: 'Pottery',
    caption: 'Handcrafted terracotta elegance for your living space.',
    hashtags: ['#Pottery', '#Terracotta', '#ArtisanMade', '#HomeDecor', '#SupportLocal'],
    artisan: 'Madhavi Pottery Unit',
    timestamp: now - 86400000 * 2,
    synced: true,
  },
  {
    id: 'sample_3',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    title: 'Block Print Cotton Stole',
    description:
      'Soft cotton stole featuring hand block-printed motifs inspired by village art patterns.',
    price: 649,
    category: 'Textiles',
    caption: 'A breathable cotton stole with authentic hand block print work.',
    hashtags: ['#Textiles', '#BlockPrint', '#Cotton', '#WomenLed', '#SlowFashion'],
    artisan: 'Narmada Stitch Circle',
    timestamp: now - 86400000 * 3,
    synced: true,
  },
  {
    id: 'sample_4',
    image:
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=80',
    title: 'Beaded Thread Earrings',
    description:
      'Lightweight handmade earrings crafted with glass beads and dyed cotton thread.',
    price: 499,
    category: 'Jewelry',
    caption: 'Everyday handmade earrings that add color and character.',
    hashtags: ['#Jewelry', '#HandmadeAccessories', '#Beadwork', '#Crafts', '#RuralMakers'],
    artisan: 'Jyoti Self Help Group',
    timestamp: now - 86400000 * 4,
    synced: true,
  },
  {
    id: 'sample_5',
    image:
      'https://images.unsplash.com/photo-1616628182509-6f03f56a2b35?auto=format&fit=crop&w=900&q=80',
    title: 'Jute Storage Organizer',
    description:
      'Durable jute organizer with stitched handles, ideal for shelves, toys, and laundry.',
    price: 949,
    category: 'Home Decor',
    caption: 'Functional handcrafted jute organizer for neat and stylish storage.',
    hashtags: ['#Jute', '#HomeDecor', '#EcoFriendly', '#Handmade', '#SupportWomen'],
    artisan: 'Kamla Women Weavers',
    timestamp: now - 86400000 * 5,
    synced: true,
  },
];

export const sampleOrders: Order[] = [
  {
    id: 'SAMPLE_ORD_1',
    productId: 'sample_1',
    productTitle: 'Handwoven Palm Basket',
    productImage:
      'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=500&q=80',
    amount: 799,
    status: 'delivered',
    date: '2026-05-20',
    customer: 'Priya Sharma',
  },
  {
    id: 'SAMPLE_ORD_2',
    productId: 'sample_2',
    productTitle: 'Terracotta Table Vase',
    productImage:
      'https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?auto=format&fit=crop&w=500&q=80',
    amount: 1199,
    status: 'shipped',
    date: '2026-05-22',
    customer: 'Rajesh Kumar',
  },
  {
    id: 'SAMPLE_ORD_3',
    productId: 'sample_3',
    productTitle: 'Block Print Cotton Stole',
    productImage:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80',
    amount: 649,
    status: 'packed',
    date: '2026-05-24',
    customer: 'Anita Desai',
  },
  {
    id: 'SAMPLE_ORD_4',
    productId: 'sample_5',
    productTitle: 'Jute Storage Organizer',
    productImage:
      'https://images.unsplash.com/photo-1616628182509-6f03f56a2b35?auto=format&fit=crop&w=500&q=80',
    amount: 949,
    status: 'pending',
    date: '2026-05-25',
    customer: 'Vikram Singh',
  },
];

export const sampleEarningsSummary: EarningsSummary = {
  totalEarnings: 799,
  completedOrders: 1,
  pendingRevenue: 2797,
  monthlyData: [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 1850 },
    { month: 'Mar', earnings: 950 },
    { month: 'Apr', earnings: 2100 },
    { month: 'May', earnings: 799 },
  ],
};
