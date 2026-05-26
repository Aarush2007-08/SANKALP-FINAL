import { useTranslation } from 'react-i18next';

export default function PageLoader() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-[#ef4d23]/20 border-t-[#ef4d23] animate-spin" />
      <p className="text-sm text-neutral-500">{t('common.loading')}</p>
    </div>
  );
}
