import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...', size = 'default', className = '' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`animate-spin text-indigo-600 ${sizeClasses[size] || sizeClasses.default}`} />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
}
