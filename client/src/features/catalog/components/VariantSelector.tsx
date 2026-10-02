import React from 'react';

interface VariantSelectorProps {
  colors?: string[];
  sizes?: string[];
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}) => {
  if (colors.length === 0 && sizes.length === 0) return null;

  return (
    <div className="space-y-4 py-3 border-y border-edge-subtle/60">
      {/* Color options */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-ink-primary">Color</span>
            <span className="text-ink-muted">{selectedColor || colors[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onColorChange && onColorChange(color)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-edge-subtle bg-surface text-ink-secondary hover:border-edge-strong'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size options */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-ink-primary">Size / Spec</span>
            <span className="text-ink-muted">{selectedSize || sizes[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange && onSizeChange(size)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-edge-subtle bg-surface text-ink-secondary hover:border-edge-strong'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
