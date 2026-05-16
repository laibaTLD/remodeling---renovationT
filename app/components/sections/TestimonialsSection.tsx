'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { ArrowLeft, ArrowRight, Sparkles, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonialsSection: Page['testimonialsSection'];
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonialsSection,
  className,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const items = useMemo(
    () => testimonialsSection?.testimonials?.filter(Boolean) || [],
    [testimonialsSection?.testimonials]
  );

  const brandColor =
    themeColors.primaryButton ||
    themeColors.mainText ||
    themeColors.lightPrimaryText;

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;

    const target = track.querySelector<HTMLElement>(
      `[data-testimonial-index="${idx}"]`
    );

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const scrollByCard = (direction: -1 | 1) => {
    const next = Math.max(
      0,
      Math.min(items.length - 1, activeIndex + direction)
    );

    scrollToIndex(next);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const handler = () => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>('[data-testimonial-index]')
      );

      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;

      let closest = 0;
      let distance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = Math.abs(cardCenter - center);

        if (diff < distance) {
          distance = diff;
          closest = Number(card.dataset.testimonialIndex || 0);
        }
      });

      setActiveIndex(closest);
    };

    handler();

    track.addEventListener('scroll', handler, { passive: true });

    return () => {
      track.removeEventListener('scroll', handler);
    };
  }, [items.length]);

  if (!testimonialsSection?.enabled || items.length === 0) return null;

  return (
    <section
      className={cn(
        'relative overflow-hidden py-16',
        className
      )}
      style={{
        backgroundColor: themeColors.pageBackground,
        fontFamily: themeFonts.body,
      }}
    >
      {/* Ambient Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${themeColors.mainText} 1px, transparent 1px),
            linear-gradient(to bottom, ${themeColors.mainText} 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      <div
        className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{
          background: `color-mix(in srgb, ${brandColor} 18%, transparent)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] backdrop-blur-xl"
              style={{
                borderColor: `color-mix(in srgb, ${brandColor} 18%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${brandColor} 6%, transparent)`,
                color: brandColor,
              }}
            >
              <Sparkles size={12} />
              Client Stories
            </div>

            {testimonialsSection.title && (
              <h2
                className="text-balance text-[clamp(2.5rem,6vw,6rem)] font-extralight uppercase leading-[0.95] tracking-[0.08em]"
                style={{
                  color: themeColors.mainText,
                  fontFamily: themeFonts.heading,
                }}
              >
                <TiptapRenderer
                  content={testimonialsSection.title}
                  as="inline"
                />
              </h2>
            )}

            {testimonialsSection.description && (
              <div
                className="mt-6 max-w-xl text-sm font-light leading-relaxed tracking-wide md:text-base"
                style={{
                  color: themeColors.secondaryText,
                  fontFamily: themeFonts.body,
                }}
              >
                <TiptapRenderer content={testimonialsSection.description} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              className="group flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 hover:-translate-x-1"
              style={{
                borderColor: `color-mix(in srgb, ${themeColors.mainText} 10%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${themeColors.cardBackground} 72%, transparent)`,
              }}
            >
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
                style={{ color: themeColors.mainText }}
              />
            </button>

            <div
              className="min-w-[90px] text-center text-xs font-medium tracking-[0.3em]"
              style={{ color: themeColors.secondaryText }}
            >
              <span style={{ color: themeColors.mainText }}>
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="mx-2 opacity-30">/</span>
              <span className="opacity-60">
                {String(items.length).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => scrollByCard(1)}
              className="group flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 hover:translate-x-1"
              style={{
                borderColor: `color-mix(in srgb, ${themeColors.mainText} 10%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${themeColors.cardBackground} 72%, transparent)`,
              }}
            >
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: themeColors.mainText }}
              />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 no-scrollbar md:gap-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((testimonial, idx) => {
            const isActive = idx === activeIndex;

            return (
              <article
                key={`${testimonial.name}-${idx}`}
                data-testimonial-index={idx}
                className={cn(
                  'group relative min-w-[92%] snap-center overflow-hidden rounded-[2rem] border transition-all duration-700 md:min-w-[70%] xl:min-w-[58%]',
                  isActive
                    ? 'scale-100 opacity-100'
                    : 'scale-[0.96] opacity-40'
                )}
                style={{
                  backgroundColor: themeColors.cardBackground,
                  borderColor: isActive
                    ? `color-mix(in srgb, ${brandColor} 20%, transparent)`
                    : `color-mix(in srgb, ${themeColors.mainText} 8%, transparent)`,
                  boxShadow: isActive
                    ? `0 40px 120px -60px ${brandColor}`
                    : 'none',
                }}
              >
                {/* Decorative Glow */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px]"
                  style={{
                    background: `color-mix(in srgb, ${brandColor} 18%, transparent)`,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 600ms ease',
                  }}
                />

                <div className="relative flex h-full flex-col justify-between p-8 md:p-12 lg:p-14">
                  {/* Top */}
                  <div>
                    <div className="mb-10 flex items-center justify-between">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-xl"
                        style={{
                          borderColor: `color-mix(in srgb, ${brandColor} 18%, transparent)`,
                          backgroundColor: `color-mix(in srgb, ${brandColor} 8%, transparent)`,
                        }}
                      >
                        <Quote
                          size={22}
                          style={{ color: brandColor }}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.35em]"
                        style={{
                          color: themeColors.secondaryText,
                        }}
                      >
                        Testimonial
                      </div>
                    </div>

                    {/* Text */}
                    <div
                      className="text-xl leading-[1.8] md:text-2xl lg:text-[1.75rem]"
                      style={{
                        color: themeColors.mainText,
                        fontFamily: themeFonts.body,
                        fontWeight: 300,
                      }}
                    >
                      <TiptapRenderer content={testimonial.text} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="mt-14 flex items-end justify-between gap-6 border-t pt-8"
                    style={{
                      borderColor: `color-mix(in srgb, ${themeColors.mainText} 8%, transparent)`,
                    }}
                  >
                    <div>
                      <h4
                        className="text-sm uppercase tracking-[0.28em]"
                        style={{
                          color: brandColor,
                          fontFamily: themeFonts.heading,
                        }}
                      >
                        {testimonial.name}
                      </h4>

                      {(testimonial.role || testimonial.company) && (
                        <p
                          className="mt-2 text-xs uppercase tracking-[0.18em]"
                          style={{
                            color: themeColors.secondaryText,
                          }}
                        >
                          {testimonial.role}
                          {testimonial.role && testimonial.company && (
                            <span className="mx-2 opacity-40">•</span>
                          )}
                          {testimonial.company}
                        </p>
                      )}
                    </div>

                    {/* Active Dot */}
                    <div className="flex items-center gap-2">
                      {items.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          aria-label={`Go to testimonial ${dotIdx + 1}`}
                          onClick={() => scrollToIndex(dotIdx)}
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: activeIndex === dotIdx ? '40px' : '8px',
                            backgroundColor:
                              activeIndex === dotIdx
                                ? brandColor
                                : `color-mix(in srgb, ${themeColors.mainText} 16%, transparent)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;