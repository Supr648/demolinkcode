import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-surface-raised border border-edge-subtle/60 shadow-card ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-ink-primary mb-1">{title}</h3>
      <p className="text-sm text-ink-subtle max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
