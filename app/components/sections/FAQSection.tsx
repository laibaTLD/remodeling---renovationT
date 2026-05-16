'use client';

import React, { useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, TIPTAP_INHERIT } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts, useSectionContrast } from '@/app/hooks/useTheme';
import { ArrowDownRight } from 'lucide-react';

interface FAQSectionProps {
  faqSection: Page['faqSection'];
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqSection, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const contrast = useSectionContrast('light');
  const items = faqSection?.items?.filter((item) => item?.question || item?.answer) ?? [];

  if (!faqSection?.enabled) return null;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const brandColor = themeColors.primaryButton;

  return (
    <section
      className={cn(contrast.surface, 'relative overflow-hidden py-4', className)}
      style={{ fontFamily: themeFonts.body }}
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Left Column: Minimal Header with Static Badge tracking */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: brandColor }}
                />
                <span className={cn(contrast.textSecondary, 'text-[10px] font-bold uppercase tracking-[0.35em]')}>
                  Information Hub
                </span>
              </div>

              {faqSection.title && (
                <h2
                  className={cn(contrast.textPrimary, 'text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight leading-[1.1]')}
                  style={{ fontFamily: themeFonts.heading }}
                >
                  <TiptapRenderer content={faqSection.title} as="inline" />
                </h2>
              )}
            </div>

            {faqSection.description && (
              <div className={cn(contrast.textSecondary, 'max-w-xs text-xs md:text-sm leading-relaxed font-light opacity-80')}>
                <TiptapRenderer
                  content={faqSection.description}
                  className={TIPTAP_INHERIT}
                />
              </div>
            )}
          </div>

          {/* Right Column: Floating Clean Matrix System */}
          {items.length > 0 && (
            <div className="lg:col-span-8 space-y-4">
              {items.map((item, index) => {
                const isOpen = openIndex === index;
                
                return (
                  <div
                    key={index}
                    onClick={() => toggle(index)}
                    className={cn(
                      'group rounded-xl transition-all duration-500 ease-out cursor-pointer p-6 md:p-8 border',
                      isOpen 
                        ? contrast.border
                        : 'border-transparent'
                    )}
                    style={{
                      backgroundColor: isOpen 
                        ? `${themeColors.cardBackground}` 
                        : `color-mix(in srgb, ${themeColors.cardBackground} 40%, transparent)`,
                    }}
                  >
                    {/* Accordion Row Header */}
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Numerical Index Metric */}
                        <span
                          className="text-[10px] font-mono tracking-wider pt-1 font-bold transition-colors duration-300"
                          style={{ color: isOpen ? brandColor : themeColors.secondaryText }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <h3
                          className={cn(
                            contrast.textPrimary, 
                            'text-base md:text-lg lg:text-xl font-normal tracking-wide transition-all duration-300'
                          )}
                          style={{ fontFamily: themeFonts.heading }}
                        >
                          <TiptapRenderer content={item.question} as="inline" />
                        </h3>
                      </div>

                      {/* Cool Minimal Rotational Icon Indicator */}
                      <div 
                        className="p-1 rounded-full shrink-0 transition-transform duration-500 ease-out"
                        style={{ 
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                          color: isOpen ? brandColor : themeColors.secondaryText
                        }}
                      >
                        <ArrowDownRight strokeWidth={1.5} size={20} />
                      </div>
                    </div>

                    {/* Smooth Micro-Collapsible Wrapper */}
                    <div
                      className={cn(
                        'grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                        isOpen ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div 
                          className={cn(contrast.textSecondary, 'text-xs md:text-sm leading-relaxed font-light tracking-wide max-w-2xl pl-8 border-l')}
                          style={{ borderColor: `${brandColor}20` }}
                        >
                          <TiptapRenderer
                            content={item.answer}
                            className={TIPTAP_INHERIT}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;