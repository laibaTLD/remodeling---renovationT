'use client';

import React, { useMemo } from 'react';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ServingAreasSectionProps {
  enabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
  serviceSlug?: string;
}

export const ServingAreasSection: React.FC<ServingAreasSectionProps> = ({
  enabled = true,
  title,
  description,
  className,
  serviceSlug = '',
}) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site, services } = useWebBuilder();

  const areas = useMemo(() => {
    // First try to get from site.serviceAreas
    if (site?.serviceAreas && Array.isArray(site.serviceAreas) && site.serviceAreas.length > 0) {
      return site.serviceAreas.filter(Boolean);
    }
    // Fallback: extract unique cities from services
    if (services && Array.isArray(services) && services.length > 0) {
      const serviceAreas = services
        .filter((s: any) => s.serviceAreas && Array.isArray(s.serviceAreas))
        .flatMap((s: any) => s.serviceAreas)
        .map((a: any) => typeof a === 'string' ? a : a.city)
        .filter(Boolean);
      return [...new Set(serviceAreas)];
    }
    return [];
  }, [site?.serviceAreas, services]);

  if (!enabled) return null;

  const resolvedTitle = title?.trim() || site?.name?.trim() || '';
  const resolvedDescription = description?.trim() || '';

  const brandColor = themeColors.primaryButton;

  return (
    <section
      className={cn('py-24 md:py-32 lg:py-48 border-t border-black/5', className)}
      style={{ backgroundColor: themeColors.pageBackground, fontFamily: themeFonts.body }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-20 lg:gap-24 items-start">

          {/* LEFT SIDE: STICKY HEADER */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-10">
            <div className="space-y-6">
              {site?.business?.tagline?.trim() && (
              <span
                className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-30"
                style={{ color: themeColors.mainText }}
              >
                {site.business.tagline.trim()}
              </span>
              )}

              {resolvedTitle && (
              <h2
                className="text-3xl md:text-4xl lg:text-6xl font-extralight tracking-[0.1em] uppercase leading-[1.1] text-balance"
                style={{
                  color: themeColors.mainText,
                  fontFamily: themeFonts.heading
                }}
              >
                {resolvedTitle}
              </h2>
              )}
            </div>

            {resolvedDescription ? (
            <div
              className="max-w-xs text-xs md:text-sm font-light leading-relaxed tracking-wider opacity-60 uppercase"
              style={{ color: themeColors.secondaryText }}
            >
              {resolvedDescription}
            </div>
            ) : null}

            {/* Signature Brand Detail */}
            <div className="pt-8">
              <div className="w-16 h-[2px]" style={{ backgroundColor: brandColor }} />
            </div>
          </div>

          {/* RIGHT SIDE: EDITORIAL LIST OF LOCATIONS */}
          <div className="lg:col-span-8">
            {areas.length === 0 ? (
              <div className="text-center py-12">
                <p 
                  className="text-lg"
                  style={{ color: themeColors.mainText, fontFamily: themeFonts.body }}
                >
                  No service areas configured yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-black/10">
                {areas.map((area, idx) => {
                  const areaName = typeof area === 'string' ? area : (area?.city ?? String(area));
                  const areaSlug = areaName.toLowerCase().replace(/[,\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  const linkPath = serviceSlug ? `/service/${serviceSlug}/service-area/${areaSlug}` : `/service-area/${areaSlug}`;
                  return (
                    <Link
                      key={`${areaName}-${idx}`}
                      href={linkPath}
                      className={cn(
                        "group relative border-b border-black/10 py-12 md:py-16 transition-all duration-300 cursor-pointer hover:shadow-lg no-underline",
                        idx % 2 === 0 ? "md:border-r md:pr-12 lg:pr-16" : "md:pl-12 lg:pl-16 font-light"
                      )}
                    >
                      <div className="flex flex-col gap-6">
                        {/* Indexing Number */}
                        <span
                          className="text-[10px] font-bold tracking-[0.2em] opacity-20 transition-all duration-500 group-hover:opacity-100"
                          style={{ color: brandColor }}
                        >
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="flex items-center justify-between gap-4">
                          <span
                            className="flex-1 text-xl md:text-2xl lg:text-3xl font-extralight tracking-[0.05em] uppercase transition-all duration-500 group-hover:italic group-hover:translate-x-2"
                            style={{
                              color: themeColors.mainText,
                              fontFamily: themeFonts.heading
                            }}
                          >
                            {areaName}
                          </span>
                          <ArrowRight
                            size={20}
                            className="shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700"
                            style={{ color: brandColor }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};