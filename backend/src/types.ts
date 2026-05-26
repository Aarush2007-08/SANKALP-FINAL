export type OrderStatus = 'pending' | 'packed' | 'shipped' | 'delivered';

export interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  category: string;
  caption: string;
  hashtags: string[];
  artisan: string;
  timestamp: number;
  synced: boolean;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  amount: number;
  status: OrderStatus;
  date: string;
  customer: string;
}

export interface CreateOrderInput {
  productId: string;
  productTitle: string;
  productImage: string;
  amount: number;
  customer: string;
}

export interface CreateProductInput {
  image: string;
  title: string;
  description: string;
  price: number;
  category: string;
  caption: string;
  hashtags: string[];
  artisan: string;
  synced?: boolean;
}

export interface GenerateListingInput {
  description: string;
  locale?: string;
}

export interface GenerateListingResult {
  title: string;
  ecommerceDescription: string;
  price: number;
  category: string;
  caption: string;
  hashtags: string[];
  pricing: {
    labor: number;
    material: number;
    suggested: number;
    range: string;
  };
}

export interface EarningsSummary {
  totalEarnings: number;
  completedOrders: number;
  pendingRevenue: number;
  monthlyData: { month: string; earnings: number }[];
}
