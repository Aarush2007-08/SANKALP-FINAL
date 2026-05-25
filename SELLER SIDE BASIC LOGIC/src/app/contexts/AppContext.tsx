import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  api,
  type Product,
  type Order,
  type OrderStatus,
  type CreateProductInput,
  type EarningsSummary,
  getOfflineQueue,
  enqueueProduct,
  setOfflineQueue,
} from '../api/client';

export type { Product, Order, OrderStatus };

interface AppContextType {
  products: Product[];
  addProduct: (product: CreateProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isOnline: boolean;
  pendingSync: number;
  syncProducts: () => Promise<void>;
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  advanceOrder: (id: string) => Promise<void>;
  totalEarnings: number;
  earningsSummary: EarningsSummary | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function queuedToProduct(item: CreateProductInput & { localId?: string }, index: number): Product {
  return {
    id: item.localId ?? `local_${index}`,
    image: item.image,
    title: item.title,
    description: item.description,
    price: item.price,
    category: item.category,
    caption: item.caption,
    hashtags: item.hashtags,
    artisan: item.artisan,
    timestamp: Date.now(),
    synced: false,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  const mergeWithQueue = useCallback((serverProducts: Product[]) => {
    const queue = getOfflineQueue();
    const localOnly = queue.map((q, i) => queuedToProduct(q, i));
    const serverIds = new Set(serverProducts.map((p) => p.id));
    const unsyncedLocal = localOnly.filter((p) => !serverIds.has(p.id));
    return [...unsyncedLocal, ...serverProducts];
  }, []);

  const refresh = useCallback(async () => {
    if (!navigator.onLine) {
      const queue = getOfflineQueue();
      setProducts(queue.map((q, i) => queuedToProduct(q, i)));
      return;
    }

    try {
      const [prods, ords, summary] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getEarningsSummary(),
      ]);
      setProducts(mergeWithQueue(prods));
      setOrders(ords);
      setEarningsSummary(summary);
    } catch {
      const queue = getOfflineQueue();
      if (queue.length) {
        setProducts(queue.map((q, i) => queuedToProduct(q, i)));
      }
    }
  }, [mergeWithQueue]);

  const syncProducts = useCallback(async () => {
    if (!navigator.onLine) return;

    const queue = getOfflineQueue();
    const remaining: typeof queue = [];

    for (const item of queue) {
      try {
        await api.createProduct({ ...item, synced: true });
      } catch {
        remaining.push(item);
      }
    }

    setOfflineQueue(remaining);

    try {
      await api.syncAllProducts();
      await refresh();
    } catch {
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncProducts();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncProducts]);

  const addProduct = async (product: CreateProductInput) => {
    if (!navigator.onLine) {
      const queued = enqueueProduct(product);
      setProducts((prev) => [queuedToProduct(queued, prev.length), ...prev]);
      return;
    }

    try {
      const created = await api.createProduct({ ...product, synced: true });
      setProducts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
    } catch {
      const queued = enqueueProduct(product);
      setProducts((prev) => [queuedToProduct(queued, prev.length), ...prev]);
    }
  };

  const deleteProduct = async (id: string) => {
    if (id.startsWith('local_')) {
      const queue = getOfflineQueue().filter((q) => q.localId !== id);
      setOfflineQueue(queue);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    if (navigator.onLine) {
      await api.deleteProduct(id);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    if (!navigator.onLine) return;
    const updated = await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    const summary = await api.getEarningsSummary();
    setEarningsSummary(summary);
  };

  const advanceOrder = async (id: string) => {
    if (!navigator.onLine) return;
    const updated = await api.advanceOrder(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    const summary = await api.getEarningsSummary();
    setEarningsSummary(summary);
  };

  const pendingSync = products.filter((p) => !p.synced).length;
  const totalEarnings = earningsSummary?.totalEarnings ?? orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        isOnline,
        pendingSync,
        syncProducts,
        orders,
        updateOrderStatus,
        advanceOrder,
        totalEarnings,
        earningsSummary,
        loading,
        refresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
