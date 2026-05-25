import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Upload, Store, Package, TrendingUp, Home, Wifi, WifiOff } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useApp } from '../../contexts/AppContext';
import { cn } from '../ui/utils';

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', icon: Home, key: 'dashboard' },
  { path: '/upload', icon: Upload, key: 'upload' },
  { path: '/storefront', icon: Store, key: 'storefront' },
  { path: '/orders', icon: Package, key: 'orders' },
  { path: '/earnings', icon: TrendingUp, key: 'earnings' },
] as const;

export default function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const { isOnline } = useApp();
  const location = useLocation();
  const hideNav = false;

  return (
    <div className="min-h-screen bg-background craft-bg">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-6 h-6 text-brand-accent shrink-0" />
            <span className="font-bold text-lg bg-gradient-to-r from-brand-primary to-emerald-400 bg-clip-text text-transparent truncate">
              {t('brand')}
            </span>
          </NavLink>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                isOnline
                  ? 'bg-green-950/50 text-green-400 border border-green-800/50'
                  : 'bg-amber-950/50 text-amber-400 border border-amber-800/50'
              )}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? t('common.online') : t('common.offline')}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28">{children}</main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur-md safe-bottom">
          <div className="max-w-6xl mx-auto flex justify-around px-1 py-2">
            {navItems.map(({ path, icon: Icon, key }) => {
              const active = location.pathname === path;
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[56px] transition-colors',
                    active
                      ? 'text-brand-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn('w-5 h-5', active && 'scale-110')} />
                  <span className="text-[10px] font-medium leading-tight text-center">
                    {t(`nav.${key}`)}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
