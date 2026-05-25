import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import UploadProduct from './pages/UploadProduct';
import Storefront from './pages/Storefront';
import Orders from './pages/Orders';
import Earnings from './pages/Earnings';
import OfflineBanner from './components/OfflineBanner';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen dark">
          <OfflineBanner />
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadProduct />} />
              <Route path="/storefront" element={<Storefront />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/earnings" element={<Earnings />} />
            </Routes>
          </AppShell>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AppProvider>
  );
}
