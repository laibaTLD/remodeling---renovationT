'use client';

import React, { useMemo } from 'react';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';

interface ServiceServingAreasSectionProps {
  service: any;
  className?: string;
}

export const ServingAreas: React.FC<ServiceServingAreasSectionProps> = ({ service, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  const areas = useMemo(() => {
    let siteAreas: any[] = [];
    let serviceAreas: any[] = [];

    if (Array.isArray(site?.serviceAreas)) {
      siteAreas = site.serviceAreas.filter(Boolean);
    }

    if (service?.serviceAreas && Array.isArray(service.serviceAreas)) {
      serviceAreas = service.serviceAreas;
    } else if (service?.areas && Array.isArray(service.areas)) {
      serviceAreas = service.areas;
    } else if (Array.isArray(service)) {
      serviceAreas = service;
    }

    const finalAreas = serviceAreas.length > 0 ? serviceAreas : siteAreas;

    return finalAreas.map((area) => {
      if (typeof area === 'string') {
        return area.trim();
      }
      return area;
    });
  }, [service, site?.serviceAreas]);

  if (areas.length === 0) {
    return (
      <div className="py-16 text-center" style={{ color: themeColors.lightPrimaryText }}>
        No service areas available
      </div>
    );
  }

  const serviceSlug =
    typeof service?.slug === 'string' && service.slug.trim()
      ? String(service.slug)
          .trim()
          .toLowerCase()
          .replace(/^\/+|\/+$/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : service?.name
        ? String(service.name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        : 'service';

  const resolvedTitle = service?.name ? `Serving ${service.name} areas` : site?.name ? `${site.name} service areas` : 'Service areas';
  const shortDesc = service?.shortDescription;
  const hasShortDesc =
    typeof shortDesc === 'string' ? shortDesc.trim().length > 0 : Boolean(shortDesc && typeof shortDesc === 'object');

  const brandColor = themeColors.primaryButton;

  return (
    <section
      className={cn('py-24 md:py-32 lg:py-48 border-t border-black/5', className)}
      style={{ backgroundColor: themeColors.pageBackground, fontFamily: themeFonts.body }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-20 lg:gap-24 items-start">
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

              <h2
                className="text-3xl md:text-4xl lg:text-6xl font-extralight tracking-[0.1em] uppercase leading-[1.1] text-balance"
                style={{
                  color: themeColors.mainText,
                  fontFamily: themeFonts.heading,
                }}
              >
                {resolvedTitle}
              </h2>
            </div>

            {hasShortDesc && (
              <div
                className="max-w-xs text-xs md:text-sm font-light leading-relaxed tracking-wider opacity-60 uppercase"
                style={{ color: themeColors.secondaryText }}
              >
                {typeof shortDesc === 'string' ? (
                  shortDesc
                ) : (
                  <TiptapRenderer content={shortDesc} as="inline" />
                )}
              </div>
            )}

            <div className="pt-8">
              <div className="w-16 h-[2px]" style={{ backgroundColor: brandColor }} />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-black/10">
              {areas.map((area, idx) => {
                const areaName = typeof area === 'string' ? area : area.city;
                const areaSlug = areaName
                  .toLowerCase()
                  .replace(/[,\s]+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
                const linkPath = serviceSlug
                  ? `/service/${serviceSlug}/service-area/${areaSlug}`
                  : `/service-area/${areaSlug}`;
                return (
                  <Link
                    key={`${areaName}-${idx}`}
                    href={linkPath}
                    className={cn(
                      'group relative border-b border-black/10 py-12 md:py-16 transition-all duration-300 cursor-pointer hover:shadow-lg no-underline',
                      idx % 2 === 0 ? 'md:border-r md:pr-12 lg:pr-16' : 'md:pl-12 lg:pl-16 font-light'
                    )}
                  >
                    <div className="flex flex-col gap-6">
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
                            fontFamily: themeFonts.heading,
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
          </div>
        </div>
      </div>
    </section>
  );
};
