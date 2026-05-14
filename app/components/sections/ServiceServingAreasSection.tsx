'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowRight } from 'lucide-react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';

interface ServiceServingAreasSectionProps {
    service: any;
}

export const ServiceServingAreasSection: React.FC<ServiceServingAreasSectionProps> = ({ service }) => {
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    const { site, serviceAreaPages } = useWebBuilder();

    const areas = useMemo(() => {
        const serviceAreas = service.serviceAreas || [];
        const siteAreas = Array.isArray(site?.serviceAreas) ? site!.serviceAreas.filter(Boolean) : [];
        
        // Use service-specific areas if available, otherwise fall back to site areas
        return (Array.isArray(serviceAreas) && serviceAreas.length > 0)
            ? serviceAreas
            : siteAreas;
    }, [service.serviceAreas, site?.serviceAreas, serviceAreaPages]);

    if (areas.length === 0) return null;

    // Generate service slug from service name
    const serviceSlug = typeof service?.slug === 'string' && service.slug.trim()
        ? String(service.slug).trim().toLowerCase().replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : String(service.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const brandColor = themeColors.primaryButton;
    const shortDesc = service?.shortDescription;
    const hasShortDesc =
        typeof shortDesc === 'string' ? shortDesc.trim().length > 0 : Boolean(shortDesc && typeof shortDesc === 'object');

    return (
        <section
            className="py-24 md:py-32 lg:py-48 border-t border-black/5"
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

                            <h2
                                className="text-3xl md:text-4xl lg:text-6xl font-extralight tracking-[0.1em] uppercase leading-[1.1] text-balance"
                                style={{
                                    color: themeColors.mainText,
                                    fontFamily: themeFonts.heading
                                }}
                            >
                                {service?.name ? `Serving ${service.name} areas` : 'Serving areas'}
                            </h2>
                        </div>

                        {hasShortDesc && (
                        <div
                            className="max-w-xs text-xs md:text-sm font-light leading-relaxed tracking-wider opacity-60 uppercase"
                            style={{ color: themeColors.secondaryText }}
                        >
                            {typeof shortDesc === 'string' ? shortDesc : <TiptapRenderer content={shortDesc} as="inline" />}
                        </div>
                        )}

                        {/* Signature Brand Detail */}
                        <div className="pt-8">
                            <div className="w-16 h-[2px]" style={{ backgroundColor: brandColor }} />
                        </div>
                    </div>

                    {/* RIGHT SIDE: EDITORIAL LIST OF LOCATIONS */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-black/10">
                            {areas.map((area: any, idx: number) => {
                                const cityName = typeof area === 'string' ? area : area.city;
                                const regionName = typeof area === 'string' ? '' : (area.region || '');
                                const citySlug = regionName 
                                    ? `${String(cityName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${String(regionName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
                                    : String(cityName)
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, '-')
                                        .replace(/^-|-$/g, '');
                                
                                const areaKey = `${cityName}-${idx}`;
                                const displayName = `${cityName}${regionName ? `, ${regionName}` : ''}`;

                                return (
                                    <Link
                                        key={areaKey}
                                        href={`/service/${serviceSlug}/service-areas/${citySlug}`}
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
                                                    {displayName}
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
