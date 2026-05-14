'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  hero: Page['hero'];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, className }) => {
  const { site } = useWebBuilder();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const themeColors = useThemeColors();

  const mediaItems = useMemo(() => {
    if (!hero) return [];
    const items = Array.isArray((hero as any).mediaItems) ? (hero as any).mediaItems : [];
    if (items.length > 0) return items;
    return hero.media ? [hero.media] : [];
  }, [hero]);

  useEffect(() => {
    if (!hero?.enabled) return;

    const ctx = gsap.context(() => {
      // 1. Initial Reveals
      gsap.fromTo(badgeRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      const lines = titleContainerRef.current?.querySelectorAll('p, span, h1');
      if (lines && lines.length > 0) {
        gsap.fromTo(lines,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'power3.out', delay: 0.7 }
        );
      }

      gsap.fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.1 }
      );

      gsap.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.4 }
      );

      // 2. Images reveal (Staggered)
      const images = mediaContainerRef.current?.querySelectorAll('.hero-media-item');
      if (images) {
        gsap.fromTo(images,
          { opacity: 0, y: 100, scale: 1.1 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 1.8, ease: 'power2.out', delay: 0.4 }
        );
      }

      // 3. Scroll parallax for images
      if (images) {
        images.forEach((img, i) => {
          gsap.to(img, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            },
            yPercent: (i + 1) * 10,
            ease: 'none'
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [hero]);

  if (!hero?.enabled) return null;

  const brandName = (site?.business?.name || site?.name || '').toUpperCase();
  const primaryCtaHref = hero.primaryCta?.href?.trim();
  const primaryCtaLabel = hero.primaryCta?.label?.trim();

  return (
    <section 
      ref={sectionRef}
      className={cn('relative w-full min-h-screen bg-white flex flex-col md:flex-row overflow-hidden pb-12', className)}
    >
      {/* Left Content Area */}
      <div className="w-full md:w-[50%] flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 pt-32 md:pt-0 z-20">
        <div className="max-w-lg">
          {/* Branded Badge with Theme Color */}
          <div 
            ref={badgeRef}
            className="inline-block text-white text-[10px] font-bold tracking-[0.4em] px-3 py-1 uppercase mb-10"
            style={{ 
              backgroundColor: themeColors.primaryButton 
            }}
          >
             {brandName}
          </div>

          {/* Heading */}
          {hero.title && (
            <div 
              ref={titleContainerRef} 
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans tracking-tight text-[var(--wb-text-main)] font-light uppercase leading-[1.1] tiptap-hero-title">
                <TiptapRenderer content={hero.title} as="inline" />
              </h1>
            </div>
          )}

          {/* Subtitle / Description */}
          {(hero.description || hero.subtitle) && (
            <div 
              ref={subtitleRef} 
              className="mb-12"
            >
              <div className="text-[var(--wb-text-secondary)] text-sm md:text-base font-light tracking-wide max-w-sm leading-relaxed">
                <TiptapRenderer content={hero.description || hero.subtitle} as="inline" />
              </div>
            </div>
          )}

          {/* Circular Architectural CTA */}
          {primaryCtaHref && primaryCtaLabel && (
            <div ref={ctaRef} className="pt-4">
              <a
                href={primaryCtaHref}
                className="group inline-flex items-center gap-6"
              >
                <span 
                  className="text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-300"
                  style={{ color: themeColors.primaryButton }}
                >
                  {primaryCtaLabel}
                </span>
                <div 
                  className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:bg-current group-hover:scale-110"
                  style={{ 
                    borderColor: themeColors.primaryButton,
                    color: themeColors.primaryButton 
                  }}
                >
                   <svg className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                   </svg>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right Media Grid Area */}
      <div 
        ref={mediaContainerRef}
        className="w-full md:w-[50%] flex flex-col md:grid md:grid-cols-2 gap-4 p-8 md:p-12 self-center"
      >
        {mediaItems.slice(0, 3).map((item: any, idx: number) => (
          <div 
            key={idx}
            className={cn(
              "hero-media-item relative overflow-hidden bg-gray-100",
              idx === 0 ? "col-span-2 aspect-[4/3] md:aspect-video mb-4" : "col-span-1 aspect-square md:aspect-[4/5]",
              idx === 2 ? "md:-mt-20" : ""
            )}
          >
             {item?.type === 'video' ? (
                <video 
                  className="h-full w-full object-cover" 
                  src={getImageSrc(item.url)} 
                  autoPlay muted loop playsInline 
                />
              ) : (
                <OptimizedImage
                  src={getImageSrc(item.url)}
                  alt={item.altText || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="xl:min-h-[500px] h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/[0.03] pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Subtle Bottom Scroll Info */}
      <div className="absolute bottom-10 left-8 md:left-16 flex items-center gap-3 opacity-20 hidden md:flex">
         <div className="w-8 h-[1px] bg-black" />
         <span className="text-[8px] uppercase tracking-[0.5em] font-medium text-black">Architectural Excellence</span>
      </div>

      <style jsx global>{`
        .tiptap-hero-title p, .tiptap-hero-title span {
          display: block;
        }
      `}</style>
    </section>
  );
};
