'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface ServiceOverviewProps {
  overview: any;
  className?: string;
}

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({ overview, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!overview || (!overview.title && !overview.description)) return null;

  const resolvedImageSrc = getImageSrc(
    typeof overview.image === 'object' && overview.image !== null
      ? overview.image.url
      : overview.image
  );

  return (
    <section 
      className={cn('relative min-h-[90vh] flex items-center overflow-hidden bg-black', className)}
      style={{ fontFamily: themeFonts.body }}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {resolvedImageSrc ? (
          <OptimizedImage
            src={resolvedImageSrc}
            alt={overview.imageAlt || 'Architecture Overview'}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Editorial Header */}
          {overview.title && (
            <div className="mb-20 lg:mb-32">
               <h2 
                className="text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-[0.05em] leading-[1.1] text-white max-w-4xl"
                style={{ fontFamily: themeFonts.heading }}
              >
                <TiptapRenderer content={overview.title} as="inline" />
              </h2>
            </div>
          )}

          {/* Grid Layout for Descriptions (Matching Image 3/5) */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Technical/Primary Description */}
            <div className="lg:col-span-4 border-t border-white/20 pt-8">
              <div className="space-y-6">
                <div 
                  className="text-[13px] md:text-[14px] font-light leading-relaxed tracking-wide text-white/80"
                  style={{ color: themeColors.pageBackground }} // Using light color for text on dark
                >
                  <TiptapRenderer content={overview.description || overview.subtitle} />
                </div>
              </div>
            </div>

            {/* Middle Column: Secondary Detail */}
            {overview.secondaryDescription && (
              <div className="lg:col-span-4 lg:border-t border-white/20 pt-8">
                <div 
                  className="text-[13px] md:text-[14px] font-light leading-relaxed tracking-wide text-white/80"
                >
                  <TiptapRenderer content={overview.secondaryDescription} />
                </div>
              </div>
            )}

            {/* Right Gutter: Vertical Labeling (Matching Request Info side-bar) */}
            {overview.verticalLabel && (
              <div className="hidden lg:block lg:col-span-1 lg:col-start-12">
                 <div className="fixed right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right whitespace-nowrap z-50">
                  <span className="text-[10px] tracking-[0.6em] uppercase font-bold text-white/40 hover:text-[var(--wb-primary)] transition-colors cursor-pointer">
                    <TiptapRenderer content={overview.verticalLabel} as="inline" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Brand Elements */}
      {overview.label && (
        <div className="absolute top-12 left-12">
          <div className="text-[10px] tracking-[0.5em] uppercase font-black text-white/30">
            <TiptapRenderer content={overview.label} as="inline" />
          </div>
        </div>
      )}

      {/* Bottom Scroll Indicator / Detail */}
      {overview.bottomLabel && (
        <div className="absolute bottom-12 left-12 flex items-center gap-6">
          <div className="w-12 h-px bg-[var(--wb-primary)]" />
          <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white/60">
            <TiptapRenderer content={overview.bottomLabel} as="inline" />
          </span>
        </div>
      )}
    </section>
  );
};