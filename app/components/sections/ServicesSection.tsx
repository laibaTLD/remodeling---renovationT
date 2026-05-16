'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ServicesSectionProps {
  servicesSection: Page['servicesSection'];
  className?: string;
}

function resolveServiceImageRaw(service: any): string | undefined {
  const thumb = service?.thumbnailImage;
  if (typeof thumb === 'string' && thumb.trim()) return thumb;
  if (thumb?.url) return thumb.url;

  const image = service?.image;
  if (typeof image === 'string' && image.trim()) return image;
  if (image && typeof image === 'object' && image.url) return image.url;

  const bannerBg = service?.banner?.backgroundImage;
  if (bannerBg?.url) return bannerBg.url;

  const gallery = service?.galleryImages;
  if (Array.isArray(gallery) && gallery.length > 0) {
    const first = gallery[0] as { url?: string; imageUrl?: string };
    if (first?.url) return first.url;
    if (first?.imageUrl) return first.imageUrl;
  }

  return undefined;
}

function getServiceImageSrc(service: any): string {
  const raw = resolveServiceImageRaw(service);
  return raw ? getImageSrc(raw) : '';
}

function getServiceImageAlt(service: any): string {
  const thumb = service?.thumbnailImage;
  if (thumb && typeof thumb === 'object' && thumb.altText) return thumb.altText;
  const gallery = service?.galleryImages?.[0];
  if (gallery?.altText) return gallery.altText;
  return service?.name || '';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesSection, className }) => {
  const { services, loading, site } = useWebBuilder();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const displayServices = React.useMemo(() => {
    const all = services ?? [];
    const ids = servicesSection?.serviceIds;
    if (ids?.length) {
      return ids
        .map((id) => all.find((s) => s._id === id))
        .filter((s): s is (typeof all)[number] => Boolean(s));
    }
    return all;
  }, [services, servicesSection?.serviceIds]);

  if (!servicesSection?.enabled) return null;

  if (loading && displayServices.length === 0) {
    return (
      <section
        className={cn('py-24 lg:py-32', className)}
        style={{ backgroundColor: themeColors.sectionBackground }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="h-48 rounded-2xl animate-pulse" style={{ backgroundColor: themeColors.cardBackground }} />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: themeColors.cardBackground }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeService = displayServices[activeIndex] || displayServices[0];

  return (
    <section
      className={cn('relative min-h-screen py-20 lg:py-32 flex items-center overflow-hidden', className)}
      style={{
        backgroundColor: themeColors.sectionBackground,
        fontFamily: themeFonts.body
      }}
    >
      <div className="container mx-auto px-6 lg:px-12 w-full asset-grid">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT SIDE COLUMN: Global Headings & Current Selection Information */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-24">
            <div className="space-y-4">
              {site?.business?.tagline && (
                <span
                  className="inline-block text-xs uppercase tracking-[0.4em] font-semibold"
                  style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                >
                  [{site.business.tagline}]
                </span>
              )}
              
              {servicesSection.title && (
                <div
                  className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight"
                  style={{ color: themeColors.mainText, fontFamily: themeFonts.heading }}
                >
                  <TiptapRenderer content={servicesSection.title} />
                </div>
              )}

              {servicesSection.description && (
                <div
                  className="text-sm md:text-base leading-relaxed opacity-80 font-light max-w-md"
                  style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                >
                  <TiptapRenderer content={servicesSection.description} />
                </div>
              )}
            </div>

            {/* Current Active Service Focus Area */}
            {activeService && (
              <div className="pt-8 border-t transition-all duration-500 space-y-6" style={{ borderColor: `${themeColors.mainText}15` }}>
                {/* Dynamically Loaded Image Placed Before Title/Description */}
                {getServiceImageSrc(activeService) && (
                  <div className="w-full aspect-[16/9] rounded-sm overflow-hidden mb-4 relative group">
                    <img
                      src={getServiceImageSrc(activeService)}
                      alt={getServiceImageAlt(activeService)}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <h4 
                    className="text-xl font-medium tracking-wide uppercase"
                    style={{ color: themeColors.mainText, fontFamily: themeFonts.heading }}
                  >
                    {activeService.name}
                  </h4>
                  
                  {activeService.shortDescription && (
                    <div 
                      className="text-sm leading-relaxed font-light"
                      style={{ color: themeColors.secondaryText }}
                    >
                      {typeof activeService.shortDescription === 'string' ? (
                        activeService.shortDescription
                      ) : (
                        <TiptapRenderer content={activeService.shortDescription} />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Link
                    href={`/service/${activeService.slug}`}
                    className="inline-flex items-center justify-between w-full sm:w-auto gap-12 px-6 py-3 border text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 rounded-sm hover:opacity-90"
                    style={{
                      backgroundColor: themeColors.primaryButton,
                      color: themeColors.sectionBackground,
                      borderColor: themeColors.primaryButton
                    }}
                  >
                    <span>Learn more</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE COLUMN: Interactive Service Scroller Strip */}
          <div className="lg:col-span-7 w-full border-t" style={{ borderColor: `${themeColors.mainText}20` }}>
            {displayServices.map((service, index: number) => {
              const isSelected = activeIndex === index;
              
              return (
                <div
                  key={service._id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className="group relative cursor-pointer border-b transition-all duration-300 py-10 lg:py-14 grid grid-cols-12 gap-4 items-center"
                  style={{ borderColor: `${themeColors.mainText}20` }}
                >
                  {/* Service Text Metadata Block */}
                  <div className="col-span-8 space-y-2">
                    <h3
                      className="text-sm lg:text-base uppercase font-semibold tracking-widest transition-colors duration-300"
                      style={{ 
                        color: isSelected ? themeColors.mainText : themeColors.secondaryText,
                        fontFamily: themeFonts.heading 
                      }}
                    >
                      {service.name}
                    </h3>
                    
                    {service.shortDescription && (
                      <p 
                        className="text-xs max-w-md line-clamp-2 transition-opacity duration-300"
                        style={{ 
                          color: themeColors.secondaryText,
                          opacity: isSelected ? 1 : 0.5 
                        }}
                      >
                        {typeof service.shortDescription === 'string' 
                          ? service.shortDescription 
                          : 'Explore campaign parameters and conversions.'}
                      </p>
                    )}
                  </div>

                  {/* Huge Counter Indicator Row */}
                  <div className="col-span-4 text-right select-none">
                    <span
                      className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none block transition-all duration-500 transform font-sans"
                      style={{
                        color: isSelected ? themeColors.mainText : themeColors.secondaryText,
                        opacity: isSelected ? 1 : 0.15,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;