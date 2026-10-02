import React, { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-ink uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={`w-full appearance-none rounded-xl border bg-surface px-4 py-2.5 pr-10 text-sm text-ink transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:bg-surface-subtle disabled:cursor-not-allowed ${
              error
                ? 'border-status-danger text-status-danger'
                : 'border-surface-border hover:border-slate-300'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-ink-subtle absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs font-medium text-status-danger" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-ink-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
