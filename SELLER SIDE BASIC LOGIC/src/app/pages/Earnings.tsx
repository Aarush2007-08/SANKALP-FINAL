import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../contexts/AppContext';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/layout/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const barColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];

export default function Earnings() {
  const { t } = useTranslation();
  const { orders, earningsSummary, loading } = useApp();

  const summary = earningsSummary;
  const totalEarnings = summary?.totalEarnings ?? 0;
  const completedOrders = summary?.completedOrders ?? 0;
  const pendingRevenue = summary?.pendingRevenue ?? 0;
  const monthlyData = summary?.monthlyData ?? [];

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">{t('common.loading')}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={t('earnings.title')}
        subtitle={t('earnings.subtitle')}
        icon={<TrendingUp className="w-9 h-9 text-purple-400" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={t('earnings.totalEarnings')}
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <StatCard
          label={t('earnings.completedOrders')}
          value={completedOrders}
          icon={Package}
          accent="from-blue-400 to-cyan-500"
        />
        <StatCard
          label={t('earnings.pendingRevenue')}
          value={`₹${pendingRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          accent="from-purple-400 to-pink-500"
        />
        <StatCard
          label={t('earnings.thisMonth')}
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={Calendar}
          accent="from-brand-accent to-brand-warm"
        />
      </div>

      <Card className="border-border/60 shadow-xl mb-8">
        <CardHeader>
          <CardTitle>{t('earnings.monthlyChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Earnings']}
                />
                <Bar dataKey="earnings" radius={[8, 8, 0, 0]}>
                  {monthlyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xl mb-8">
        <CardHeader>
          <CardTitle>{t('earnings.recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deliveredOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">—</p>
          ) : (
            deliveredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-green-950/30 rounded-xl border border-green-900/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImage}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{order.productTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-primary">
                    +₹{order.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-brand-primary to-emerald-600 border-0 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">{t('earnings.motivationTitle')}</h3>
          <p className="text-lg opacity-90">{t('earnings.motivationDesc')}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
