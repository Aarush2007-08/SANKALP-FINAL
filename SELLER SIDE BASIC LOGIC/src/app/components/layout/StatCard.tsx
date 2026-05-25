import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
}

export default function StatCard({ label, value, icon: Icon, accent = 'from-brand-primary to-emerald-500' }: StatCardProps) {
  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur">
      <CardContent className="p-4">
        <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${accent} mb-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
