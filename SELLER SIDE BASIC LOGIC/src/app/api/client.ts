const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

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

export type OrderStatus = 'pending' | 'packed' | 'shipped' | 'delivered';

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

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  getProducts: () => request<Product[]>('/api/products'),

  createProduct: (data: CreateProductInput) =>
    request<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) }),

  deleteProduct: (id: string) =>
    request<void>(`/api/products/${id}`, { method: 'DELETE' }),

  syncProduct: (id: string) =>
    request<Product>(`/api/products/${id}/sync`, { method: 'PATCH' }),

  syncAllProducts: () =>
    request<Product[]>('/api/products/sync-all', { method: 'POST' }),

  getOrders: () => request<Order[]>('/api/orders'),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  advanceOrder: (id: string) =>
    request<Order>(`/api/orders/${id}/advance`, { method: 'POST' }),

  getEarningsSummary: () => request<EarningsSummary>('/api/earnings/summary'),

  generateListing: (description: string, locale?: string) =>
    request<GenerateListingResult>('/api/ai/generate-listing', {
      method: 'POST',
      body: JSON.stringify({ description, locale }),
    }),
};

const QUEUE_KEY = 'artisynk_offline_queue';

export interface QueuedProduct extends CreateProductInput {
  localId: string;
}

export function getOfflineQueue(): QueuedProduct[] {
  const saved = localStorage.getItem(QUEUE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function setOfflineQueue(queue: QueuedProduct[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueProduct(product: CreateProductInput): QueuedProduct {
  const queue = getOfflineQueue();
  const item: QueuedProduct = { ...product, localId: `local_${Date.now()}`, synced: false };
  queue.push(item);
  setOfflineQueue(queue);
  return item;
}

export function clearOfflineQueue() {
  localStorage.removeItem(QUEUE_KEY);
}
