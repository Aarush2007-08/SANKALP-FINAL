import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useBuyer } from '../../contexts/BuyerContext';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, cartTotal, customerName, setCustomerName, placeAllOrders } = useBuyer();
  const [name, setName] = useState(customerName);
  const [busy, setBusy] = useState(false);

  if (!cart.length) {
    navigate('/buyer/cart', { replace: true });
    return null;
  }

  const submit = async () => {
    if (!name.trim()) return toast.error(t('buyer.nameRequired'));
    setCustomerName(name.trim());
    setBusy(true);
    try {
      await placeAllOrders();
      confetti({ particleCount: 80, spread: 60, colors: ['#ef4d23', '#ff6b47', '#0b0f1a'] });
      toast.success(t('buyer.orderPlaced'));
      navigate('/buyer/orders');
    } catch {
      toast.error(t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title={t('buyer.checkoutTitle')} subtitle={t('buyer.checkoutSubtitle')} />
      <div className="scm-card p-6 space-y-4">
        <div>
          <Label className="text-neutral-700">{t('buyer.yourName')}</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('buyer.namePlaceholder')}
            className="mt-2 bg-white border-neutral-200 rounded-xl h-11"
          />
          <p className="text-xs text-neutral-500 mt-1.5">{t('buyer.nameHint')}</p>
        </div>
        <div className="scm-subcard p-4 space-y-2">
          {cart.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm text-neutral-700">
              <span className="truncate pr-2">
                {i.title} × {i.quantity}
              </span>
              <span className="font-medium shrink-0">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-neutral-100 pt-4">
          <span>{t('buyer.total')}</span>
          <span className="text-[#ef4d23]">₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <Button disabled={busy} onClick={submit} className="w-full scm-cta-gradient rounded-full h-12 text-base">
          {busy ? t('common.loading') : t('buyer.placeOrder')}
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => navigate('/buyer/cart')}>
          {t('buyer.backToCart')}
        </Button>
      </div>
    </div>
  );
}
