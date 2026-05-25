import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Package, CheckCircle, Truck, Clock, Box, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import type { OrderStatus } from '../api/client';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from '../components/ui/utils';

const STATUS_FLOW: OrderStatus[] = ['pending', 'packed', 'shipped', 'delivered'];

export default function Orders() {
  const { t } = useTranslation();
  const { orders, advanceOrder, isOnline, loading } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const statusConfig = {
    pending: { icon: Clock, color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-950/40', border: 'border-yellow-800', text: 'text-yellow-400' },
    packed: { icon: Box, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-950/40', border: 'border-blue-800', text: 'text-blue-400' },
    shipped: { icon: Truck, color: 'from-purple-400 to-pink-500', bg: 'bg-purple-950/40', border: 'border-purple-800', text: 'text-purple-400' },
    delivered: { icon: CheckCircle, color: 'from-brand-primary to-emerald-500', bg: 'bg-green-950/40', border: 'border-green-800', text: 'text-green-400' },
  };

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

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">{t('common.loading')}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={t('orders.title')}
        subtitle={t('orders.subtitle', { count: orders.length })}
        icon={<Package className="w-9 h-9 text-blue-400" />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STATUS_FLOW.map((status) => {
          const config = statusConfig[status];
          const count = orders.filter((o) => o.status === status).length;
          return (
            <Card key={status} className={cn(config.bg, config.border, 'border')}>
              <CardContent className="p-4 text-center">
                <config.icon className={cn('w-7 h-7 mx-auto mb-2', config.text)} />
                <p className="text-2xl font-bold">{count}</p>
                <p className={cn('text-xs font-medium', config.text)}>
                  {t(`orders.status.${status}`)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="bg-card/80 flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all">{t('orders.filterAll')}</TabsTrigger>
          {STATUS_FLOW.map((s) => (
            <TabsTrigger key={s} value={s}>
              {t(`orders.status.${s}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-border/60 hover:border-border transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-40 h-40 md:h-auto shrink-0">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{order.productTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t('orders.orderId')}: {order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('orders.customer')}: {order.customer}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit',
                          config.bg,
                          config.border
                        )}
                      >
                        <StatusIcon className={cn('w-4 h-4', config.text)} />
                        <span className={cn('font-semibold text-sm', config.text)}>
                          {t(`orders.status.${order.status}`)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('orders.orderDate')}</p>
                        <p className="font-medium">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('orders.amount')}</p>
                        <p className="text-xl font-bold text-brand-primary">
                          ₹{order.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -translate-y-1/2" />
                      <div
                        className={cn('absolute left-0 top-1/2 h-1 bg-gradient-to-r -translate-y-1/2 transition-all', config.color)}
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
                                'w-7 h-7 rounded-full flex items-center justify-center',
                                active
                                  ? `bg-gradient-to-br ${sc.color} text-white`
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {active && <CheckCircle className="w-4 h-4" />}
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
                        className="bg-gradient-to-r from-brand-primary to-emerald-500"
                      >
                        {t('orders.advance')}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
