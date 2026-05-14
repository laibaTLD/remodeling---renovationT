'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { DM_Mono, Playfair_Display } from 'next/font/google';
import { Page, Site } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getThemeColors } from '@/app/lib/themeBuilder';
import { usePrefersReducedMotion } from '@/app/hooks/usePrefersReducedMotion';
import { tiptapToLines, tiptapToText } from '@/app/lib/seo';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-hero-dm' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  style: ['normal', 'italic'],
  variable: '--font-hero-playfair',
});

interface HeroSectionProps {
  hero: Page['hero'];
  projectsSection?: Page['projectsSection'];
  className?: string;
}

interface HeroWithMediaItems extends NonNullable<Page['hero']> {
  mediaItems?: Array<NonNullable<Page['hero']>['media'] & { type?: 'image' | 'video' }>;
}

function estYearFromSite(site: Site | null | undefined): number | null {
  const raw = site?.publishedAt || site?.createdAt;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d.getFullYear() : null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, projectsSection, className }) => {
  const noiseFilterId = useId().replace(/:/g, '');
  const { site, pages } = useWebBuilder();
  const reducedMotion = usePrefersReducedMotion();

  const themeResolved = useMemo(() => getThemeColors(site), [site]);
  const primary = themeResolved.primaryButton;
  const bodyFont = site?.theme?.bodyFont;

  const contactHref = useMemo(() => {
    const c = pages?.find((p) => p.pageType === 'contact');
    const raw = c?.slug?.trim();
    if (!raw) return '#contact';
    const slug = raw.replace(/^\/+|\/+$/g, '');
    return slug ? `/${slug}` : '/';
  }, [pages]);

  const projectsHref = useMemo(() => {
    const p = pages?.find((x) => x.pageType === 'project-detail');
    const raw = p?.slug?.trim();
    if (!raw) return '/project-detail';
    const slug = raw.replace(/^\/+|\/+$/g, '');
    return slug ? `/${slug}` : '/project-detail';
  }, [pages]);

  const sectionRef = useRef<HTMLElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingStackRef = useRef<HTMLDivElement>(null);
  const lineInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const primaryWrapRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imgTopRef = useRef<HTMLDivElement>(null);
  const imgBotRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const glassFloatRef = useRef<HTMLDivElement>(null);

  const mediaItems = useMemo(() => {
    if (!hero) return [] as NonNullable<HeroWithMediaItems['media']>[];
    const h = hero as HeroWithMediaItems;
    if (Array.isArray(h.mediaItems) && h.mediaItems.length > 0) return h.mediaItems;
    return h.media ? [h.media] : [];
  }, [hero]);

  const titleLines = useMemo(() => tiptapToLines(hero?.title, 6).slice(0, 3), [hero?.title]);
  const titleLinesKey = titleLines.join('\u0000');
  const editorialStats = useMemo(() => {
    const raw = hero?.editorialStats;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (s): s is { value: number; suffix?: string; label: string } =>
        typeof s?.value === 'number' && typeof s?.label === 'string' && s.label.trim().length > 0
    );
  }, [hero?.editorialStats]);

  const eyebrowContent = useMemo(() => {
    if (hero?.eyebrow) {
      const t = tiptapToText(hero.eyebrow).trim();
      if (t) return t;
    }
    const y = estYearFromSite(site);
    const studio = (site?.business?.name || site?.name || '').trim();
    if (y != null && studio) return `EST. ${y} — ${studio.toUpperCase()}`;
    if (studio) return studio.toUpperCase();
    if (y != null) return `EST. ${y}`;
    return '';
  }, [hero, site]);

  const spotlight = useMemo(() => {
    const spot = hero?.featuredSpotlight;
    if (spot?.projectName?.trim()) {
      return {
        label: spot.label,
        projectName: spot.projectName.trim(),
        rating: typeof spot.rating === 'number' ? Math.min(5, Math.max(0, spot.rating)) : undefined,
        completedLabel: spot.completedLabel?.trim(),
      };
    }
    const p0 = projectsSection?.projects?.[0];
    if (p0) {
      const name = tiptapToText(p0.title).trim();
      if (name) return { projectName: name };
    }
    return null;
  }, [hero, projectsSection]);

  const subContent = hero?.description || hero?.subtitle || site?.business?.description;
  const hasSub = Boolean(subContent && (typeof subContent === 'string' ? subContent.trim() : true));

  const primaryHref = hero?.primaryCta?.href?.trim() || contactHref;
  const primaryLabel = hero?.primaryCta?.label?.trim();
  const secondaryHref = hero?.secondaryCta?.href?.trim() || projectsHref;
  const secondaryLabel = hero?.secondaryCta?.label?.trim();

  const baseBg = site?.theme?.sectionBackgroundColorDark || site?.theme?.pageBackgroundColor || '#0D0D0D';

  const magneticMove = useCallback((e: MouseEvent) => {
    const wrap = primaryWrapRef.current;
    const btn = primaryBtnRef.current;
    if (!wrap || !btn || reducedMotion) return;
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const maxR = 80;
    if (dist < maxR && dist > 0) {
      const pull = 1 - dist / maxR;
      gsap.to(btn, { x: dx * 0.38 * pull, y: dy * 0.38 * pull, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'power2.out' });
    }
  }, [reducedMotion]);

  const magneticLeave = useCallback(() => {
    const btn = primaryBtnRef.current;
    if (!btn || reducedMotion) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [reducedMotion]);

  useEffect(() => {
    const wrap = primaryWrapRef.current;
    if (!wrap || !primaryLabel || reducedMotion) return;
    wrap.addEventListener('mousemove', magneticMove);
    wrap.addEventListener('mouseleave', magneticLeave);
    return () => {
      wrap.removeEventListener('mousemove', magneticMove);
      wrap.removeEventListener('mouseleave', magneticLeave);
    };
  }, [magneticLeave, magneticMove, primaryLabel, reducedMotion]);

  useEffect(() => {
    if (!hero?.enabled || !sectionRef.current) return;

    if (reducedMotion) {
      gsap.set(noiseRef.current, { opacity: 1 });
      gsap.set([eyebrowRef.current, subRef.current, ctaWrapRef.current, glassRef.current, glassFloatRef.current], {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      });
      lineInnerRefs.current.forEach((el) => {
        if (el) gsap.set(el, { clipPath: 'inset(0% 0 0 0)' });
      });
      gsap.set([imgTopRef.current, imgBotRef.current], { x: 0, opacity: 1 });
      editorialStats.forEach((s, i) => {
        const el = statValueRefs.current[i];
        if (el) el.textContent = `${s.value}${s.suffix ?? ''}`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(noiseRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'none' }, 0)
        .fromTo(eyebrowRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.2);

      const lineTargets = lineInnerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (lineTargets.length > 0) {
        tl.fromTo(
          lineTargets,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 0.88, stagger: 0.15, ease: 'power4.out' },
          0.28
        );
      } else if (headingStackRef.current) {
        tl.fromTo(headingStackRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.95, ease: 'power4.out' }, 0.28);
      }

      tl.fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, 0.8);
      const ctaKids = ctaWrapRef.current?.children?.length ? Array.from(ctaWrapRef.current.children) : [];
      if (ctaKids.length > 0) {
        tl.fromTo(
          ctaKids,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(1.2)' },
          0.82
        );
      }

      tl.fromTo(
        [imgTopRef.current, imgBotRef.current].filter(Boolean),
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
        0.12
      ).fromTo(
        glassRef.current,
        { y: 40, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'elastic.out(1, 0.55)' },
        '>-0.2'
      );

      editorialStats.forEach((stat, i) => {
        const el = statValueRefs.current[i];
        if (!el) return;
        const o = { v: 0 };
        tl.to(
          o,
          {
            v: stat.value,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${Math.round(o.v)}${stat.suffix ?? ''}`;
            },
          },
          0.95 + i * 0.08
        );
      });

      const trig = sectionRef.current;
      if (trig) {
        ScrollTrigger.create({
          trigger: trig,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
          onUpdate: (self) => {
            const p = self.progress;
            if (imgTopRef.current) gsap.set(imgTopRef.current, { y: (p - 0.5) * -48 });
            if (imgBotRef.current) gsap.set(imgBotRef.current, { y: (p - 0.5) * -88 });
            if (headingStackRef.current) gsap.set(headingStackRef.current, { y: (p - 0.5) * -28 });
          },
        });
      }

      if (glassFloatRef.current) {
        gsap.to(glassFloatRef.current, {
          y: 8,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [editorialStats, hero?.enabled, reducedMotion, titleLinesKey]);

  if (!hero?.enabled) return null;

  const renderMedia = (item: NonNullable<HeroWithMediaItems['media']>, className: string) => {
    if (item.type === 'video') {
      return (
        <video className={className} src={getImageSrc(item.url)} autoPlay muted loop playsInline>
          <track kind="captions" />
        </video>
      );
    }
    return (
      <div className="relative h-full w-full">
        <OptimizedImage src={getImageSrc(item.url)} alt={item.altText || ''} fill className={className} sizes="(max-width:1024px) 100vw, 45vw" />
      </div>
    );
  };

  const showGlassCard = Boolean(spotlight?.projectName);
  const lineStyles = (i: number) => {
    if (i === 0)
      return 'hero-kinetic-outline text-[clamp(2.5rem,6vw,4.75rem)] font-semibold uppercase leading-[0.95] tracking-tight [font-family:var(--font-hero-dm),ui-monospace]';
    if (i === 1)
      return `text-[clamp(2.5rem,6vw,4.75rem)] font-semibold uppercase leading-[0.95] tracking-tight [font-family:var(--font-hero-dm),ui-monospace]`;
    return `${playfair.className} text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold italic leading-[1.05] text-white`;
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate min-h-screen w-full overflow-hidden',
        dmMono.variable,
        playfair.variable,
        className
      )}
      style={
        {
          ['--hero-accent' as string]: primary,
          ['--hero-base' as string]: baseBg,
          fontFamily: bodyFont,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 z-0" style={{ backgroundColor: 'var(--hero-base)' }} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
        style={{
          background: `linear-gradient(150deg, transparent 0%, color-mix(in srgb, ${primary} 55%, transparent) 42%, transparent 72%)`,
        }}
      />

      <div ref={noiseRef} className="pointer-events-none absolute inset-0 z-[2] opacity-0" aria-hidden>
        <svg className="h-full w-full">
          <filter id={noiseFilterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${noiseFilterId})`} className="opacity-[0.35]" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-12 px-5 pb-16 pt-24 md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-14 lg:pt-28">
        <div className="flex w-full flex-col lg:w-[55%] lg:max-w-none lg:pr-10">
          {eyebrowContent ? (
            <div ref={eyebrowRef} className="mb-8 flex items-center gap-3 opacity-0" style={{ fontFamily: 'var(--font-hero-dm), ui-monospace' }}>
              <span className="h-px w-10 shrink-0" style={{ backgroundColor: primary }} />
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">{eyebrowContent}</span>
            </div>
          ) : (
            <div ref={eyebrowRef} className="mb-8 h-px w-px opacity-0" aria-hidden />
          )}

          <div ref={headingStackRef} className="mb-8 space-y-1">
            {titleLines.length > 0 ? (
              <h1 className="m-0 p-0">
                {titleLines.map((line, i) => (
                  <div key={i} className="overflow-hidden py-0.5">
                    <div
                      ref={(el) => {
                        lineInnerRefs.current[i] = el;
                      }}
                      className={cn(lineStyles(i))}
                      style={
                        i === 1
                          ? { color: primary }
                          : undefined
                      }
                    >
                      {line}
                    </div>
                  </div>
                ))}
              </h1>
            ) : hero.title ? (
              <h1 className="overflow-hidden py-0.5">
                <div
                  ref={(el) => {
                    lineInnerRefs.current[0] = el;
                  }}
                  className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-white"
                  style={{ fontFamily: site?.theme?.headingFont }}
                >
                  <TiptapRenderer content={hero.title} as="inline" />
                </div>
              </h1>
            ) : site?.name ? (
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-white" style={{ fontFamily: site?.theme?.headingFont }}>
                {site.name}
              </h1>
            ) : null}
          </div>

          <div ref={subRef} className="mb-10 max-w-xl opacity-0">
            {hasSub ? (
              <div className="text-base font-light leading-relaxed text-white/65 md:text-lg">
                <TiptapRenderer content={subContent} as="inline" />
              </div>
            ) : null}
          </div>

          <div ref={ctaWrapRef} className="mb-12 flex flex-wrap gap-4 opacity-0">
            {primaryLabel ? (
              <div ref={primaryWrapRef} className="inline-block">
                <a
                  ref={primaryBtnRef}
                  href={primaryHref}
                  className="relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_0_32px_color-mix(in_srgb,var(--hero-accent)_40%,transparent)] transition-[box-shadow] will-change-transform hover:shadow-[0_0_48px_color-mix(in_srgb,var(--hero-accent)_55%,transparent)]"
                  style={{ background: `linear-gradient(135deg, ${primary}, color-mix(in srgb, ${primary} 75%, white))` }}
                >
                  <span>{primaryLabel}</span>
                  <span aria-hidden>→</span>
                </a>
              </div>
            ) : null}
            {secondaryLabel ? (
              <a
                href={secondaryHref}
                className="group relative inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-8 py-3.5 text-sm font-medium text-white/90 backdrop-blur-md transition-transform hover:scale-[1.02]"
              >
                <span className="relative">
                  {secondaryLabel}
                  <span
                    className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: primary }}
                  />
                </span>
              </a>
            ) : null}
          </div>

          {editorialStats.length > 0 ? (
            <div
              className="flex flex-wrap items-start gap-6 border-t border-white/10 pt-8"
              style={{ fontFamily: 'var(--font-hero-dm), ui-monospace' }}
            >
              {editorialStats.map((stat, i) => (
                <React.Fragment key={`${stat.label}-${i}`}>
                  {i > 0 ? <span className="hidden h-10 w-px self-center bg-white/15 sm:block" style={{ backgroundColor: `color-mix(in srgb, ${primary} 35%, transparent)` }} /> : null}
                  <div className="min-w-[100px]">
                    <div className="text-2xl font-medium tabular-nums text-white md:text-3xl">
                      <span ref={(el) => { statValueRefs.current[i] = el; }}>0{stat.suffix ?? ''}</span>
                    </div>
                    <div className="mt-1 max-w-[11rem] text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">{stat.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative flex w-full flex-1 items-center justify-center lg:w-[45%] lg:min-h-[min(90vh,820px)]">
          <div className="relative aspect-[4/5] w-full max-w-[520px] lg:aspect-auto lg:h-[min(88vh,780px)] lg:max-w-none">
            {mediaItems[0] ? (
              <div
                ref={imgTopRef}
                className="absolute right-0 top-[4%] z-[1] w-[88%] overflow-hidden rounded-sm shadow-2xl opacity-0 lg:top-[6%]"
                style={{ border: `1px solid color-mix(in srgb, ${primary} 65%, transparent)` }}
              >
                <div className="relative aspect-[4/3] w-full rotate-2 lg:aspect-[5/4]">
                  <div className="absolute inset-0 -rotate-2 scale-105 overflow-hidden">
                    {renderMedia(mediaItems[0], 'h-full w-full object-cover')}
                  </div>
                </div>
              </div>
            ) : (
              <div ref={imgTopRef} className="pointer-events-none absolute h-px w-px opacity-0" aria-hidden />
            )}

            {mediaItems[1] ? (
              <div
                ref={imgBotRef}
                className="absolute bottom-[6%] left-0 z-[2] w-[82%] overflow-hidden rounded-sm shadow-2xl opacity-0 lg:bottom-[8%]"
              >
                <div className="relative aspect-[4/3] w-full lg:aspect-[5/4]">
                  {renderMedia(mediaItems[1], 'h-full w-full object-cover')}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>
              </div>
            ) : (
              <div ref={imgBotRef} className="pointer-events-none absolute bottom-[6%] left-0 z-[2] h-px w-px opacity-0" aria-hidden />
            )}

            {showGlassCard ? (
              <div
                ref={glassRef}
                className="absolute bottom-4 left-4 right-4 z-[3] max-w-[340px] overflow-hidden rounded-2xl border bg-black/45 opacity-0 backdrop-blur-md sm:left-6"
                style={{ borderColor: `color-mix(in srgb, ${primary} 55%, transparent)` }}
              >
                <div ref={glassFloatRef} className="p-4 sm:p-5">
                  {spotlight?.label ? (
                    <div className="mb-2 text-[9px] font-medium uppercase tracking-[0.3em] text-white/50">
                      <TiptapRenderer content={spotlight.label} as="inline" />
                    </div>
                  ) : projectsSection?.title ? (
                    <div className="mb-2 text-[9px] font-medium uppercase tracking-[0.3em] text-white/50">
                      <TiptapRenderer content={projectsSection.title} as="inline" />
                    </div>
                  ) : null}
                  <div className="text-lg font-semibold text-white">{spotlight?.projectName}</div>
                  {typeof spotlight?.rating === 'number' && spotlight.rating > 0 ? (
                    <div className="mt-2 text-sm" style={{ color: primary }} aria-label={`Rating ${spotlight.rating} of 5`}>
                      {'★'.repeat(Math.round(spotlight.rating))}
                    </div>
                  ) : null}
                  {spotlight?.completedLabel ? (
                    <div className="mt-2 text-xs text-white/50" style={{ fontFamily: 'var(--font-hero-dm), ui-monospace' }}>
                      {spotlight.completedLabel}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div ref={glassRef} className="pointer-events-none absolute h-0 w-0 opacity-0" aria-hidden>
                <div ref={glassFloatRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-px" style={{ backgroundColor: `color-mix(in srgb, ${primary} 55%, transparent)` }} />

      <style jsx global>{`
        .hero-kinetic-outline {
          -webkit-text-stroke: 1.5px var(--hero-accent);
          color: transparent;
        }
        @media (min-width: 768px) {
          .hero-kinetic-outline {
            -webkit-text-stroke-width: 2px;
          }
        }
      `}</style>
    </section>
  );
};
