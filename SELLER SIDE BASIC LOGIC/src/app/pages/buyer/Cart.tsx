import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useBuyer } from '../../contexts/BuyerContext';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/button';

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useBuyer();

  if (!cart.length) {
    return (
      <div className="max-w-lg mx-auto scm-card p-12 text-center">
        <ShoppingBag className="w-14 h-14 text-[#ef4d23]/25 mx-auto mb-4" />
        <p className="text-neutral-700 font-medium mb-4">{t('buyer.cartEmpty')}</p>
        <Button onClick={() => navigate('/buyer')} className="scm-cta-gradient rounded-full">
          {t('buyer.nav.home')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <PageHeader title={t('buyer.cartTitle')} />
      {cart.map((item) => (
        <div key={item.productId} className="scm-card p-4 flex gap-4">
          <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 truncate">{item.title}</h3>
            <p className="text-sm text-neutral-500 truncate">{item.artisan}</p>
            <p className="text-[#ef4d23] font-bold mt-1">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => removeFromCart(item.productId)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="scm-tray p-6 sticky bottom-24">
        <div className="flex justify-between text-lg font-semibold text-neutral-900 mb-4">
          <span>{t('buyer.total')}</span>
          <span className="text-[#ef4d23]">₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <Button className="w-full scm-btn-dark h-11" onClick={() => navigate('/buyer/checkout')}>
          {t('buyer.checkout')}
        </Button>
      </div>
    </div>
  );
}
