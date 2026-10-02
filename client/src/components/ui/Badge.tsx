import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full select-none';

  const variants = {
    default: 'bg-surface-subtle text-ink-muted border border-surface-border',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200',
    success: 'bg-status-success-bg text-status-success border border-emerald-200',
    warning: 'bg-status-warning-bg text-status-warning border border-amber-200',
    danger: 'bg-status-danger-bg text-status-danger border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};
