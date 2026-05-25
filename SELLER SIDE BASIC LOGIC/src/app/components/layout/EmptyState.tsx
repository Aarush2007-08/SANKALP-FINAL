import { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="border-border/60 shadow-xl">
      <CardContent className="p-12 text-center">
        <div className="text-muted-foreground/40 mb-4 flex justify-center">{icon}</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-gradient-to-r from-brand-primary to-emerald-500">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
