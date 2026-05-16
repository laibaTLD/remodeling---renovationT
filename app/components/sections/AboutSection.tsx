'use client';

import React, { useEffect, useRef } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/hooks/useTheme';
import { usePrefersReducedMotion } from '@/app/hooks/usePrefersReducedMotion';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
  aboutSection: Page['aboutSection'];
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutSection, className }) => {
  const { site } = useWebBuilder();
  const theme = useThemeColors();
  const reducedMotion = usePrefersReducedMotion();
  
  const rootRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const imageUrl = aboutSection?.image
    ? getImageSrc(
        typeof aboutSection.image === 'object' && aboutSection.image !== null
          ? aboutSection.image.url
          : aboutSection.image
      )
    : null;

  const features = aboutSection?.features?.filter((f) => f?.label?.trim()) ?? [];

  useEffect(() => {
    if (!aboutSection?.enabled || !rootRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Content Reveal
      gsap.fromTo('.reveal-text', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' }
        }
      );

      // Image Parallax & Scale
      if (imageContainerRef.current) {
        gsap.fromTo(imageContainerRef.current,
          { scale: 1.1, clipPath: 'inset(10% 10% 10% 10%)' },
          { 
            scale: 1, 
            clipPath: 'inset(0% 0% 0% 0%)', 
            duration: 1.5, 
            ease: 'expo.out',
            scrollTrigger: { trigger: imageContainerRef.current, start: 'top 80%' }
          }
        );
      }

      // Feature Line Drawing
      gsap.fromTo('.feature-line',
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.feature-grid', start: 'top 85%' }
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [aboutSection?.enabled, reducedMotion]);

  if (!aboutSection?.enabled) return null;

  const alt = typeof aboutSection.image === 'object' && aboutSection.image !== null ? aboutSection.image?.altText || '' : '';

  return (
    <section 
      ref={rootRef} 
      className={cn('relative w-full py-8 px-4 overflow-hidden', className)}
      style={{ backgroundColor: theme.pageBackground, color: theme.mainText }}
    >
      {/* Structural Grid Overlay (Background) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <div className="h-full w-full" style={{ backgroundImage: `linear-gradient(${theme.mainText} 1px, transparent 1px), linear-gradient(90deg, ${theme.mainText} 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
      </div>

      <div className="container relative mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="reveal-text flex items-center gap-4">
              <div className="h-[1px] w-12" style={{ backgroundColor: theme.primaryButton }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">
                {site?.business?.name || 'About Us'}
              </span>
            </div>

            {aboutSection.title && (
              <h2 className="reveal-text text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight" 
                  style={{ fontFamily: site?.theme?.headingFont || 'inherit' }}>
                <TiptapRenderer content={aboutSection.title} as="inline" />
              </h2>
            )}

            {aboutSection.description && (
              <div className="reveal-text text-lg md:text-xl font-light leading-relaxed opacity-80 max-w-xl">
                <TiptapRenderer content={aboutSection.description} />
              </div>
            )}

            {/* Feature List (Timeline Redesign) */}
            <div className="feature-grid pt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {features.map((f, i) => (
                <div key={i} className="group relative pt-6">
                  <div className="feature-line absolute top-0 left-0 h-[1px] w-full origin-left opacity-20" style={{ backgroundColor: theme.mainText }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest mb-3 block" style={{ color: theme.primaryButton }}>
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{f.label}</h3>
                  {f.description && (
                    <div className="text-sm font-light opacity-60 leading-relaxed">
                      <TiptapRenderer content={f.description} as="inline" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image / Frame Section */}
          <div className="lg:col-span-6 relative">
            <div ref={imageContainerRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl">
              {imageUrl ? (
                <OptimizedImage
                  src={imageUrl}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full opacity-10" style={{ backgroundColor: theme.mainText }} />
              )}
              
              {/* Decorative Frame Overlays */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />
            </div>

            {/* Architectural Label */}
            <div className="absolute -bottom-6 -right-2 md:right-12 bg-white p-6 shadow-xl hidden md:block" style={{ backgroundColor: theme.pageBackground }}>
              <div className="flex items-center gap-8">
                <div className="text-left">
                  <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-1">Status</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Active Phase</p>
                </div>
                <div className="h-8 w-[1px] opacity-10" style={{ backgroundColor: theme.mainText }} />
                <div className="text-left">
                  <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-1">Project Code</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest">EST. {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;