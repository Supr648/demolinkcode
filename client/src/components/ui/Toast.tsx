import React from 'react';
import { create } from 'zustand';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'success', description, duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, description, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast, removeToast } = useToastStore();
  return {
    toast: (msg: string, type: 'success' | 'error' | 'info' = 'success', desc?: string) =>
      addToast(msg, type, desc),
    success: (msg: string, desc?: string) => addToast(msg, 'success', desc),
    error: (msg: string, desc?: string) => addToast(msg, 'error', desc),
    info: (msg: string, desc?: string) => addToast(msg, 'info', desc),
    dismiss: removeToast,
  };
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
              : toast.type === 'error'
              ? 'bg-rose-50/95 border-rose-200 text-rose-950'
              : 'bg-brand-50/95 border-brand-200 text-brand-950'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-status-success" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-status-danger" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-brand-500" />}
          </div>

          <div className="flex-1 space-y-0.5">
            <p className="text-xs font-bold leading-snug">{toast.message}</p>
            {toast.description && (
              <p className="text-[11px] opacity-80 leading-tight">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-ink-subtle hover:text-ink transition p-1 rounded-lg"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
