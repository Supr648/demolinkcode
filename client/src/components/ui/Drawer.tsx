import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-xs sm:max-w-sm',
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
  };

  const positionClasses =
    position === 'right'
      ? 'right-0 slide-in-from-right'
      : 'left-0 slide-in-from-left';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={drawerRef}
        className={`fixed inset-y-0 ${positionClasses} ${sizes[size]} bg-surface shadow-2xl flex flex-col z-10 animate-in duration-300 border-l border-surface-border`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-surface-border">
          <h2 className="text-base font-bold text-ink tracking-tight">
            {title || 'Drawer'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-subtle hover:text-ink hover:bg-surface-subtle transition"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
