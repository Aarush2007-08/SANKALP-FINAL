import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { useBuyer } from '../../contexts/BuyerContext';
import type { OrderStatus } from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import PageLoader from '../../components/layout/PageLoader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../components/ui/utils';

const statusChip: Record<OrderStatus, string> = {
  pending: 'scm-status-pending',
  packed: 'scm-status-packed',
  shipped: 'scm-status-shipped',
  delivered: 'scm-status-delivered',
};

export default function MyOrders() {
  const { t } = useTranslation();
  const { myOrders, customerName, setCustomerName, refreshOrders, loading } = useBuyer();
  const [name, setName] = useState(customerName);

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title={t('buyer.ordersTitle')} subtitle={t('buyer.ordersSubtitle', { count: myOrders.length })} />
      <div className="scm-card p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label className="text-neutral-700">{t('buyer.lookupName')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 bg-white rounded-xl" />
        </div>
        <Button
          className="scm-cta-gradient rounded-full sm:self-end shrink-0"
          onClick={() => {
            const lookupName = name.trim();
            setCustomerName(lookupName);
            refreshOrders(lookupName);
          }}
        >
          {t('buyer.showOrders')}
        </Button>
      </div>
      {loading ? (
        <PageLoader />
      ) : !customerName ? (
        <div className="scm-card p-10 text-center text-neutral-500">{t('buyer.enterNameFirst')}</div>
      ) : !myOrders.length ? (
        <div className="scm-card p-10 text-center">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">{t('buyer.noOrders')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <div key={o.id} className="scm-card p-4 flex gap-3">
              <img src={o.productImage} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-neutral-900 truncate">{o.productTitle}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{o.id}</p>
                <p className="text-[#ef4d23] font-bold mt-1">₹{o.amount.toLocaleString('en-IN')}</p>
                <span
                  className={cn(
                    'inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mt-2',
                    statusChip[o.status]
                  )}
                >
                  {t(`orders.status.${o.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
