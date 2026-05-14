'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const CTA: React.FC<{ cta: any; className?: string }> = ({ cta, className }) => {
  const safeCta = cta ?? { enabled: false };
  const sectionRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgImageContainerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const themeColors = useThemeColors();

  useEffect(() => {
    if (!safeCta?.enabled) return;

    const ctx = gsap.context(() => {
      // 1. Staggered Text Reveal
      const elements = contentRef.current?.children;
      if (elements) {
        gsap.fromTo(elements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      // 2. Parallax Effect between Text Section and Image
      if (bgImageRef.current) {
        gsap.fromTo(bgImageRef.current,
          { yPercent: -20 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }

      // Slow upward move for the text section itself
      if (textSectionRef.current) {
        gsap.fromTo(textSectionRef.current,
          { y: 0 },
          {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [safeCta]);

  if (!safeCta?.enabled) return null;

  const brandColor = themeColors.primaryButton;
  const primaryTextColor = themeColors.lightPrimaryText;
  const secondaryTextColor = themeColors.lightSecondaryText;

  const bgImg = safeCta.backgroundImage || safeCta.image || (safeCta.mediaItems?.[0]?.url);
  const backgroundImageUrl = bgImg ? getImageSrc(bgImg) : null;

  return (
    <section
      ref={sectionRef}
      className={cn('relative flex flex-col items-center bg-white', className)}
    >
      {/* 1. White Statement Block - Centered Editorial Design */}
      <div
        ref={textSectionRef}
        className="relative z-20 w-fit p-10 flex flex-col items-center text-center px-6 bg-white"
      >
        <div ref={contentRef} className="max-w-4xl flex flex-col items-center">

          {/* Header Title - Huge, Centered, Multiple Lines */}
          {safeCta.title && (
            <h2
              className="text-4xl md:text-5xl lg:text-7xl font-sans tracking-tight leading-[1.1] uppercase font-light mb-12"
              style={{ color: primaryTextColor }}
            >
              <div className="text-balance [&_strong]:text-primary [&_span.brand]:text-primary">
                {/* Styling logic: any bold text will be brand color */}
                <style jsx>{`
                    h2 :global(strong), h2 :global(b) {
                        color: ${brandColor} !important;
                        font-weight: 300; /* Keep it light weight even if bolded for color */
                    }
                  `}</style>
                <TiptapRenderer content={safeCta.title} as="inline" />
              </div>
            </h2>
          )}

          {/* Subheading / Description */}
          {safeCta.description && (
            <div
              className="max-w-2xl text-lg md:text-xl lg:text-2xl font-light leading-relaxed tracking-wide opacity-80 mb-8"
              style={{ color: secondaryTextColor }}
            >
              <TiptapRenderer content={safeCta.description} />
            </div>
          )}

          {/* Note Text (Optional Small Detail) */}
          {safeCta.label && (
            <div className="text-[10px] md:text-[11px] font-light tracking-[0.2em] opacity-60 mb-16" style={{ color: primaryTextColor }}>
              <TiptapRenderer content={safeCta.label} as="inline" />
            </div>
          )}

          {/* Circular Brand Color Discovery CTA */}
          {(safeCta.ctaButton || safeCta.primaryButton) && (
            <div className="">
              <Link
                href={safeCta.ctaButton?.url || safeCta.primaryButton?.href || '/'}
                className="group inline-flex items-center gap-6"
              >
                <span
                  className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase transition-colors"
                  style={{ color: brandColor }}
                >
                  {safeCta.ctaButton?.text || safeCta.primaryButton?.label || 'Get Started'}
                </span>
                <div
                  className="w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-700 group-hover:scale-110"
                  style={{ borderColor: brandColor, color: brandColor }}
                >
                  <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. Panoramic Image Reveal - Overlaps the bottom of the white block */}
      {backgroundImageUrl && (
        <div
          ref={bgImageContainerRef}
          className="relative w-full h-[60vh] md:h-[85vh] lg:h-[110vh] overflow-hidden -mt-32 md:-mt-48 lg:-mt-64 z-10"
        >
          <div
            ref={bgImageRef}
            className="absolute inset-x-0 -top-20 h-[140%] bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          >
            {/* Subtle Linear Fade for smooth overlap transition */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
          </div>
        </div>
      )}

      {/* Spacing for sections below */}
      {!backgroundImageUrl && <div className="h-32 bg-white w-full" />}
    </section>
  );
};