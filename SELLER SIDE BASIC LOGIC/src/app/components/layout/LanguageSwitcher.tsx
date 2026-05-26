import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
      <SelectTrigger className="w-[118px] h-8 rounded-full border-neutral-200 bg-white text-xs shadow-none">
        <Globe className="w-3.5 h-3.5 text-[#ef4d23] shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('language.en')}</SelectItem>
        <SelectItem value="hi">{t('language.hi')}</SelectItem>
        <SelectItem value="kn">{t('language.kn')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
