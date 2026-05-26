import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Wifi,
  WifiOff,
  Home,
  Upload,
  Store,
  Package,
  TrendingUp,
  LucideIcon,
  ArrowLeftRight,
} from 'lucide-react';
import FlowerLogo from '../FlowerLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '../ui/utils';

type PortalVariant = 'seller' | 'buyer';

interface PlatformLayoutProps {
  variant: PortalVariant;
  children: ReactNode;
  isOnline?: boolean;
  cartCount?: number;
}

const sellerNav: { path: string; icon: LucideIcon; key: string; end?: boolean }[] = [
  { path: '/seller', icon: Home, key: 'dashboard', end: true },
  { path: '/seller/upload', icon: Upload, key: 'upload' },
  { path: '/seller/storefront', icon: Store, key: 'storefront' },
  { path: '/seller/orders', icon: Package, key: 'orders' },
  { path: '/seller/earnings', icon: TrendingUp, key: 'earnings' },
];

const buyerNav = [
  { path: '/buyer', icon: Store, key: 'home', end: true },
  { path: '/buyer/cart', icon: ShoppingCart, key: 'cart' },
  { path: '/buyer/orders', icon: Package, key: 'orders' },
];

export default function PlatformLayout({
  variant,
  children,
  isOnline = true,
  cartCount = 0,
}: PlatformLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navItems = variant === 'seller' ? sellerNav : buyerNav;
  const title = variant === 'seller' ? t('platform.sellerTitle') : t('buyer.brand');
  const otherPortal = variant === 'seller' ? '/buyer' : '/seller';
  const otherLabel = variant === 'seller' ? t('platform.buyerTitle') : t('platform.sellerTitle');

  return (
    <div className="scm-page-frame">
      <div className="scm-panel flex flex-col overflow-hidden">
        <div className="flex justify-center pt-4 sm:pt-5 px-3 sm:px-4 shrink-0">
          <div className="bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2 w-full max-w-[920px]">
            <div className="flex items-center gap-2 sm:gap-3">
              <NavLink to="/" className="flex items-center gap-2 shrink-0 min-w-0">
                <FlowerLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                <span className="font-semibold text-sm sm:text-base text-neutral-900 truncate">{title}</span>
              </NavLink>
              <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
                {variant === 'seller' && (
                  <div
                    className={cn(
                      'hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-full border',
                      isOnline
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    )}
                  >
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {isOnline ? t('common.online') : t('common.offline')}
                  </div>
                )}
                <NavLink
                  to={otherPortal}
                  className="hidden md:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-neutral-200 text-neutral-600 hover:border-[#ef4d23]/40 hover:text-[#ef4d23] transition-colors"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span className="max-w-[100px] truncate">{otherLabel}</span>
                </NavLink>
                <NavLink
                  to="/"
                  className="hidden sm:inline text-xs px-2.5 py-1 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-900"
                >
                  {t('platform.hub')}
                </NavLink>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pb-24 px-3 sm:px-4 pt-3 max-w-5xl w-full mx-auto">{children}</main>

        <nav className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-40 safe-bottom pointer-events-none">
          <div className="max-w-lg mx-auto bg-white rounded-full shadow-lg border border-neutral-200 px-2 py-2 flex justify-around pointer-events-auto">
            {navItems.map(({ path, icon: Icon, key, end }) => {
              const active = end ? location.pathname === path : location.pathname.startsWith(path);
              const showBadge = variant === 'buyer' && key === 'cart' && cartCount > 0;
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-full min-w-[52px] text-[10px] font-medium transition-colors',
                    active ? 'text-[#ef4d23]' : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  <Icon className={cn('w-5 h-5', active && 'scale-110')} />
                  {showBadge && (
                    <span className="absolute -top-0.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#ef4d23] text-white text-[9px] font-bold flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                  {t(variant === 'seller' ? `nav.${key}` : `buyer.nav.${key}`)}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
