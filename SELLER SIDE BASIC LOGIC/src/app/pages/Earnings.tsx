import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../contexts/AppContext';
import PageHeader from '../components/layout/PageHeader';
import PageLoader from '../components/layout/PageLoader';
import StatCard from '../components/layout/StatCard';

const barColors = ['#ef4d23', '#ff6b47', '#0b0f1a', '#f59e0b', '#8b5cf6'];

export default function Earnings() {
  const { t } = useTranslation();
  const { orders, earningsSummary, loading } = useApp();

  const summary = earningsSummary;
  const totalEarnings = summary?.totalEarnings ?? 0;
  const completedOrders = summary?.completedOrders ?? 0;
  const pendingRevenue = summary?.pendingRevenue ?? 0;
  const monthlyData = summary?.monthlyData ?? [];

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  if (loading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={t('earnings.title')}
        subtitle={t('earnings.subtitle')}
        icon={<TrendingUp className="w-8 h-8 text-[#ef4d23]" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('earnings.totalEarnings')} value={`₹${totalEarnings.toLocaleString('en-IN')}`} icon={DollarSign} accent="orange" />
        <StatCard label={t('earnings.completedOrders')} value={completedOrders} icon={Package} accent="blue" />
        <StatCard
          label={t('earnings.pendingRevenue')}
          value={`₹${pendingRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          accent="purple"
        />
        <StatCard
          label={t('earnings.thisMonth')}
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={Calendar}
          accent="neutral"
        />
      </div>

      <div className="scm-card p-6 mb-8">
        <h2 className="font-semibold text-neutral-900 mb-4">{t('earnings.monthlyChart')}</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" tick={{ fill: '#737373', fontSize: 12 }} />
              <YAxis tick={{ fill: '#737373', fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  color: '#171717',
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
      </div>

      <div className="scm-card p-6 mb-8">
        <h2 className="font-semibold text-neutral-900 mb-4">{t('earnings.recentTransactions')}</h2>
        <div className="space-y-3">
          {deliveredOrders.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">—</p>
          ) : (
            deliveredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center justify-between p-4 scm-subcard"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={order.productImage} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{order.productTitle}</h3>
                    <p className="text-sm text-neutral-500">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-lg font-bold text-[#ef4d23]">+₹{order.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-neutral-500">{order.customer}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="scm-tray p-8 text-center">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">{t('earnings.motivationTitle')}</h3>
        <p className="text-neutral-600 max-w-md mx-auto">{t('earnings.motivationDesc')}</p>
      </div>
    </motion.div>
  );
}
