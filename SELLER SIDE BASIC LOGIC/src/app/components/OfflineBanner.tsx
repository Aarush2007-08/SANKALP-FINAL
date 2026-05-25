import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const { isOnline, pendingSync } = useApp();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="bg-amber-600 text-white px-4 py-2.5 flex items-center justify-center gap-2 shadow-lg text-sm"
        >
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">{t('common.offlineMode')}</span>
          {pendingSync > 0 && (
            <span className="ml-2 bg-white/20 px-3 py-0.5 rounded-full text-xs">
              {t('common.pendingSync', { count: pendingSync })}
            </span>
          )}
        </motion.div>
      )}
      {isOnline && pendingSync > 0 && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="bg-brand-primary text-white px-4 py-2.5 flex items-center justify-center gap-2 shadow-lg text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">{t('common.syncedSuccess')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
