import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-surface-muted rounded-xl ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-4 space-y-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="space-y-2 pt-1">
        <Skeleton className="w-20 h-4 rounded-md" />
        <Skeleton className="w-full h-5 rounded-md" />
        <Skeleton className="w-3/4 h-4 rounded-md" />
        <div className="pt-2 flex items-center justify-between">
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="w-20 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
