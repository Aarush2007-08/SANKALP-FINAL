import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'orange' | 'blue' | 'purple' | 'neutral';
}

const accentMap = {
  orange: 'from-[#ef4d23] to-[#ff6b47]',
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-violet-500 to-fuchsia-500',
  neutral: 'from-neutral-700 to-neutral-900',
};

export default function StatCard({ label, value, icon: Icon, accent = 'orange' }: StatCardProps) {
  return (
    <div className="scm-card p-4">
      <div className={cn('inline-flex p-2.5 rounded-xl bg-gradient-to-br mb-3', accentMap[accent])}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
