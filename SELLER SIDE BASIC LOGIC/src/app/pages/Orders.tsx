import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Package, CheckCircle, Truck, Clock, Box, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import type { OrderStatus } from '../api/client';
import PageHeader from '../components/layout/PageHeader';
import PageLoader from '../components/layout/PageLoader';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from '../components/ui/utils';

const STATUS_FLOW: OrderStatus[] = ['pending', 'packed', 'shipped', 'delivered'];

const statusConfig = {
  pending: {
    icon: Clock,
    chip: 'scm-status-pending',
    gradient: 'from-amber-400 to-orange-500',
  },
  packed: {
    icon: Box,
    chip: 'scm-status-packed',
    gradient: 'from-blue-400 to-cyan-500',
  },
  shipped: {
    icon: Truck,
    chip: 'scm-status-shipped',
    gradient: 'from-violet-400 to-purple-500',
  },
  delivered: {
    icon: CheckCircle,
    chip: 'scm-status-delivered',
    gradient: 'from-emerald-400 to-green-500',
  },
} as const;

export default function Orders() {
  const { t } = useTranslation();
  const { orders, advanceOrder, isOnline, loading } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const handleAdvance = async (id: string) => {
    if (!isOnline) {
      toast.error(t('common.offlineMode'));
      return;
    }
    try {
      await advanceOrder(id);
      toast.success(t('common.saved'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={t('orders.title')}
        subtitle={t('orders.subtitle', { count: orders.length })}
        icon={<Package className="w-8 h-8 text-[#ef4d23]" />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STATUS_FLOW.map((status) => {
          const config = statusConfig[status];
          const count = orders.filter((o) => o.status === status).length;
          const Icon = config.icon;
          return (
            <div key={status} className={cn('scm-card p-4 text-center border', config.chip)}>
              <Icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-bold text-neutral-900">{count}</p>
              <p className="text-xs font-medium mt-0.5">{t(`orders.status.${status}`)}</p>
            </div>
          );
        })}
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="bg-neutral-100 flex flex-wrap h-auto gap-1 p-1 rounded-full">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-[#ef4d23]">
            {t('orders.filterAll')}
          </TabsTrigger>
          {STATUS_FLOW.map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-[#ef4d23]"
            >
              {t(`orders.status.${s}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <div className="scm-card p-12 text-center text-neutral-500">{t('orders.subtitle', { count: 0 })}</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const canAdvance = order.status !== 'delivered';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="scm-card overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-36 h-36 md:h-auto shrink-0 bg-neutral-100">
                    <img src={order.productImage} alt={order.productTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">{order.productTitle}</h3>
                        <p className="text-sm text-neutral-500">
                          {t('orders.orderId')}: {order.id}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {t('orders.customer')}: {order.customer}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold w-fit',
                          config.chip
                        )}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {t(`orders.status.${order.status}`)}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-neutral-500">{t('orders.orderDate')}</p>
                        <p className="font-medium text-neutral-800">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">{t('orders.amount')}</p>
                        <p className="text-xl font-bold text-[#ef4d23]">
                          ₹{order.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <div className="absolute left-0 top-1/2 w-full h-1 bg-neutral-100 -translate-y-1/2 rounded-full" />
                      <div
                        className={cn('absolute left-0 top-1/2 h-1 bg-gradient-to-r -translate-y-1/2 rounded-full transition-all', config.gradient)}
                        style={{
                          width:
                            order.status === 'pending'
                              ? '25%'
                              : order.status === 'packed'
                                ? '50%'
                                : order.status === 'shipped'
                                  ? '75%'
                                  : '100%',
                        }}
                      />
                      <div className="relative flex justify-between">
                        {STATUS_FLOW.map((s, i) => {
                          const active = STATUS_FLOW.indexOf(order.status) >= i;
                          const sc = statusConfig[s];
                          return (
                            <div
                              key={s}
                              className={cn(
                                'w-7 h-7 rounded-full flex items-center justify-center border-2',
                                active
                                  ? `bg-gradient-to-br ${sc.gradient} border-white text-white`
                                  : 'bg-white border-neutral-200 text-neutral-300'
                              )}
                            >
                              {active && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {canAdvance && (
                      <Button
                        size="sm"
                        onClick={() => handleAdvance(order.id)}
                        disabled={!isOnline}
                        className="scm-cta-gradient rounded-full"
                      >
                        {t('orders.advance')}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
