'use client';

import React, { useMemo } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface CTA2SectionProps {
  cta2Section: Page['cta2Section'];
  className?: string;
}

export const CTA2Section: React.FC<CTA2SectionProps> = ({ cta2Section, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const safeCta: NonNullable<Page['cta2Section']> = (cta2Section ?? { enabled: false }) as NonNullable<Page['cta2Section']>;

  const backgroundImageUrl = useMemo(() => {
    return safeCta.backgroundImage ? getImageSrc(safeCta.backgroundImage) : '';
  }, [safeCta.backgroundImage]);

  if (!safeCta?.enabled) return null;

  return (
    <section
      className={cn('relative overflow-hidden', className)}
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: themeColors.primaryButton }
      }
    >
      <div
        className="absolute inset-0"
        style={{
          background: backgroundImageUrl
            ? 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 52%, rgba(0,0,0,0.15) 100%)'
            : 'none',
        }}
      />

      <div className="relative container mx-auto px-4">
        <div className="py-16 lg:py-24">
          <div className="max-w-4xl">
            {safeCta.title && (
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight"
                style={{ color: '#FFFFFF' }}
              >
                <TiptapRenderer content={safeCta.title} />
              </div>
            )}

            {safeCta.description && (
              <div
                className="mt-6 text-base sm:text-lg lg:text-xl max-w-2xl"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              >
                <TiptapRenderer content={safeCta.description} />
              </div>
            )}

            {safeCta.primaryButton && (
              <div className="mt-8">
                <a
                  href={safeCta.primaryButton.href}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-colors"
                  style={{
                    backgroundColor: themeColors.pageBackground,
                    color: themeColors.lightPrimaryText,
                  }}
                >
                  {safeCta.primaryButton.label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA2Section;
