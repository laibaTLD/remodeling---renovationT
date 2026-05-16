'use client';

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Page } from '@/app/lib/types';
import { cn, getImageSrc } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useHeroIntro } from '@/app/providers/HeroIntroProvider';
import { useLenis } from '@/app/components/cinematic/LenisProvider';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const SLICE_COLS = 10;
const SLICE_ROWS = 7;

interface HeroSectionProps {
  hero?: Page['hero'];
  projectsSection?: Page['projectsSection'];
  /** Skip home-page intro loader (service area and inner pages). */
  skipIntro?: boolean;
  className?: string;
}

type HeroMedia = NonNullable<Page['hero']>['media'];

function resolveHeroMedia(hero?: Page['hero']): HeroMedia | null {
  if (!hero) return null;
  const items = Array.isArray(hero.mediaItems) && hero.mediaItems.length > 0
    ? hero.mediaItems
    : hero.media
      ? [hero.media]
      : [];
  if (items.length === 0) return null;
  return items.find((item) => item.type === 'image') ?? items[0];
}

function resolveHeroImageSrc(hero?: Page['hero'], projectsSection?: Page['projectsSection']): string {
  const media = resolveHeroMedia(hero);
  if (media?.url && media.type !== 'video') return getImageSrc(media.url);
  const projectUrl = projectsSection?.projects?.[0]?.image?.url;
  return projectUrl ? getImageSrc(projectUrl) : '';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  projectsSection,
  skipIntro = false,
  className,
}) => {
  const pathname = usePathname();
  const isHomeRoute = pathname === '/';
  const showIntro = !skipIntro && isHomeRoute;

  const sectionRef = useRef<HTMLElement>(null);
  const parallaxImgRef = useRef<HTMLDivElement>(null);
  const { site } = useWebBuilder();
  const { completeHeroIntro } = useHeroIntro();
  const { lenis, reducedMotion } = useLenis();

  const scrollToNextSection = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const next = section.nextElementSibling as HTMLElement | null;
    if (!next) {
      const fallbackTop = section.offsetTop + section.offsetHeight;
      if (lenis) {
        lenis.scrollTo(fallbackTop, { duration: reducedMotion ? 0 : 1.2 });
      } else {
        window.scrollTo({ top: fallbackTop, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      return;
    }

    if (lenis) {
      lenis.scrollTo(next, { offset: 0, duration: reducedMotion ? 0 : 1.35 });
      return;
    }

    next.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [lenis, reducedMotion]);

  const [phase, setPhase] = useState<'loading' | 'reveal' | 'hero'>(showIntro ? 'loading' : 'hero');
  const [counter, setCounter] = useState(showIntro ? 0 : 100);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const business = site?.business;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!showIntro) {
      completeHeroIntro();
      return;
    }
    if (phase === 'hero') {
      completeHeroIntro();
    }
  }, [phase, completeHeroIntro, showIntro]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const primaryMedia = useMemo(() => resolveHeroMedia(hero), [hero]);
  const primarySrc = useMemo(
    () => resolveHeroImageSrc(hero, projectsSection),
    [hero, projectsSection]
  );
  const isPrimaryVideo = primaryMedia?.type === 'video' && Boolean(primaryMedia.url);
  const primaryVideoSrc = isPrimaryVideo ? getImageSrc(primaryMedia!.url) : '';
  const imageAlt = primaryMedia?.altText ?? '';

  const runReveal = useCallback(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.inOut' },
        onComplete: () => setPhase('hero'),
      });

      tl.to('.hero-loader', {
        opacity: 0,
        duration: 0.9,
        pointerEvents: 'none',
      })
        .to(
          '.hero-loader .hero-frame-mask',
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.8,
          },
          0.15
        )
        .to(
          '.hero-loader .hero-slice',
          {
            scaleY: 1,
            scaleX: 1,
            opacity: 1,
            duration: 1.1,
            stagger: { amount: 0.85, from: 'center', grid: [SLICE_ROWS, SLICE_COLS] },
          },
          0.2
        )
        .fromTo(
          '.hero-stage',
          { clipPath: 'inset(22% 18% 22% 18%)', scale: 0.94, autoAlpha: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, autoAlpha: 1, duration: 2.1 },
          0.55
        )
        .fromTo(
          '.hero-stage .hero-title-reveal',
          { y: 48, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.35, ease: 'power4.out' },
          0.95
        )
        .fromTo(
          '.hero-stage .hero-ui-fade',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out' },
          1.15
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showIntro || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set('.hero-stage', { autoAlpha: 0, clipPath: 'inset(22% 18% 22% 18%)', scale: 0.94 });
      gsap.set('.hero-stage .hero-ui-fade, .hero-stage .hero-title-reveal', { autoAlpha: 0, y: 18 });
    }, sectionRef);

    return () => ctx.revert();
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro) return;

    if (prefersReducedMotion) {
      setCounter(100);
      setPhase('hero');
      return;
    }

    const progress = { value: 0 };
    let revealed = false;

    const tryReveal = () => {
      if (revealed || progress.value < 100) return;
      revealed = true;
      setPhase('reveal');
      requestAnimationFrame(() => runReveal());
    };

    const tl = gsap.timeline({
      onUpdate: () => tryReveal(),
    });

    tl.to(progress, {
      value: 100,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => setCounter(Math.floor(progress.value)),
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-loader .hero-frame-border',
        { scaleX: 0, scaleY: 0, opacity: 0 },
        { scaleX: 1, scaleY: 1, opacity: 1, duration: 1.6, ease: 'power3.inOut', delay: 0.2 }
      );
      gsap.from('.hero-loader .hero-slice', {
        scaleY: 0,
        scaleX: 1.08,
        opacity: 0.35,
        duration: 1.4,
        stagger: { amount: 1.1, from: 'random', grid: [SLICE_ROWS, SLICE_COLS] },
        ease: 'power3.out',
        delay: 0.35,
      });
      gsap.fromTo(
        '.hero-loader .hero-loader-ui',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.15 }
      );
    }, sectionRef);

    return () => {
      tl.kill();
      ctx.revert();
    };
  }, [runReveal, showIntro, prefersReducedMotion]);

  useEffect(() => {
    if (showIntro || prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-stage',
        { autoAlpha: 0, scale: 1.04 },
        { autoAlpha: 1, scale: 1, duration: 1.35, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.hero-stage .hero-title-reveal',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power4.out', delay: 0.12 }
      );
      gsap.fromTo(
        '.hero-stage .hero-ui-fade',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.08, ease: 'power3.out', delay: 0.28 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [showIntro, prefersReducedMotion]);

  useEffect(() => {
    if (phase !== 'hero') return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      if (parallaxImgRef.current) {
        gsap.to(parallaxImgRef.current, {
          x: nx * 14,
          y: ny * 10,
          duration: 1.6,
          ease: 'power2.out',
          overwrite: true,
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  const slices = useMemo(
    () =>
      Array.from({ length: SLICE_COLS * SLICE_ROWS }, (_, i) => ({
        col: i % SLICE_COLS,
        row: Math.floor(i / SLICE_COLS),
        i,
      })),
    []
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        'hero-cinematic relative h-screen w-full overflow-hidden text-neutral-100 select-none bg-neutral-950',
        className
      )}
    >
      <div className="hero-grain pointer-events-none absolute inset-0 z-[60] opacity-[0.05] mix-blend-overlay" aria-hidden />

      <AnimatePresence>
        {showIntro && (phase === 'loading' || phase === 'reveal') && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="hero-loader absolute inset-0 z-50 flex flex-col bg-neutral-950"
            aria-busy={phase === 'loading'}
          >
            <motion.div className="flex items-start justify-between p-8 md:p-12">
              <div className="hero-loader-ui flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 font-medium">
                  {business?.name || 'Studio'} / ©{currentYear}
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-700">
                  {business?.tagline || 'Architecture & Design'}
                </p>
              </div>
              <p className="hero-loader-ui text-[10px] tabular-nums tracking-widest text-neutral-500 uppercase">
                Intro Sequence / 001
              </p>
            </motion.div>

            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <motion.div
                className="hero-frame-mask relative w-[min(92vw,480px)] aspect-[4/5] md:aspect-[3/4]"
                style={{ clipPath: 'inset(14% 12% 14% 12%)', transform: 'scale(1.04)' }}
              >
                <div
                  className="hero-frame-border pointer-events-none absolute inset-0 z-20 border border-neutral-700"
                  style={{ transformOrigin: 'center center' }}
                />
                <motion.div className="absolute inset-[1px] overflow-hidden bg-neutral-900">
                  {isPrimaryVideo && primaryVideoSrc ? (
                    <video
                      src={primaryVideoSrc}
                      className="absolute inset-0 z-0 h-full w-full object-cover grayscale contrast-125"
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label={imageAlt}
                    />
                  ) : null}
                  <div
                    className="grid h-full w-full"
                    style={{
                      gridTemplateColumns: `repeat(${SLICE_COLS}, 1fr)`,
                      gridTemplateRows: `repeat(${SLICE_ROWS}, 1fr)`,
                    }}
                  >
                    {slices.map(({ col, row, i }) => (
                      <div
                        key={i}
                        className="hero-slice relative overflow-hidden"
                        style={{
                          transformOrigin: row < SLICE_ROWS / 2 ? 'top center' : 'bottom center',
                        }}
                      >
                        {!isPrimaryVideo && primarySrc ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
                            style={{
                              backgroundImage: `url(${primarySrc})`,
                              backgroundSize: `${SLICE_COLS * 100}% ${SLICE_ROWS * 100}%`,
                              backgroundPosition: `${(col / (SLICE_COLS - 1)) * 100}% ${(row / (SLICE_ROWS - 1)) * 100}%`,
                            }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="hero-loader-brand pointer-events-none absolute inset-x-0 bottom-12 z-30 text-center">
                  <h2 className="text-[10px] tracking-[0.8em] uppercase text-neutral-400 font-display">
                    {hero?.eyebrow ? <TiptapRenderer content={hero.eyebrow} /> : 'Loading'}
                  </h2>
                </div>
              </motion.div>
            </div>

            <div className="flex items-end justify-between p-8 md:p-12">
              <div className="hero-loader-ui max-w-xs">
                {business?.description ? (
                  <motion.div className="text-[11px] leading-relaxed text-neutral-500 font-light max-w-[200px]">
                    <TiptapRenderer content={business.description} />
                  </motion.div>
                ) : null}
              </div>
              <p className="text-[clamp(4rem,15vw,10rem)] font-extralight leading-none tracking-tighter tabular-nums text-neutral-200 font-display">
                {counter.toString().padStart(3, '0')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'hero-stage relative h-full w-full',
          showIntro && phase !== 'hero' && 'pointer-events-none'
        )}
        aria-hidden={showIntro && phase !== 'hero'}
      >
        <div ref={parallaxImgRef} className="absolute inset-0 will-change-transform">
          {isPrimaryVideo && primaryVideoSrc ? (
            <video
              src={primaryVideoSrc}
              className="absolute inset-0 h-full w-full scale-110 object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-label={imageAlt}
            />
          ) : primarySrc ? (
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center"
              style={{ backgroundImage: `url(${primarySrc})` }}
              role="img"
              aria-label={imageAlt}
            />
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-neutral-950/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12">
          <div className="flex flex-col items-center justify-center flex-1">
            {hero?.title && (
              <h1 className="hero-title-reveal pointer-events-none text-center text-[clamp(2rem,6vw,6rem)] font-light leading-[0.9] tracking-[-0.02em] font-display text-white">
                <TiptapRenderer content={hero.title} as="inline" />
              </h1>
            )}
            <div className="hero-ui-fade mt-6 flex flex-col items-center gap-4">
              {hero?.subtitle && (
                <div className="text-[clamp(0.7rem,1.2vw,0.85rem)] font-normal tracking-[0.6em] text-neutral-400 uppercase">
                  <TiptapRenderer content={hero.subtitle} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mb-2">
            <div className="hero-ui-fade max-w-sm">
              {hero?.description && (
                <div className="text-[11px] leading-loose text-neutral-400 font-light tracking-wide uppercase">
                  <TiptapRenderer content={hero.description} />
                </div>
              )}
            </div>

            <div className="hero-ui-fade flex flex-col items-end gap-6">
              <div className="flex gap-12">
                {hero?.featuredSpotlight?.completedLabel && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Phase</span>
                    <span className="text-[10px] text-neutral-300 uppercase tracking-widest">
                      {hero.featuredSpotlight.completedLabel}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={scrollToNextSection}
                disabled={showIntro && phase !== 'hero'}
                aria-label="Scroll to next section"
                className="group relative z-30 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950/20 backdrop-blur-sm transition-colors hover:border-neutral-500 disabled:pointer-events-none disabled:opacity-40 pointer-events-auto cursor-pointer"
              >
                <motion.span
                  aria-hidden
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="mb-1 block h-4 w-4 rotate-45 border-b-2 border-r-2 border-neutral-400"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        }
      `}</style>
    </section>
  );
};