'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ServicesSectionProps {
  servicesSection: Page['servicesSection'];
  className?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesSection, className }) => {
  const { services } = useWebBuilder();
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!servicesSection?.enabled) return null;

  const showcase = [
    'Kitchen Remodeling',
    'Bathroom Renovation',
    'Roofing',
    'Fire Restoration',
    'Water Damage Restoration',
    'Exterior Remodeling',
    'Interior Renovation',
    'Flooring',
    'Painting',
    'Full Home Remodeling',
  ];

  const list = services.length > 0 ? services : null;

  const brandColor = themeColors.primaryButton;

  return (
    <section
      className={cn('relative border-t border-white/5 py-16 md:py-24 lg:py-28 text-white', className)}
      style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a12 55%, #050508 100%)' }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* LEFT SIDE: STICKY HEADER & NAV */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
            <div className="space-y-6">
              <h2
                className="max-w-[18ch] text-balance text-3xl font-extralight uppercase leading-[1.02] tracking-[0.12em] text-white md:text-4xl lg:text-5xl"
                style={{ fontFamily: themeFonts.heading }}
              >
                <TiptapRenderer content={servicesSection.title} as="inline" />
              </h2>

              <div className="max-w-xs text-[11px] uppercase leading-relaxed tracking-[0.35em] text-white/55 md:text-xs">
                <TiptapRenderer content={servicesSection.description} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SCROLLABLE EDITORIAL GRID */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 lg:pt-4">
            {list
              ? list.map((service, idx) => {
                  const imageUrl = getImageSrc(service.thumbnailImage?.url || service.thumbnailImage);

                  return (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.65, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={`/service/${service.slug}`} className="group flex flex-col gap-8">
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1">
                          <OptimizedImage
                            src={imageUrl}
                            alt={service.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 35vw"
                            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                        </div>

                        <div className="space-y-5">
                          <div className="flex items-center gap-4">
                            <span className="text-[9px] font-medium uppercase tracking-widest text-white/35">
                              {new Date(service.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                            </span>
                          </div>

                          <h3
                            className="text-2xl font-light uppercase leading-tight tracking-[0.06em] text-white transition-opacity duration-300 group-hover:text-[color:var(--wb-primary)] md:text-3xl"
                            style={{ fontFamily: themeFonts.heading }}
                          >
                            {service.name}
                          </h3>

                          <div className="line-clamp-3 text-xs font-light leading-relaxed tracking-wide text-white/50 md:text-sm">
                            {typeof service.shortDescription === 'string' ? (
                              service.shortDescription
                            ) : (
                              service.shortDescription && <TiptapRenderer content={service.shortDescription} />
                            )}
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <span className="pb-1 text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
                              Explore
                            </span>
                            <div className="h-[1px] w-8 transition-all group-hover:w-14" style={{ backgroundColor: brandColor }} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              : showcase.map((name, idx) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="group flex flex-col gap-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 backdrop-blur-xl transition-colors hover:border-[color:var(--wb-primary)]/40"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Signature</div>
                    <h3 className="text-xl font-light uppercase tracking-[0.08em] text-white md:text-2xl" style={{ fontFamily: themeFonts.heading }}>
                      {name}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-white/45">Configure this service in your builder to link detail pages.</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
