import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, Store, Package, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import StatCard from '../components/layout/StatCard';
import { Card, CardContent } from '../components/ui/card';

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
      color: 'from-brand-primary to-emerald-500',
      path: '/upload',
    },
    {
      title: t('dashboard.storeTitle'),
      description: t('dashboard.storeDesc', { count: products.length }),
      icon: Store,
      color: 'from-brand-accent to-brand-warm',
      path: '/storefront',
    },
    {
      title: t('dashboard.ordersTitle'),
      description: t('dashboard.ordersDesc', { count: orders.length }),
      icon: Package,
      color: 'from-blue-400 to-cyan-500',
      path: '/orders',
    },
    {
      title: t('dashboard.earningsTitle'),
      description: t('dashboard.earningsDesc', { amount: totalEarnings.toLocaleString('en-IN') }),
      icon: TrendingUp,
      color: 'from-purple-400 to-pink-500',
      path: '/earnings',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 mb-4 bg-card/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-border"
        >
          <Sparkles className="w-6 h-6 text-brand-accent" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-emerald-400 bg-clip-text text-transparent">
            {t('brand')}
          </h1>
        </motion.div>
        <p className="text-lg text-muted-foreground">{t('tagline')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label={t('dashboard.statsProducts')} value={products.length} icon={Store} />
        <StatCard
          label={t('dashboard.statsOrders')}
          value={activeOrders}
          icon={Package}
          accent="from-blue-400 to-cyan-500"
        />
        <StatCard
          label={t('dashboard.statsEarnings')}
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          accent="from-purple-400 to-pink-500"
        />
        <StatCard
          label={t('dashboard.statsPending')}
          value={pendingSync}
          icon={Upload}
          accent="from-brand-accent to-brand-warm"
        />
      </div>

      {pendingSync > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-amber-950/40 border border-amber-800/50 rounded-2xl p-4 text-center"
        >
          <p className="text-amber-400 font-medium">
            {t('common.syncPending', { count: pendingSync })}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navCards.map((card, index) => (
          <motion.button
            key={card.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(card.path)}
            className="relative overflow-hidden bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl hover:border-brand-primary/30 transition-all p-6 text-left group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative z-10">
              <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
                <card.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{card.title}</h3>
              <p className="text-muted-foreground">{card.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <Card className="mt-8 border-border/60 bg-card/60">
        <CardContent className="p-5 text-center">
          <p className="text-sm text-muted-foreground">{t('footer')}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
