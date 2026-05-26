import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Award,
  Sparkles,
  Instagram,
  Share2,
  Search,
  Trash2,
  Download,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import type { Product } from '../api/client';
import PageHeader from '../components/layout/PageHeader';
import PageLoader from '../components/layout/PageLoader';
import EmptyState from '../components/layout/EmptyState';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';

function generatePromotion(product: Product) {
  return {
    instagram: `🌟 Introducing our ${product.title}! ✨\n\n${product.description}\n\n💰 Only ₹${product.price}\n\n${product.hashtags.join(' ')}\n\n🛒 Order now and support rural women artisans!\n\n#MadeByWomen #Handcrafted #SupportLocal`,
    whatsapp: `Hi! 👋\n\nCheck out this beautiful ${product.title}!\n\n${product.description}\n\nPrice: ₹${product.price}\n\nHandmade with love by rural women artisans 💚\n\nInterested? Reply to order!`,
  };
}

async function copyText(text: string, successMsg: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMsg);
  } catch {
    toast.error('Copy failed');
  }
}

export default function Storefront() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { products, deleteProduct, loading } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [promoProduct, setPromoProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const handleDelete = async (product: Product) => {
    if (!confirm(t('storefront.deleteConfirm'))) return;
    await deleteProduct(product.id);
    toast.success(t('storefront.deleted'));
  };

  const downloadQr = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg || !selectedProduct) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `${selectedProduct.title}-qr.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={t('storefront.title')}
        subtitle={t('storefront.subtitle', { count: products.length })}
        icon={<Sparkles className="w-8 h-8 text-[#ef4d23]" />}
      />

      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('common.search')}
              className="pl-9 bg-white border-neutral-200"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-neutral-200">
              <SelectValue placeholder={t('common.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === 'all' ? t('common.allCategories') : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {products.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-16 h-16" />}
          title={t('storefront.emptyTitle')}
          description={t('storefront.emptyDesc')}
          actionLabel={t('storefront.uploadBtn')}
          onAction={() => navigate('/seller/upload')}
        />
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t('common.search')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="scm-card overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => setDetailProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!product.synced && (
                    <Badge className="absolute top-3 right-3 bg-amber-500">
                      {t('storefront.pendingSync')}
                    </Badge>
                  )}
                  <Badge className="absolute top-3 left-3 bg-[#ef4d23] gap-1 border-0">
                    <Award className="w-3 h-3" />
                    {t('storefront.verified')}
                  </Badge>
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  <Badge variant="outline" className="w-fit mb-2 text-brand-accent border-brand-accent/30">
                    {product.category}
                  </Badge>
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('storefront.price')}</p>
                      <p className="text-xl font-bold text-[#ef4d23]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {t('storefront.madeBy')}
                      <br />
                      <span className="font-medium text-foreground">{product.artisan}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Award className="w-4 h-4" />
                      {t('storefront.viewQr')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-violet-200 text-violet-700 hover:bg-violet-50"
                      onClick={() => setPromoProduct(product)}
                    >
                      <Share2 className="w-4 h-4" />
                      {t('storefront.promotion')}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 scm-cta-gradient rounded-full"
                        onClick={() => navigate('/buyer')}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('storefront.buyNow')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <DialogContent className="max-w-lg bg-white border-neutral-200">
          {detailProduct && (
            <>
              <img src={detailProduct.image} alt="" className="w-full h-48 object-cover rounded-lg -mt-2" />
              <DialogHeader>
                <DialogTitle>{detailProduct.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{detailProduct.description}</p>
              <p className="text-2xl font-bold text-[#ef4d23]">
                ₹{detailProduct.price.toLocaleString('en-IN')}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md bg-white border-neutral-200">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#ef4d23]" />
                  {t('storefront.authenticity')}
                </DialogTitle>
              </DialogHeader>
              <div className="scm-tray p-6 flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={JSON.stringify({
                      productId: selectedProduct.id,
                      title: selectedProduct.title,
                      artisan: selectedProduct.artisan,
                      verified: true,
                      timestamp: selectedProduct.timestamp,
                    })}
                    size={180}
                    level="H"
                    includeMargin
                  />
                </div>
                <div className="w-full mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('storefront.product')}</span>
                    <span className="font-medium">{selectedProduct.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('storefront.artisan')}</span>
                    <span className="font-medium">{selectedProduct.artisan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('storefront.status')}</span>
                    <span className="text-[#ef4d23] font-medium flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {t('storefront.verifiedAuthentic')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={downloadQr}>
                  <Download className="w-4 h-4" />
                  QR
                </Button>
                <Button className="flex-1" onClick={() => setSelectedProduct(null)}>
                  {t('common.close')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!promoProduct} onOpenChange={() => setPromoProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white border-neutral-200">
          {promoProduct && (() => {
            const promo = generatePromotion(promoProduct);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Share2 className="w-6 h-6 text-purple-400" />
                    {t('storefront.promoTitle')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="scm-subcard p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900">
                        <Instagram className="w-5 h-5 text-violet-600" />
                        {t('storefront.instagramPost')}
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
                        {promo.instagram}
                      </pre>
                      <Button
                        className="w-full mt-3 rounded-full bg-violet-600 hover:bg-violet-700"
                        onClick={() => copyText(promo.instagram, t('common.copied'))}
                      >
                        {t('storefront.copyInstagram')}
                      </Button>
                    </CardContent>
                  </div>
                  <div className="scm-subcard p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900">
                        <Share2 className="w-5 h-5 text-[#ef4d23]" />
                        {t('storefront.whatsappMsg')}
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
                        {promo.whatsapp}
                      </pre>
                      <Button
                        className="w-full mt-3 scm-cta-gradient rounded-full"
                        onClick={() => copyText(promo.whatsapp, t('common.copied'))}
                      >
                        {t('storefront.copyWhatsapp')}
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
