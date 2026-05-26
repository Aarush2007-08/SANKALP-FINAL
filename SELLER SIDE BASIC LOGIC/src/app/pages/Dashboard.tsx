import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, Store, Package, TrendingUp, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import StatCard from '../components/layout/StatCard';
import PageLoader from '../components/layout/PageLoader';
import FlowerLogo from '../components/FlowerLogo';
import { cn } from '../components/ui/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { products, pendingSync, orders, totalEarnings, loading } = useApp();

  const activeOrders = orders.filter((o) => o.status !== 'delivered').length;

  const navCards = [
    {
      title: t('dashboard.uploadTitle'),
      description: t('dashboard.uploadDesc'),
      icon: Upload,
      accent: 'orange' as const,
      path: '/seller/upload',
    },
    {
      title: t('dashboard.storeTitle'),
      description: t('dashboard.storeDesc', { count: products.length }),
      icon: Store,
      accent: 'neutral' as const,
      path: '/seller/storefront',
    },
    {
      title: t('dashboard.ordersTitle'),
      description: t('dashboard.ordersDesc', { count: orders.length }),
      icon: Package,
      accent: 'blue' as const,
      path: '/seller/orders',
    },
    {
      title: t('dashboard.earningsTitle'),
      description: t('dashboard.earningsDesc', { amount: totalEarnings.toLocaleString('en-IN') }),
      icon: TrendingUp,
      accent: 'purple' as const,
      path: '/seller/earnings',
    },
  ];

  const accentIcon = {
    orange: 'from-[#ef4d23] to-[#ff6b47]',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-violet-500 to-fuchsia-500',
    neutral: 'from-neutral-700 to-neutral-900',
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 mb-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-neutral-200">
          <FlowerLogo className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{t('brand')}</h1>
        </div>
        <p className="text-neutral-600">{t('tagline')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label={t('dashboard.statsProducts')} value={products.length} icon={Store} accent="orange" />
        <StatCard label={t('dashboard.statsOrders')} value={activeOrders} icon={Package} accent="blue" />
        <StatCard
          label={t('dashboard.statsEarnings')}
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          accent="purple"
        />
        <StatCard label={t('dashboard.statsPending')} value={pendingSync} icon={Upload} accent="neutral" />
      </div>

      {pendingSync > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="scm-alert-sync text-center text-sm font-medium px-4 py-3 mb-6"
        >
          {t('common.syncPending', { count: pendingSync })}
        </motion.p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navCards.map((card, index) => (
          <motion.button
            key={card.path}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(card.path)}
            className="scm-nav-card p-6 text-left group w-full"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={cn('inline-flex p-3 rounded-xl bg-gradient-to-br mb-4', accentIcon[card.accent])}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">{card.title}</h3>
                <p className="text-sm text-neutral-500">{card.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-[#ef4d23] shrink-0 mt-1 transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-xs text-neutral-400 mt-10 px-4">{t('footer')}</p>
    </motion.div>
  );
}
