import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, type Product, type Order } from '../api/client';

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  artisan: string;
  quantity: number;
}

const CART_KEY = 'scm_buyer_cart';
const CUSTOMER_KEY = 'scm_buyer_name';

interface BuyerContextType {
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  customerName: string;
  setCustomerName: (n: string) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  myOrders: Order[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  refreshOrders: (customerOverride?: string) => Promise<void>;
  placeAllOrders: (customerOverride?: string) => Promise<void>;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function BuyerProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [customerName, setCustomerNameState] = useState(
    () => localStorage.getItem(CUSTOMER_KEY) ?? ''
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const setCustomerName = (n: string) => {
    setCustomerNameState(n);
    localStorage.setItem(CUSTOMER_KEY, n);
  };

  const refreshProducts = useCallback(async () => {
    try {
      const p = await api.getProducts();
      setProducts(p.filter((x) => x.synced));
    } catch {
      setProducts([]);
    }
  }, []);

  const refreshOrders = useCallback(async (customerOverride?: string) => {
    const lookupName = (customerOverride ?? customerName).trim();
    if (!lookupName) return setMyOrders([]);
    try {
      setMyOrders(await api.getOrdersByCustomer(lookupName));
    } catch {
      setMyOrders([]);
    }
  }, [customerName]);

  useEffect(() => {
    refreshProducts().finally(() => setLoading(false));
  }, [refreshProducts]);

  useEffect(() => {
    refreshOrders();
  }, [customerName, refreshOrders]);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === p.id);
      if (ex) return prev.map((i) => (i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [
        ...prev,
        {
          productId: p.id,
          title: p.title,
          image: p.image,
          price: p.price,
          artisan: p.artisan,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => setCart((p) => p.filter((i) => i.productId !== id));
  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    setCart((p) => p.map((i) => (i.productId === id ? { ...i, quantity: q } : i)));
  };
  const clearCart = () => setCart([]);

  const placeAllOrders = async (customerOverride?: string) => {
    const orderCustomer = (customerOverride ?? customerName).trim();
    if (!orderCustomer) throw new Error('Customer name is required');

    for (const item of cart) {
      await api.createOrder({
        productId: item.productId,
        productTitle: item.title,
        productImage: item.image,
        amount: item.price * item.quantity,
        customer: orderCustomer,
      });
    }
    clearCart();
    await refreshOrders(orderCustomer);
  };

  return (
    <BuyerContext.Provider
      value={{
        products,
        cart,
        cartCount: cart.reduce((s, i) => s + i.quantity, 0),
        cartTotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
        customerName,
        setCustomerName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        myOrders,
        loading,
        refreshProducts,
        refreshOrders,
        placeAllOrders,
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
}

export function useBuyer() {
  const c = useContext(BuyerContext);
  if (!c) throw new Error('useBuyer within BuyerProvider');
  return c;
}
