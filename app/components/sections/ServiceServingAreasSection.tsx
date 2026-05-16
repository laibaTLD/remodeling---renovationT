'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { cn, TIPTAP_INHERIT } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { MapPin } from 'lucide-react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';

interface ServiceServingAreasSectionProps {
  service: any;
  className?: string;
}

function resolveServiceSlug(service: any): string {
  if (typeof service?.slug === 'string' && service.slug.trim()) {
    return String(service.slug)
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  return String(service?.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function resolveAreaDisplay(area: unknown): { areaName: string; areaSlug: string } {
  const cityName = typeof area === 'string' ? area : (area as { city?: string })?.city ?? String(area);
  const regionName =
    typeof area === 'string' ? '' : ((area as { region?: string })?.region || '');
  const areaSlug = regionName
    ? `${String(cityName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${String(regionName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    : String(cityName)
        .toLowerCase()
        .replace(/[,\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
  const areaName = `${cityName}${regionName ? `, ${regionName}` : ''}`;
  return { areaName, areaSlug };
}

export const ServiceServingAreasSection: React.FC<ServiceServingAreasSectionProps> = ({
  service,
  className,
}) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  const areas = useMemo(() => {
    const serviceAreas = service?.serviceAreas || [];
    const siteAreas = Array.isArray(site?.serviceAreas)
      ? site!.serviceAreas.filter(Boolean)
      : [];
    return Array.isArray(serviceAreas) && serviceAreas.length > 0 ? serviceAreas : siteAreas;
  }, [service?.serviceAreas, site?.serviceAreas]);

  const serviceSlug = resolveServiceSlug(service);
  const brandColor = themeColors.primaryButton || themeColors.mainText;

  const resolvedTitle = service?.name
    ? `Serving ${service.name} Areas`
    : 'Areas We Serve';

  const shortDesc = service?.shortDescription;
  const hasShortDesc =
    typeof shortDesc === 'string'
      ? shortDesc.trim().length > 0
      : Boolean(shortDesc && typeof shortDesc === 'object');

  if (areas.length === 0) return null;

  return (
    <section
      className={cn('relative overflow-hidden', className)}
      style={{
        backgroundColor: themeColors.pageBackground,
        fontFamily: themeFonts.body,
      }}
    >
      <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
        <div className="mb-14 flex flex-col items-center justify-center space-y-4 md:mb-16">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium uppercase tracking-wider backdrop-blur-md"
            style={{
              backgroundColor: `${brandColor}08`,
              color: brandColor,
              border: `1px solid ${brandColor}15`,
              fontFamily: themeFonts.body,
            }}
          >
            <MapPin size={16} style={{ color: brandColor }} />
            <span style={{ fontFamily: themeFonts.body }}>Coverage</span>
          </div>

          <h2
            className="text-3xl font-medium tracking-tight md:text-8xl lg:text-8xl"
            style={{
              color: themeColors.mainText,
              fontFamily: themeFonts.heading,
            }}
          >
            {resolvedTitle}
          </h2>

          {hasShortDesc && (
            <div
              className="mx-auto max-w-lg text-sm font-light leading-relaxed opacity-75 md:text-base lg:text-lg"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body,
              }}
            >
              {typeof shortDesc === 'string' ? (
                shortDesc
              ) : (
                <TiptapRenderer content={shortDesc} className={TIPTAP_INHERIT} />
              )}
            </div>
          )}
        </div>

        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4.5 md:gap-5">
          {areas.map((area, idx) => {
            const { areaName, areaSlug } = resolveAreaDisplay(area);
            const linkPath = serviceSlug
              ? `/service/${serviceSlug}/service-areas/${areaSlug}`
              : `/service-area/${areaSlug}`;

            return (
              <Link
                key={`${areaName}-${idx}`}
                href={linkPath}
                className="group relative inline-flex items-center gap-3 rounded-full px-6 py-3.5 no-underline transition-all duration-300 ease-out hover:scale-[1.03] active:scale-95"
                style={{
                  backgroundColor: `${themeColors.cardBackground}70`,
                  color: themeColors.mainText,
                  border: `1px solid ${themeColors.inactive}15`,
                  boxShadow: '0 2px 8px -4px rgba(0,0,0,0.04)',
                  fontFamily: themeFonts.body,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: `${brandColor}06` }}
                />
                <span
                  className="text-[16px] font-bold tracking-tight opacity-40 transition-opacity duration-300 group-hover:opacity-100 md:text-[9px]"
                  style={{ color: brandColor, fontFamily: themeFonts.body }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-base font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-[1px] md:text-lg lg:text-xl"
                  style={{ fontFamily: themeFonts.heading }}
                >
                  {areaName}
                </span>
                <span
                  className="text-sm font-light opacity-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: brandColor, fontFamily: themeFonts.body }}
                >
                  ↗
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceServingAreasSection;
