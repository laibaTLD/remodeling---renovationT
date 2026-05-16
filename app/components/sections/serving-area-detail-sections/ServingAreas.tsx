'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn, TIPTAP_INHERIT } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { tiptapToText } from '@/app/lib/seo';
import {
  buildAreaSlugCandidates,
  getAreaCity,
  getAreaDisplayName,
  getServiceAreaPageHref,
  resolveServiceSlug,
} from '@/app/lib/serviceAreaSlugs';
import { MapPin } from 'lucide-react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';

interface ServingAreasProps {
  service?: any;
  className?: string;
}

function resolveTextField(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') return tiptapToText(value).trim();
  return '';
}

function resolveAreasFromProp(service: any, site: any): unknown[] {
  if (Array.isArray(service?.areas) && service.areas.length > 0) {
    return service.areas.filter(Boolean);
  }
  if (Array.isArray(service?.serviceAreas) && service.serviceAreas.length > 0) {
    return service.serviceAreas.filter(Boolean);
  }
  if (Array.isArray(service) && service.length > 0) {
    return service.filter(Boolean);
  }
  if (Array.isArray(site?.serviceAreas) && site.serviceAreas.length > 0) {
    return site.serviceAreas.filter(Boolean);
  }
  return [];
}

export const ServingAreas: React.FC<ServingAreasProps> = ({ service, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site, serviceAreaPages } = useWebBuilder();
  const params = useParams();
  const serviceSlugFromUrl =
    typeof params?.serviceSlug === 'string' ? params.serviceSlug : '';

  const enabled = service?.enabled ?? true;

  const areas = useMemo(
    () => resolveAreasFromProp(service, site),
    [service, site?.serviceAreas]
  );

  const serviceSlug = useMemo(() => {
    if (serviceSlugFromUrl) return resolveServiceSlug({ slug: serviceSlugFromUrl });
    if (typeof service?.serviceSlug === 'string' && service.serviceSlug.trim()) {
      return resolveServiceSlug({ slug: service.serviceSlug });
    }
    if (service?.serviceId?.slug) {
      return resolveServiceSlug({ slug: service.serviceId.slug });
    }
    if (service?.slug || service?.name) return resolveServiceSlug(service);
    return '';
  }, [service, serviceSlugFromUrl]);

  const resolvedTitle = useMemo(() => {
    const fromSection = resolveTextField(service?.title);
    if (fromSection) return fromSection;
    if (service?.name) return `Serving ${service.name} Areas`;
    return 'Areas We Serve';
  }, [service]);

  const resolvedDescription = useMemo(() => {
    const fromSection = resolveTextField(service?.description);
    if (fromSection) return fromSection;
    return resolveTextField(service?.shortDescription);
  }, [service]);

  const descriptionIsTiptap =
    !resolvedDescription &&
    service?.description &&
    typeof service.description === 'object';

  const shortDesc = service?.shortDescription;
  const hasTiptapDesc =
    shortDesc && typeof shortDesc === 'object' && !resolveTextField(shortDesc);

  const brandColor = themeColors.primaryButton || themeColors.mainText;

  if (!enabled || areas.length === 0) return null;

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

          {resolvedTitle && (
            <h2
              className="text-3xl font-medium tracking-tight md:text-8xl lg:text-8xl"
              style={{
                color: themeColors.mainText,
                fontFamily: themeFonts.heading,
              }}
            >
              {resolvedTitle}
            </h2>
          )}

          {resolvedDescription && (
            <p
              className="mx-auto max-w-lg text-sm font-light leading-relaxed opacity-75 md:text-base lg:text-lg"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body,
              }}
            >
              {resolvedDescription}
            </p>
          )}

          {!resolvedDescription && descriptionIsTiptap && (
            <div
              className="mx-auto max-w-lg text-sm font-light leading-relaxed opacity-75 md:text-base lg:text-lg"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body,
              }}
            >
              <TiptapRenderer content={service.description} className={TIPTAP_INHERIT} />
            </div>
          )}

          {!resolvedDescription && hasTiptapDesc && (
            <div
              className="mx-auto max-w-lg text-sm font-light leading-relaxed opacity-75 md:text-base lg:text-lg"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body,
              }}
            >
              <TiptapRenderer content={shortDesc} className={TIPTAP_INHERIT} />
            </div>
          )}
        </div>

        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4.5 md:gap-5">
          {areas.map((area, idx) => {
            const areaName = getAreaDisplayName(area) || getAreaCity(area) || String(area);
            const linkPath = serviceSlug
              ? getServiceAreaPageHref(serviceSlug, area, serviceAreaPages)
              : `/service-area/${buildAreaSlugCandidates(area)[0] || 'area'}`;

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
                  aria-hidden
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

export default ServingAreas;
