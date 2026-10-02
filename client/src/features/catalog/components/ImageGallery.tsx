import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const safeImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-none">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIdx === i
                  ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20 scale-95'
                  : 'border-edge-subtle/80 opacity-70 hover:opacity-100 hover:border-edge-strong'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Preview with Hover Zoom */}
      <div
        className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-edge-subtle cursor-crosshair group shadow-card"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={safeImages[selectedIdx]}
          alt={productName}
          className={`w-full h-full object-cover object-center transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />
        <div className="absolute bottom-3 right-3 bg-surface-raised/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-ink-secondary border border-edge-subtle pointer-events-none shadow-sm">
          Hover to zoom
        </div>
      </div>
    </div>
  );
};
