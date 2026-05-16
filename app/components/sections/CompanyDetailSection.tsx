'use client';

import React, {
  useEffect,
  useRef
} from 'react';

import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import {
  cn,
  getImageSrc,
  TIPTAP_INHERIT,
  type SectionSurfaceTone
} from '@/app/lib/utils';

import { OptimizedImage } from '@/app/components/ui/OptimizedImage';

import {
  useThemeColors,
  useThemeFonts
} from '@/app/hooks/useTheme';

import { usePrefersReducedMotion } from '@/app/hooks/usePrefersReducedMotion';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import {
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CompanyDetailSectionProps {
  companyDetailSection: Page['companyDetailSection'];
  className?: string;
}

function sectionBgCssVar(
  tone: SectionSurfaceTone
) {
  return tone === 'light'
    ? 'var(--wb-section-bg-light)'
    : 'var(--wb-section-bg-dark)';
}

function resolveDetailImageRaw(
  detail: {
    image?:
      | string
      | {
          url?: string;
          altText?: string;
        };
    imageUrl?: string;
  }
): string | undefined {
  const img = detail?.image;

  if (
    typeof img === 'string' &&
    img.trim()
  )
    return img;

  if (
    img &&
    typeof img === 'object' &&
    img.url
  )
    return img.url;

  if (
    detail?.imageUrl?.trim()
  )
    return detail.imageUrl;

  return undefined;
}

function getDetailImageSrc(
  detail: Parameters<
    typeof resolveDetailImageRaw
  >[0]
): string {
  const raw =
    resolveDetailImageRaw(detail);

  return raw
    ? getImageSrc(raw)
    : '';
}

function getDetailImageAlt(
  detail: Parameters<
    typeof resolveDetailImageRaw
  >[0],
  fallback?: string
): string {
  const img = detail?.image;

  if (
    img &&
    typeof img === 'object' &&
    img.altText
  )
    return img.altText;

  return fallback || '';
}

export const CompanyDetailSection: React.FC<
  CompanyDetailSectionProps
> = ({
  companyDetailSection,
  className
}) => {
  const themeColors =
    useThemeColors();

  const themeFonts =
    useThemeFonts();

  const reducedMotion =
    usePrefersReducedMotion();

  const brandColor =
    themeColors.primaryButton;

  const sectionBgVar =
    sectionBgCssVar('light');

  const rootRef =
    useRef<HTMLElement>(null);

  const stepRefs = useRef<
    (HTMLDivElement | null)[]
  >([]);

  const details =
    companyDetailSection?.details?.filter(
      Boolean
    ) ?? [];

  useEffect(() => {
    if (
      !companyDetailSection?.enabled ||
      !rootRef.current ||
      reducedMotion
    )
      return;

    const ctx = gsap.context(() => {
      stepRefs.current.forEach(
        (step, index) => {
          if (!step) return;

          const media =
            step.querySelector(
              '[data-media]'
            );

          const content =
            step.querySelector(
              '[data-content]'
            );

          gsap.fromTo(
            step,
            {
              opacity: 0,
              y: 80
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 82%'
              }
            }
          );

          if (media) {
            gsap.fromTo(
              media,
              {
                scale: 1.08,
                opacity: 0
              },
              {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 80%'
                }
              }
            );
          }

          if (content) {
            gsap.fromTo(
              content.children,
              {
                opacity: 0,
                y: 24
              },
              {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 84%'
                }
              }
            );
          }
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [
    companyDetailSection?.enabled,
    reducedMotion
  ]);

  if (
    !companyDetailSection?.enabled
  )
    return null;

  if (details.length === 0) {
    return (
      <section
        className={cn(
          'py-24',
          className
        )}
        style={{
          backgroundColor:
            themeColors.pageBackground
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <p
            className="text-sm font-light"
            style={{
              color:
                themeColors.secondaryText,
              fontFamily:
                themeFonts.body
            }}
          >
            Add company details
            inside the builder to
            populate this section.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={cn(
        'relative overflow-hidden py-24 md:py-32 lg:py-40',
        className
      )}
      style={{
        backgroundColor:
          themeColors.pageBackground,
        fontFamily:
          themeFonts.body
      }}
    >
      {/* Ambient Glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full blur-[140px] opacity-[0.08]"
        style={{
          backgroundColor:
            brandColor
        }}
      />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mb-20 lg:mb-28">
          <div className="mb-7 flex items-center gap-5">
            <div
              className="h-px w-14"
              style={{
                background:
                  brandColor
              }}
            />

            <span
              className="text-[11px] uppercase tracking-[0.4em] font-semibold"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body
              }}
            >
              Process
            </span>
          </div>

          {companyDetailSection.title && (
            <h2
              className="text-[clamp(2.5rem,6vw,6rem)] font-extralight uppercase leading-[0.95] tracking-[-0.04em]"
              style={{
                color:
                  themeColors.mainText,
                fontFamily:
                  themeFonts.heading
              }}
            >
              <TiptapRenderer
                content={
                  companyDetailSection.title
                }
                as="inline"
                className={
                  TIPTAP_INHERIT
                }
              />
            </h2>
          )}

          {companyDetailSection.description && (
            <div
              className="mt-2 max-w-2xl text-sm md:text-base lg:text-lg font-light leading-relaxed"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body
              }}
            >
              <TiptapRenderer
                content={
                  companyDetailSection.description
                }
                className={
                  TIPTAP_INHERIT
                }
              />
            </div>
          )}
        </div>

        {/* Timeline Grid */}
        <div className="space-y-24 lg:space-y-32">
          {details.map(
            (detail, idx) => {
              const title =
                detail.title ??
                detail.label;

              const body =
                detail.description ??
                detail.value;

              const imageSrc =
                getDetailImageSrc(
                  detail
                );

              const imageAlt =
                getDetailImageAlt(
                  detail,
                  typeof title ===
                    'string'
                    ? title
                    : `Step ${idx + 1}`
                );

              const isReverse =
                idx % 2 !== 0;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    stepRefs.current[
                      idx
                    ] = el;
                  }}
                  className={cn(
                    'grid items-center gap-12 lg:gap-20',
                    imageSrc
                      ? 'lg:grid-cols-2'
                      : 'max-w-3xl'
                  )}
                >
                  {/* Image Side */}
                  {imageSrc && (
                    <div
                      data-media
                      className={cn(
                        'relative',
                        isReverse
                          ? 'lg:order-2'
                          : ''
                      )}
                    >
                      <div
                        className="absolute -inset-5 rounded-[2rem] opacity-40 blur-3xl"
                        style={{
                          background: `radial-gradient(circle, color-mix(in srgb, ${brandColor} 28%, transparent) 0%, transparent 70%)`
                        }}
                      />

                      <div
                        className="relative aspect-[4/5] overflow-hidden border backdrop-blur-xl"
                        style={{
                          borderColor: `${themeColors.inactive}20`,
                          backgroundColor: `${themeColors.cardBackground}60`,
                          boxShadow: `0 40px 120px color-mix(in srgb, ${sectionBgVar} 65%, transparent)`
                        }}
                      >
                        <OptimizedImage
                          src={
                            imageSrc
                          }
                          alt={
                            imageAlt
                          }
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-[1800ms] ease-out hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                        {/* Floating Number */}
                        <div
                          className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center border backdrop-blur-xl"
                          style={{
                            borderColor:
                              'rgba(255,255,255,0.08)',
                            backgroundColor:
                              'rgba(0,0,0,0.25)'
                          }}
                        >
                          <span className="text-white text-lg font-light tracking-[0.15em]">
                            {String(
                              idx + 1
                            ).padStart(
                              2,
                              '0'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div
                    data-content
                    className={cn(
                      'relative',
                      isReverse
                        ? 'lg:order-1'
                        : ''
                    )}
                  >
                    {/* Number */}
                    <div
                      className="mb-2 text-[clamp(2.5rem,6vw,6rem)] font-extralight leading-none"
                      style={{
                        color: `color-mix(in srgb, ${themeColors.mainText} 14%, transparent)`,
                        fontFamily:
                          themeFonts.heading
                      }}
                    >
                      {String(
                        idx + 1
                      ).padStart(
                        2,
                        '0'
                      )}
                    </div>

                    {/* Label */}
                    <div
                      className="mb-4 inline-flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-px"
                        style={{
                          backgroundColor:
                            brandColor
                        }}
                      />

                      <span
                        className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                        style={{
                          color: themeColors.secondaryText,
                          fontFamily: themeFonts.body
                        }}
                      >
                        {detail.label ||
                          `Step ${idx + 1}`}
                      </span>
                    </div>

                    {/* Title */}
                    {title && (
                      <h3
                        className="max-w-xl text-3xl md:text-5xl font-extralight uppercase leading-[1] tracking-[-0.03em]"
                        style={{
                          color:
                            themeColors.mainText,
                          fontFamily:
                            themeFonts.heading
                        }}
                      >
                        <TiptapRenderer
                          content={
                            title
                          }
                          as="inline"
                          className={
                            TIPTAP_INHERIT
                          }
                        />
                      </h3>
                    )}

                    {/* Body */}
                    {body && (
                      <div
                        className="mt-7 max-w-xl text-sm md:text-base lg:text-lg font-light leading-relaxed"
                        style={{
                          color: themeColors.secondaryText,
                          fontFamily: themeFonts.body
                        }}
                      >
                        <TiptapRenderer
                          content={
                            body
                          }
                          className={
                            TIPTAP_INHERIT
                          }
                        />
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-10 flex items-center gap-4">
                      <div
                        className="w-14 h-[1px]"
                        style={{
                          backgroundColor:
                            brandColor
                        }}
                      />

                      <div
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] font-semibold"
                        style={{
                          color: brandColor,
                          fontFamily: themeFonts.body
                        }}
                      >
                        Explore

                        <ArrowUpRight
                          size={14}
                        />
                      </div>
                    </div>

                    {/* Decorative Card */}
                    <div
                      className="mt-12 inline-flex items-center gap-4 border px-5 py-4 backdrop-blur-xl"
                      style={{
                        borderColor: `${themeColors.inactive}20`,
                        backgroundColor: `${themeColors.cardBackground}55`
                      }}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${brandColor} 16%, transparent)`
                        }}
                      >
                        <Sparkles
                          size={16}
                          style={{
                            color:
                              brandColor
                          }}
                        />
                      </div>

                      <div>
                        <p
                          className="text-[10px] uppercase tracking-[0.3em] font-semibold"
                          style={{
                            color: themeColors.secondaryText,
                            fontFamily: themeFonts.body
                          }}
                        >
                          Premium Detail
                        </p>

                        <p
                          className="mt-1 text-sm font-light"
                          style={{
                            color: themeColors.mainText,
                            fontFamily: themeFonts.body
                          }}
                        >
                          Crafted with
                          precision &
                          modern design
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};

export default CompanyDetailSection;