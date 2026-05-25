import type { GenerateListingResult } from './types.js';

function generateTitle(desc: string) {
  const words = desc.split(' ').filter(Boolean);
  const firstThree = words.slice(0, 3).join(' ');
  return `Handcrafted ${firstThree.charAt(0).toUpperCase() + firstThree.slice(1)}`;
}

function generateEcommerceDescription(desc: string) {
  return `✨ Authentic handmade creation by rural women artisans. ${desc}. Each piece is unique and crafted with traditional techniques passed down through generations. Support local artisans and bring home a piece of heritage.`;
}

function generateInstagramCaption(desc: string) {
  return `🌟 Discover the beauty of handmade craftsmanship! ${desc}. Every piece tells a story of tradition and passion. Made with love by rural women artisans. 💚`;
}

function generateHashtags(category: string) {
  return [
    '#Handmade',
    '#Artisan',
    '#RuralCrafts',
    `#${category.replace(/\s/g, '')}`,
    '#SupportLocal',
    '#Sustainable',
    '#WomenEmpowerment',
    '#MadeInIndia',
  ];
}

export function generateListing(description: string): GenerateListingResult {
  const categories = ['Handicrafts', 'Textiles', 'Pottery', 'Jewelry', 'Home Decor'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const basePrice = Math.floor(Math.random() * 2000) + 500;
  const laborCost = Math.floor(basePrice * 0.4);
  const materialCost = Math.floor(basePrice * 0.3);

  return {
    title: generateTitle(description),
    ecommerceDescription: generateEcommerceDescription(description),
    price: basePrice,
    category: randomCategory,
    caption: generateInstagramCaption(description),
    hashtags: generateHashtags(randomCategory),
    pricing: {
      labor: laborCost,
      material: materialCost,
      suggested: basePrice,
      range: `₹${Math.floor(basePrice * 0.9)} - ₹${Math.floor(basePrice * 1.2)}`,
    },
  };
}
