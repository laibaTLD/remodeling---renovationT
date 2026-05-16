'use client';

import React, { useEffect, useRef } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, TIPTAP_INHERIT } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts, useSectionContrast } from '@/app/hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WhyChooseUsSectionProps {
  whyChooseUsSection: Page['whyChooseUsSection'];
  className?: string;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ whyChooseUsSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const contrast = useSectionContrast('light');
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!whyChooseUsSection?.enabled) return;

    const ctx = gsap.context(() => {
      // 1. Headline Reveal
      gsap.fromTo(headlineRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
          }
        }
      );

      // 2. Items Staggered Reveal
      const elements = itemsRef.current?.children;
      if (elements) {
        gsap.fromTo(elements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: itemsRef.current,
              start: 'top 85%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [whyChooseUsSection]);

  if (!whyChooseUsSection?.enabled) return null;

  const brandColor = themeColors.primaryButton;

  const items = whyChooseUsSection.items || [];

  return (
    <section
      ref={sectionRef}
      className={cn('wb-surface-light wb-hairline-t-light relative overflow-hidden py-20 lg:py-32', className)}
    >
      <div className="relative z-[1] mx-auto max-w-[1800px] px-8 md:px-16 lg:px-24">

        {/* Editorial Header - Large Scale Centered */}
        <div ref={headlineRef} className="flex flex-col items-center text-center  mb-14 lg:mb-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px]" style={{ backgroundColor: brandColor }} />
            <span className={cn(contrast.textSecondary, 'text-[10px] font-bold tracking-[0.4em] uppercase')}>
              Philosophy
            </span>
            <div className="w-12 h-[1px]" style={{ backgroundColor: brandColor }} />
          </div>

          {whyChooseUsSection.title && (
            <h2 className={cn(contrast.textPrimary, 'max-w-5xl font-sans text-4xl font-light uppercase leading-none tracking-tight md:text-5xl lg:text-6xl')} style={{ fontFamily: themeFonts.heading }}>
              <div className="[&_p:first-child]:text-primary [&_span:first-of-type]:text-primary">
                <style jsx>{`
                     h2 :global(p:first-child), h2 :global(span:first-child) {
                        color: ${brandColor} !important;
                     }
                     h2 :global(strong), h2 :global(b) {
                        color: ${brandColor} !important;
                        font-weight: 300;
                     }
                   `}</style>
                <TiptapRenderer content={whyChooseUsSection.title} as="inline" className={TIPTAP_INHERIT} />
              </div>
            </h2>
          )}

          {whyChooseUsSection.description && (
            <div
              className={cn(contrast.textSecondary, 'max-w-xl text-base font-light leading-relaxed tracking-wide opacity-90 md:text-lg')}
            >
              <TiptapRenderer content={whyChooseUsSection.description} className={TIPTAP_INHERIT} />
            </div>
          )}
        </div>

        {/* Values Grid - High Fidelity Digital Look */}
        <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-24">
          {items.map((item, idx) => (
            <div key={idx} className={cn('group relative flex flex-col space-y-8 border-t pt-12', contrast.border)}>

              {/* Numbering Header */}
              <div className="flex justify-between items-start">
                <div
                  className="text-4xl lg:text-5xl font-extralight tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ color: themeColors.mainText }}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <div
                  className="w-1 h-0 bg-primary transition-all duration-700 group-hover:h-12"
                  style={{ backgroundColor: brandColor }}
                />
              </div>

              <div className="space-y-6">
                {item.title && (
                  <h3
                    className={cn(contrast.textPrimary, 'font-sans text-xl font-light uppercase leading-tight tracking-tight md:text-2xl')}
                    style={{ fontFamily: themeFonts.heading }}
                  >
                    <TiptapRenderer content={item.title} as="inline" className={TIPTAP_INHERIT} />
                  </h3>
                )}

                <div className="w-12 h-[1px]" style={{ backgroundColor: brandColor }} />

                {item.description && (
                  <div
                    className={cn(contrast.textSecondary, 'text-sm font-light uppercase leading-relaxed tracking-wide opacity-90 md:text-base')}
                  >
                    <TiptapRenderer content={item.description} className={TIPTAP_INHERIT} />
                  </div>
                )}
              </div>

              {/* Subtle Hover Reveal Border */}
              <div
                className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-1000 group-hover:w-full"
                style={{ backgroundColor: brandColor }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;