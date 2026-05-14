'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface AboutProps {
  about: any;
  className?: string;
}

export const About: React.FC<AboutProps> = ({ about, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!about || (!about.title && !about.description && !about.image)) return null;

  const imageUrl = about.image 
    ? getImageSrc(typeof about.image === 'object' ? about.image.url : about.image)
    : null;

  return (
    <section 
      className={cn('relative min-h-[80vh] flex items-center overflow-hidden', className)}
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      {/* Background Image - Cinematic Full-Width Style */}
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <OptimizedImage
            src={imageUrl}
            alt={about.imageAlt || 'Property Background'}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200" />
        )}
      </div>

      {/* The Signature Content Block */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12">
          <div 
            className="lg:col-span-5 p-10 lg:p-20 flex flex-col justify-center min-h-[500px]"
            style={{ 
              backgroundColor: themeColors.primaryButton,
              color: '#FFFFFF' 
            }}
          >
            <div className="space-y-8">
              {/* Top Label/Location */}
              {(about.label || about.location) && (
                <div className="space-y-2">
                  {about.label && (
                    <h3 className="text-[11px] tracking-[0.2em] uppercase font-bold leading-tight">
                      <TiptapRenderer content={about.label} as="inline" />
                    </h3>
                  )}
                  {about.location && (
                    <p className="text-[11px] tracking-[0.2em] uppercase opacity-80">
                      <TiptapRenderer content={about.location} as="inline" />
                    </p>
                  )}
                </div>
              )}

              {/* Decorative Divider */}
              {(about.label || about.location) && (
                <div className="w-full h-px bg-white/30" />
              )}

              {/* Main Headline */}
              {about.title && (
                <h2 
                  className="text-3xl lg:text-5xl font-light leading-[1.2] uppercase tracking-wide"
                  style={{ fontFamily: themeFonts.heading }}
                >
                  <TiptapRenderer content={about.title} />
                </h2>
              )}

              {/* Description/Body */}
              {about.description && (
                <div 
                  className="text-sm lg:text-base leading-relaxed opacity-90 font-light"
                  style={{ fontFamily: themeFonts.body }}
                >
                  <TiptapRenderer content={about.description} />
                </div>
              )}

              {/* Action Button */}
              {about.ctaButton && (
                <div className="pt-6">
                  <a 
                    href={about.ctaButton.href || about.ctaButton.url || '#'}
                    className="inline-block text-[10px] tracking-[0.4em] uppercase font-bold border-b border-white/40 pb-2 transition-all hover:border-white"
                  >
                    <TiptapRenderer content={about.ctaButton.text} as="inline" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Edge Label */}
      {about.verticalLabel && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center rotate-90 origin-right pointer-events-none">
          <span className="text-[9px] tracking-[0.5em] uppercase font-bold text-white whitespace-nowrap opacity-60">
            <TiptapRenderer content={about.verticalLabel} as="inline" />
          </span>
        </div>
      )}
    </section>
  );
};