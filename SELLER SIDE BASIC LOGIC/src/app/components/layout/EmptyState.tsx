import { ReactNode } from 'react';
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
    <div className="scm-card p-12 text-center">
      <div className="text-[#ef4d23]/30 mb-4 flex justify-center">{icon}</div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h2>
      <p className="text-neutral-600 mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="scm-cta-gradient rounded-full px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
