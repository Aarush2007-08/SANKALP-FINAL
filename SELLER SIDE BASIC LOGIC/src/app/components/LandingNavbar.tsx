import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, ShoppingCart, Menu, X } from 'lucide-react';
import FlowerLogo from './FlowerLogo';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (pagesRef.current && !pagesRef.current.contains(e.target as Node)) setPagesOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="flex justify-center pt-4 sm:pt-6 px-3 sm:px-4">
      <div className="bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2 w-full max-w-[760px] relative">
        <div className="flex items-center gap-2">
          <FlowerLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
          <nav className="hidden md:flex items-center gap-6 flex-1 ml-2">
            <a href="#" className="text-[14px] text-neutral-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              Home
            </a>
            <a href="#dashboard" className="text-[14px] text-neutral-800">
              Features
            </a>
            <a href="#about" className="text-[14px] text-neutral-800">
              About
            </a>
            <div className="relative" ref={pagesRef}>
              <button
                type="button"
                onClick={() => setPagesOpen(!pagesOpen)}
                className="text-[14px] text-[#ef4d23] flex items-center gap-1"
              >
                Pages
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {pagesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border py-2 min-w-[180px] z-30">
                  <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-50" onClick={() => navigate('/seller')}>
                    {t('platform.sellerTitle')}
                  </button>
                  <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-50" onClick={() => navigate('/buyer')}>
                    {t('platform.buyerTitle')}
                  </button>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" onClick={() => navigate('/buyer/cart')} className="hidden md:block p-2">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller')}
              className="hidden sm:flex items-center gap-2 bg-[#ef4d23] text-white rounded-full pl-4 pr-1.5 py-1.5 text-[14px]"
            >
              <span className="hidden md:inline">Get early access</span>
              <span className="md:hidden">Early access</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            <button type="button" className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border p-3 z-20 md:hidden">
            <a href="#dashboard" className="block py-2 text-sm" onClick={() => setOpen(false)}>Features</a>
            <button type="button" className="block w-full text-left py-2 text-sm" onClick={() => navigate('/seller')}>{t('platform.sellerTitle')}</button>
            <button type="button" className="block w-full text-left py-2 text-sm" onClick={() => navigate('/buyer')}>{t('platform.buyerTitle')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
