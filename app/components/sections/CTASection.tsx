'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { usePrefersReducedMotion } from '@/app/hooks/usePrefersReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CTASectionProps {
  ctaSection: Page['ctaSection'];
  className?: string;
}

const PARTICLE_SEED = [12, 18, 24, 30, 36, 42, 55, 62, 70, 78, 85, 92, 8, 65, 33, 48];

export const CTASection: React.FC<CTASectionProps> = ({ ctaSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const reducedMotion = usePrefersReducedMotion();
  
  // Use the theme's primary button color as the brand accent
  const brandColor = themeColors.primaryButton;

  const sectionRef = useRef<HTMLElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const contentParallaxRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const ctaInnerRef = useRef<HTMLAnchorElement>(null);
  const glowFollowRef = useRef<HTMLDivElement>(null);

  const backgroundImageUrl = ctaSection?.backgroundImage ? getImageSrc(ctaSection.backgroundImage) : null;
  const customBg = ctaSection?.backgroundColor?.trim();

  const magneticMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const wrap = ctaWrapRef.current;
      const inner = ctaInnerRef.current;
      if (!wrap || !inner || reducedMotion) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxR = 120;
      
      if (dist < maxR && dist > 0) {
        const pull = 1 - dist / maxR;
        gsap.to(inner, { x: dx * 0.18 * pull, y: dy * 0.18 * pull, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.to(inner, { x: 0, y: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      }
      
      if (glowFollowRef.current) {
        const gx = e.clientX - r.left - 40;
        const gy = e.clientY - r.top - 40;
        gsap.to(glowFollowRef.current, { x: gx, y: gy, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
      }
    },
    [reducedMotion]
  );

  const magneticLeave = useCallback(() => {
    if (!ctaInnerRef.current || reducedMotion) return;
    gsap.to(ctaInnerRef.current, { x: 0, y: 0, duration: 0.55, ease: 'power3.out' });
    if (glowFollowRef.current) {
      gsap.to(glowFollowRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' });
    }
  }, [reducedMotion]);

  const magneticEnter = useCallback(() => {
    if (!glowFollowRef.current || reducedMotion) return;
    gsap.to(glowFollowRef.current, { opacity: 0.85, duration: 0.4, ease: 'power2.out' });
  }, [reducedMotion]);

  useEffect(() => {
    if (!ctaSection?.enabled || !sectionRef.current) return;

    if (reducedMotion) {
      const reveals = sectionRef.current.querySelectorAll('[data-cta-reveal]');
      gsap.set(reveals, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const reveals = sectionRef.current?.querySelectorAll('[data-cta-reveal]');
      if (reveals?.length) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 40, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Animated Mesh Gradient using brand colors
      if (meshRef.current) {
        gsap.to(meshRef.current, {
          backgroundPosition: '100% 50%',
          duration: 20,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Subtle floating orbs
      [orbARef, orbBRef].forEach((ref, i) => {
        if (ref.current) {
          gsap.to(ref.current, {
            xPercent: i === 0 ? 15 : -15,
            yPercent: i === 0 ? -10 : 10,
            duration: 15 + (i * 5),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
      });

      // Ambient Particles
      const dots = particlesRef.current?.querySelectorAll<HTMLElement>('.cta-particle');
      dots?.forEach((dot, i) => {
        gsap.to(dot, {
          y: gsap.utils.random(15, 35),
          opacity: gsap.utils.random(0.1, 0.4),
          duration: gsap.utils.random(4, 7),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.1,
        });
      });

      const parallaxTrigger = sectionRef.current;
      if (parallaxTrigger) {
        const scrollParallax = {
          trigger: parallaxTrigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        };

        if (bgParallaxRef.current) {
          gsap.fromTo(
            bgParallaxRef.current,
            { yPercent: -18, scale: 1.12 },
            {
              yPercent: 18,
              scale: 1.12,
              ease: 'none',
              scrollTrigger: scrollParallax,
            }
          );
        }

        if (meshRef.current) {
          gsap.fromTo(
            meshRef.current,
            { yPercent: -8 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: { ...scrollParallax, scrub: 1.4 },
            }
          );
        }

        if (contentParallaxRef.current) {
          gsap.fromTo(
            contentParallaxRef.current,
            { y: 48 },
            {
              y: -48,
              ease: 'none',
              scrollTrigger: { ...scrollParallax, scrub: 0.85 },
            }
          );
        }

        if (particlesRef.current) {
          gsap.fromTo(
            particlesRef.current,
            { y: 30 },
            {
              y: -30,
              ease: 'none',
              scrollTrigger: { ...scrollParallax, scrub: 1.2 },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ctaSection?.enabled, reducedMotion, backgroundImageUrl]);

  if (!ctaSection?.enabled) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate flex min-h-[85vh] flex-col items-center justify-center overflow-hidden py-24 wb-bg-section-dark wb-text-on-dark lg:py-40',
        className
      )}
      style={{ 
        backgroundColor: customBg || 'var(--wb-section-bg-dark)',
        fontFamily: themeFonts.body 
      }}
    >
      {/* MESH GRADIENT OVERLAY */}
      <div
        ref={meshRef}
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, transparent 40%, ${brandColor} 70%, transparent 100%)`,
          backgroundSize: '200% 200%',
        }}
        aria-hidden
      />

      {/* BACKGROUND IMAGE & SHADING */}
      {backgroundImageUrl && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            ref={bgParallaxRef}
            className="absolute -top-[15%] left-0 h-[130%] w-full will-change-transform"
          >
            <OptimizedImage
              src={backgroundImageUrl}
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--wb-section-bg-dark)] via-transparent to-[var(--wb-section-bg-dark)]" />
        </div>
      )}

      {/* DYNAMIC AMBIENT ORBS */}
      <div
        ref={orbARef}
        className="pointer-events-none absolute -left-[10%] top-0 h-[600px] w-[600px] rounded-full opacity-[0.15] blur-[120px]"
        style={{ background: brandColor }}
        aria-hidden
      />
      <div
        ref={orbBRef}
        className="pointer-events-none absolute -right-[10%] bottom-0 h-[500px] w-[500px] rounded-full opacity-[0.1] blur-[100px]"
        style={{ background: brandColor }}
        aria-hidden
      />

      {/* CONTENT WRAPPER */}
      <div
        ref={contentParallaxRef}
        className="container relative z-10 mx-auto px-6 text-center will-change-transform"
      >
        
        {/* SMALL TOP LABEL (Optional/Legacy check) */}
        {(ctaSection as any).subtitle && (
          <div 
            data-cta-reveal 
            className="mb-8 text-[10px] font-bold uppercase tracking-[0.5em] opacity-60"
            style={{ color: brandColor }}
          >
             <TiptapRenderer content={(ctaSection as any).subtitle} as="inline" />
          </div>
        )}

        {/* MAIN TITLE */}
        {ctaSection.title && (
          <h2
            data-cta-reveal
            className="mx-auto mb-10 max-w-4xl text-balance text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[1.05] tracking-tight"
            style={{ fontFamily: themeFonts.heading }}
          >
            <TiptapRenderer content={ctaSection.title} as="inline" />
          </h2>
        )}

        {/* DESCRIPTION */}
        {ctaSection.description && (
          <div
            data-cta-reveal
            className="mx-auto mb-16 max-w-2xl text-lg font-light leading-relaxed opacity-70"
          >
            <TiptapRenderer content={ctaSection.description} />
          </div>
        )}

        {/* CTA BUTTON AREA */}
        {ctaSection.primaryButton && (
          <div data-cta-reveal className="relative inline-block">
            {/* Pulsing Aura */}
            <div
              ref={pulseRef}
              className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
              style={{ background: brandColor }}
              aria-hidden
            />

            <div
              ref={ctaWrapRef}
              className="relative"
              onPointerMove={magneticMove}
              onPointerLeave={magneticLeave}
              onPointerEnter={magneticEnter}
            >
              {/* Dynamic Mouse Glow */}
              <div
                ref={glowFollowRef}
                className="pointer-events-none absolute left-0 top-0 h-24 w-24 rounded-full opacity-0 blur-2xl"
                style={{ background: `radial-gradient(circle, ${brandColor} 60%, transparent 100%)` }}
                aria-hidden
              />

              <Link
                ref={ctaInnerRef}
                href={ctaSection.primaryButton.href || '/'}
                className="group relative inline-flex items-center gap-6 overflow-hidden rounded-full border px-12 py-6 text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:scale-105 active:scale-95"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* Button Text */}
                <span className="relative z-10 text-white group-hover:text-white">
                  {ctaSection.primaryButton.label}
                </span>

                {/* Arrow Icon */}
                <span 
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-transform duration-500 group-hover:rotate-45"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>

                {/* Hover Background Slide */}
                <div 
                  className="absolute inset-0 -z-10 translate-y-full transition-transform duration-500 group-hover:translate-y-0"
                  style={{ backgroundColor: brandColor }}
                />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* AMBIENT PARTICLES LAYER */}
      <div ref={particlesRef} className="pointer-events-none absolute inset-0" aria-hidden>
        {PARTICLE_SEED.map((left, i) => (
          <div
            key={i}
            className="cta-particle absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${(i * 41) % 95}%`,
              width: i % 2 === 0 ? '2px' : '3px',
              height: i % 2 === 0 ? '2px' : '3px',
              backgroundColor: brandColor,
              opacity: 0.2
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CTASection;