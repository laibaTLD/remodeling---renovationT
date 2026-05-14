'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/hooks/useTheme';
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
  const themeColors = useThemeColors();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!aboutSection?.enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageContainerRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.8,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 1.2, yPercent: 10 },
        {
          scale: 1,
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      const children = textRef.current?.children;
      if (children) {
        gsap.fromTo(
          children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [aboutSection]);

  if (!aboutSection?.enabled) return null;

  const brandColor = themeColors.primaryButton;
  const features = aboutSection.features?.filter((f) => f?.label?.trim()) ?? [];

  const imageUrl = aboutSection.image
    ? getImageSrc(
        typeof aboutSection.image === 'object' && aboutSection.image !== null
          ? aboutSection.image.url
          : aboutSection.image
      )
    : null;

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full overflow-hidden py-16 text-white md:py-24 lg:py-32', className)}
      style={{
        background: 'linear-gradient(180deg, #050508 0%, #0a0a12 40%, #06060c 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:64px_64px] opacity-30" />

      <div className="container relative mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-32">
          <div ref={textRef} className="w-full space-y-10 lg:w-[46%]">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12" style={{ backgroundColor: brandColor }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-white/45">Studio</span>
            </div>

            {aboutSection.title && (
              <h2 className="text-4xl font-light uppercase leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
                <TiptapRenderer content={aboutSection.title} as="inline" />
              </h2>
            )}

            {aboutSection.description && (
              <div className="max-w-lg text-base font-light leading-relaxed tracking-wide text-white/60 md:text-lg">
                <TiptapRenderer content={aboutSection.description} />
              </div>
            )}

            {features.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {features.slice(0, 4).map((f, i) => (
                  <motion.div
                    key={`${f.label}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: i * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
                      {f.label}
                    </div>
                    {f.description && (
                      <div className="mt-2 text-xs font-light leading-relaxed text-white/55">
                        <TiptapRenderer content={f.description} as="inline" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <motion.a
                href="/about-us"
                whileHover={{ x: 4 }}
                className="group inline-flex items-center gap-6"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: brandColor }}>
                  Full story
                </span>
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-110"
                  style={{ borderColor: brandColor, color: brandColor }}
                >
                  <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            </div>
          </div>

          <div className="w-full lg:w-[54%]">
            <div
              ref={imageContainerRef}
              className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:aspect-[16/11] lg:aspect-[4/3]"
            >
              {imageUrl ? (
                <OptimizedImage
                  ref={imageRef}
                  src={imageUrl}
                  alt={typeof aboutSection.image === 'object' ? aboutSection.image?.altText || '' : ''}
                  fill
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.06] to-transparent">
                  <span className="text-xs uppercase tracking-[0.4em] text-white/25">Visual narrative</span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
