'use client';

import React, { useState, useMemo } from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowUpRight, Check } from 'lucide-react';

interface OurServicesProps {
  services: any;
  className?: string;
}

export const OurServices: React.FC<OurServicesProps> = ({ services, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { services: allServices } = useWebBuilder();
  const [activeCategory, setActiveCategory] = useState('all');

  const serviceItems = useMemo(() => {
    if (services.items && services.items.length > 0) return services.items;
    if (services.serviceIds && allServices) {
      return allServices.filter((s: any) => services.serviceIds.includes(s._id || s.id));
    }
    if (Array.isArray(services)) return services;
    return [];
  }, [services, allServices]);

  const filteredServices = activeCategory === 'all' 
    ? serviceItems
    : serviceItems.filter((service: any) => service.category === activeCategory);

  const categories = ['all', ...Array.from(new Set(serviceItems.map((service: any) => service.category).filter(Boolean)))] as string[];

  return (
    <section 
      className={cn('py-24 lg:py-32', className)}
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            {services.label && (
              <span 
                className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-60 block mb-6"
                style={{ color: themeColors.lightPrimaryText }}
              >
                <TiptapRenderer content={services.label} as="inline" />
              </span>
            )}
            {services.title && (
              <h2 
                className="text-4xl lg:text-6xl font-semibold tracking-tight leading-[1.1]"
                style={{ color: themeColors.lightPrimaryText }}
              >
                <TiptapRenderer content={services.title} />
              </h2>
            )}
          </div>
          {(services.subtitle || services.description) && (
            <div 
              className="lg:max-w-sm text-lg opacity-70 leading-relaxed"
              style={{ color: themeColors.lightSecondaryText }}
            >
              <TiptapRenderer content={services.subtitle || services.description} as="inline" />
            </div>
          )}
        </div>

        {/* Minimalist Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-8 mb-16 border-b" style={{ borderColor: `${themeColors.inactive}20` }}>
            {categories.map((category) => (
              <button
                key={category}
                className={cn(
                  'pb-4 text-xs font-bold uppercase tracking-widest transition-all relative',
                  activeCategory === category ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                )}
                style={{ 
                    color: themeColors.lightPrimaryText, 
                }}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All Portfolio' : <TiptapRenderer content={category} as="inline" />}
                {activeCategory === category && (
                    <div 
                        className="absolute bottom-0 left-0 w-full h-0.5" 
                        style={{ backgroundColor: themeColors.primaryButton }}
                    />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid - Only show if services exist */}
        {filteredServices.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredServices.map((service: any, index: number) => (
            <div 
              key={service.id || index}
              className="group flex flex-col h-full transition-all duration-500"
            >
              {/* Image Container with Reveal */}
              <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-[2rem] bg-gray-100">
                {service.image ? (
                  <OptimizedImage
                    src={getImageSrc(service.image)}
                    alt={service.title || ''}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">No Image</div>
                )}
                
                {/* Modern Glass Badge */}
                {service.category && (
                  <div 
                    className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-white/10 border border-white/20 text-white"
                  >
                    {service.category}
                  </div>
                )}

                {/* Hover Interaction Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight size={24} style={{ color: themeColors.primaryButton }} />
                    </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="flex flex-col flex-grow px-2">
                <h3 
                  className="text-2xl font-semibold mb-4 group-hover:italic transition-all duration-300"
                  style={{ color: themeColors.lightPrimaryText }}
                >
                  <TiptapRenderer content={service.title} as="inline" />
                </h3>

                {service.description && (
                  <div 
                    className="text-base opacity-70 leading-relaxed mb-6 line-clamp-2"
                    style={{ color: themeColors.lightSecondaryText }}
                  >
                    <TiptapRenderer content={service.description} />
                  </div>
                )}

                {/* Minimalist Features */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {service.features.slice(0, 3).map((feature: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: themeColors.primaryButton }} />
                        <span className="text-xs font-medium opacity-60 uppercase tracking-tighter" style={{ color: themeColors.lightPrimaryText }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtle CTA Link */}
                <button
                  className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest group/btn"
                  style={{ color: themeColors.primaryButton }}
                  onClick={() => service.ctaButton?.url && window.open(service.ctaButton.url, '_blank')}
                >
                  <span>{service.ctaButton?.text || 'Explore Service'}</span>
                  <div className="h-px w-6 transition-all duration-300 group-hover/btn:w-12" style={{ backgroundColor: themeColors.primaryButton }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};