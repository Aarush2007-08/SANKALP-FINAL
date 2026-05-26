import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, CloudUpload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const { isOnline, pendingSync } = useApp();

  if (isOnline && pendingSync === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mx-3 sm:mx-4 mt-2"
      >
        <div
          className={
            isOnline
              ? 'scm-alert-sync flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium'
              : 'scm-alert-warn flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium'
          }
        >
          {isOnline ? (
            <>
              <CloudUpload className="w-4 h-4" />
              {t('common.pendingSync', { count: pendingSync })}
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              {t('common.offlineMode')}
              {pendingSync > 0 && (
                <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs">
                  {pendingSync}
                </span>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
