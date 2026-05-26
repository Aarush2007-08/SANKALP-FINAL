import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { BuyerProvider, useBuyer } from './contexts/BuyerContext';
import PlatformLayout from './components/layout/PlatformLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadProduct from './pages/UploadProduct';
import Storefront from './pages/Storefront';
import Orders from './pages/Orders';
import Earnings from './pages/Earnings';
import Marketplace from './pages/buyer/Marketplace';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import MyOrders from './pages/buyer/MyOrders';
import OfflineBanner from './components/OfflineBanner';
import { Toaster } from './components/ui/sonner';

function SellerLayout() {
  const { isOnline } = useApp();
  return (
    <PlatformLayout variant="seller" isOnline={isOnline}>
      <OfflineBanner />
      <Outlet />
    </PlatformLayout>
  );
}

function SellerApp() {
  return (
    <AppProvider>
      <SellerLayout />
    </AppProvider>
  );
}

function BuyerLayout() {
  const { cartCount } = useBuyer();
  return (
    <PlatformLayout variant="buyer" cartCount={cartCount}>
      <Outlet />
    </PlatformLayout>
  );
}

function BuyerApp() {
  return (
    <BuyerProvider>
      <BuyerLayout />
    </BuyerProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/seller" element={<SellerApp />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadProduct />} />
          <Route path="storefront" element={<Storefront />} />
          <Route path="orders" element={<Orders />} />
          <Route path="earnings" element={<Earnings />} />
        </Route>

        <Route path="/buyer" element={<BuyerApp />}>
          <Route index element={<Marketplace />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<MyOrders />} />
        </Route>
      </Routes>

      <Toaster position="top-center" theme="light" />
    </Router>
  );
}
