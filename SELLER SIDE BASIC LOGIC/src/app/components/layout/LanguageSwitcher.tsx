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
      <SelectTrigger className="w-[130px] h-9 bg-card/80 border-border text-sm">
        <Globe className="w-4 h-4 mr-1 text-brand-accent shrink-0" />
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
