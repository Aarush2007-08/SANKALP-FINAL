import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingCart, Award, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useBuyer } from '../../contexts/BuyerContext';
import PageHeader from '../../components/layout/PageHeader';
import PageLoader from '../../components/layout/PageLoader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function Marketplace() {
  const { t } = useTranslation();
  const { products, addToCart, loading } = useBuyer();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={t('buyer.marketplaceTitle')}
        subtitle={t('buyer.marketplaceSubtitle', { count: products.length })}
      />
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('common.search')}
          className="pl-9 bg-white border-neutral-200 rounded-full h-11"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="scm-card p-12 text-center">
          <Heart className="w-12 h-12 text-[#ef4d23]/30 mx-auto mb-3" />
          <p className="text-neutral-600">{t('buyer.noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <article key={p.id} className="scm-card overflow-hidden flex flex-col">
              <div className="relative">
                <img src={p.image} alt="" className="w-full h-52 object-cover" />
                <span className="absolute top-3 left-3 text-xs font-medium bg-white/95 text-[#ef4d23] px-2.5 py-1 rounded-full shadow-sm">
                  {p.category}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-neutral-900 line-clamp-1">{p.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2 mt-1 flex-1">{p.description}</p>
                <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#ef4d23]" />
                  {p.artisan}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                  <span className="text-xl font-bold text-[#ef4d23]">₹{p.price.toLocaleString('en-IN')}</span>
                  <Button
                    size="sm"
                    className="scm-cta-gradient rounded-full"
                    onClick={() => {
                      addToCart(p);
                      toast.success(t('buyer.addedToCart'));
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t('buyer.addToCart')}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
