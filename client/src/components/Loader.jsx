import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    small: 'w-4 h-4',
    md: 'w-8 h-8',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-indigo-600`} />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="w-20 h-4 bg-slate-200 rounded-full" />
        <div className="w-3/4 h-5 bg-slate-200 rounded" />
        <div className="w-1/2 h-4 bg-slate-200 rounded" />
        <div className="pt-2 flex justify-between items-center">
          <div className="w-16 h-6 bg-slate-200 rounded" />
          <div className="w-24 h-9 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default function Loader(props) {
  return <Spinner {...props} />;
}
