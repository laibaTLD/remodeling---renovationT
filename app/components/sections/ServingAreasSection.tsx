'use client';

import React, { useMemo } from 'react';
import { Page } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface ServingAreasSectionProps {
  servingAreasSection?: Page['servingAreasSection'];
  className?: string;
}

export const ServingAreasSection: React.FC<ServingAreasSectionProps> = ({ 
  servingAreasSection, 
  className 
}) => {
  const enabled = servingAreasSection?.enabled ?? true;

  const title =
    typeof servingAreasSection?.title === 'string'
      ? servingAreasSection.title
      : undefined;

  const description =
    typeof servingAreasSection?.description === 'string'
      ? servingAreasSection.description
      : undefined;

  const serviceSlug = servingAreasSection?.serviceSlug ?? '';

  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const { site, services } = useWebBuilder();

  const areas = useMemo(() => {
    if (
      site?.serviceAreas &&
      Array.isArray(site.serviceAreas) &&
      site.serviceAreas.length > 0
    ) {
      return site.serviceAreas.filter(Boolean);
    }

    if (
      services &&
      Array.isArray(services) &&
      services.length > 0
    ) {
      const serviceAreas = services
        .filter(
          (s: any) =>
            s.serviceAreas &&
            Array.isArray(s.serviceAreas)
        )
        .flatMap((s: any) => s.serviceAreas)
        .map((a: any) =>
          typeof a === 'string' ? a : a.city
        )
        .filter(Boolean);

      return [...new Set(serviceAreas)];
    }

    return [];
  }, [site?.serviceAreas, services]);

  if (!enabled) return null;

  const resolvedTitle = title?.trim() || 'Areas We Serve';
  const resolvedDescription = description?.trim() || '';
  const brandColor = themeColors.primaryButton || themeColors.mainText;

  return (
    <section
      className={cn('relative overflow-hidden', className)}
      style={{
        backgroundColor: themeColors.pageBackground,
        fontFamily: themeFonts.body
      }}
    >
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        
        {/* Short & Cute Header Section */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-14 md:mb-16">
          <div 
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium tracking-wider uppercase backdrop-blur-md"
            style={{ 
              backgroundColor: `${brandColor}08`, 
              color: brandColor,
              fontFamily: themeFonts.body
            }}
          >
            <MapPin size={16} style={{ color: brandColor }} />
            <span style={{ fontFamily: themeFonts.body }}>Coverage</span>
          </div>

          {resolvedTitle && (
            <h2
              className="text-3xl md:text-8xl lg:text-8xl font-medium tracking-tight"
              style={{
                color: themeColors.mainText,
                fontFamily: themeFonts.heading
              }}
            >
              {resolvedTitle}
            </h2>
          )}

          {resolvedDescription && (
            <p
              className="max-w-lg mx-auto text-sm md:text-base lg:text-lg leading-relaxed opacity-75 font-light"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body
              }}
            >
              {resolvedDescription}
            </p>
          )}
        </div>

        {/* Areas Cluster Layout */}
        {areas.length === 0 ? (
          <div
            className="inline-block px-6 py-4 rounded-xl text-center backdrop-blur-sm"
            style={{
              backgroundColor: `${themeColors.cardBackground}40`,
              border: `1px solid ${themeColors.inactive}15`
            }}
          >
            <p
              className="text-[10px] md:text-base font-light tracking-wide"
              style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
            >
              No active hubs configured at this time.
            </p>
          </div>
        ) : areas.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4.5 md:gap-5 max-w-3xl mx-auto">
            {areas.map((area, idx) => {
              const areaName = typeof area === 'string' ? area : area?.city ?? String(area);
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
                  className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-full no-underline transition-all duration-300 ease-out hover:scale-[1.03] active:scale-95"
                  style={{
                    backgroundColor: `${themeColors.cardBackground}70`,
                    color: themeColors.mainText,
                    boxShadow: '0 2px 8px -4px rgba(0,0,0,0.04)',
                    fontFamily: themeFonts.body
                  }}
                >
                  {/* Subtle hover background accent overlay */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: `${brandColor}06` }}
                  />

                  {/* Tiny Cute Index Indicator */}
                  <span 
                    className="text-[16px] md:text-[9px] font-bold tracking-tight opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: brandColor, fontFamily: themeFonts.body }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Location Title */}
                  <span
                    className="text-base md:text-lg lg:text-xl font-medium tracking-wide group-hover:translate-x-[1px] transition-transform duration-300"
                    style={{ fontFamily: themeFonts.heading }}
                  >
                    {areaName}
                  </span>

                  {/* Cute internal arrow tag entry */}
                  <span 
                    className="text-sm opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-light"
                    style={{ color: brandColor, fontFamily: themeFonts.body }}
                  >
                    ↗
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServingAreasSection;