'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';

export const Highlights: React.FC<{ highlights: any; className?: string }> = ({ highlights, className }) => {
  const themeColors = useThemeColors();
  const items = (highlights.items || highlights.highlights || []).slice(0, 4);

  if (!items.length) return null;

  return (
    <section className={cn('py-32', className)} style={{ backgroundColor: themeColors.pageBackground }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4">
            {highlights.description ? (
              <span className="text-[9px] tracking-[0.6em] uppercase font-bold opacity-40 mb-8 block">
                <TiptapRenderer content={highlights.description} as="inline" />
              </span>
            ) : null}
            <h2 className="text-4xl uppercase font-extralight tracking-tighter leading-none">
              <TiptapRenderer content={highlights.title} />
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5">
              {items.map((item: any, i: number) => (
                <div key={i} className="p-12 space-y-4 transition-colors" style={{ backgroundColor: themeColors.cardBackground }}>
                  <div className="text-5xl font-extralight tracking-tighter" style={{ color: themeColors.primaryButton }}>
                    {item.price || item.counter || '—'}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: themeColors.mainText }}>
                      <TiptapRenderer content={item.title} as="inline" />
                    </h4>
                    <div className="text-xs opacity-50 uppercase tracking-widest leading-relaxed">
                      <TiptapRenderer content={item.description} as="inline" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};