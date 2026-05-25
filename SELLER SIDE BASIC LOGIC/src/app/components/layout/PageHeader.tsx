import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
