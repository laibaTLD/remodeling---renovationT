'use client';

import React, { useState } from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc } from '@/app/lib/utils';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { ChevronDown, ChevronUp, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ServiceDetailsProps {
  details: any;
  className?: string;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ details, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  if (!details || (!details.title && !details.description && (!details.features || details.features.length === 0) && (!details.process || details.process.length === 0) && (!details.benefits || details.benefits.length === 0))) return null;

  const features = details.features || [];
  const process = details.process || [];
  const benefits = details.benefits || [];
  const brandColor = themeColors.primaryButton;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      case 'trending': return <TrendingUp className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  return (
    <section 
      className={cn('py-24 md:py-32 lg:py-48', className)}
      style={{ backgroundColor: themeColors.pageBackground, fontFamily: themeFonts.body }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-20 lg:gap-24 items-start">
          
          {/* Left Column: Architectural Section Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-10">
            <div className="space-y-6">
              {details.label && (
                <span
                  className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-30"
                  style={{ color: themeColors.mainText }}
                >
                  <TiptapRenderer content={details.label} as="inline" />
                </span>
              )}

              {details.title && (
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[0.1em] uppercase leading-[1.1] text-balance"
                  style={{
                    color: themeColors.mainText,
                    fontFamily: themeFonts.heading
                  }}
                >
                  <TiptapRenderer content={details.title} as="inline" />
                </h2>
              )}
            </div>

            {(details.subtitle || details.description) && (
              <div
                className="max-w-xs text-xs md:text-sm font-light leading-relaxed tracking-wider opacity-60 uppercase"
                style={{ color: themeColors.secondaryText }}
              >
                <TiptapRenderer content={details.subtitle || details.description} />
              </div>
            )}

            {/* Signature Brand Detail */}
            <div className="pt-8">
              <div className="w-16 h-[2px]" style={{ backgroundColor: brandColor }} />
            </div>
          </div>

          {/* Right Column: Premium Content Sections */}
          <div className="lg:col-span-8 space-y-32">
            
            {/* Features Section */}
            {features.length > 0 && (
              <div className="space-y-12">
                <div className="space-y-4">
                  <span 
                    className="text-[9px] tracking-[0.6em] uppercase font-bold opacity-40 block"
                    style={{ color: brandColor }}
                  >
                    FEATURES
                  </span>
                  <h3 
                    className="text-3xl lg:text-4xl font-extralight uppercase tracking-tighter leading-[1.1]"
                    style={{ 
                      color: themeColors.mainText,
                      fontFamily: themeFonts.heading
                    }}
                  >
                    Key Capabilities
                  </h3>
                </div>
                
                <div className="border-t border-black/10">
                  {features.map((feature: any, index: number) => {
                    const isOpen = expandedFeature === index;
                    return (
                      <div
                        key={index}
                        className="border-b border-black/10 overflow-hidden transition-all duration-700"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFeature(index)}
                          className="w-full flex items-center justify-between py-8 lg:py-10 text-left group transition-all duration-300"
                        >
                          <div className="flex items-start gap-8 lg:gap-12">
                            <span
                              className={cn(
                                "text-[10px] mt-2.5 font-bold tracking-[0.2em] transition-all duration-500",
                                isOpen ? "opacity-100" : "opacity-20"
                              )}
                              style={{ color: isOpen ? brandColor : themeColors.mainText }}
                            >
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            
                            <div className="flex items-center gap-6">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}15` }}
                              >
                                <div style={{ color: brandColor }}>
                                  {getIcon(feature.icon)}
                                </div>
                              </div>
                              <h4
                                className={cn(
                                  "text-xl lg:text-2xl font-extralight tracking-[0.05em] uppercase transition-all duration-500",
                                  isOpen ? "italic scale-[1.01]" : "group-hover:opacity-50"
                                )}
                                style={{
                                  color: themeColors.mainText,
                                  fontFamily: themeFonts.heading
                                }}
                              >
                                <TiptapRenderer content={feature.title} as="inline" />
                              </h4>
                            </div>
                          </div>

                          <div
                            className={cn(
                              "shrink-0 ml-4 transition-all duration-500 rounded-full w-10 h-10 flex items-center justify-center border",
                              isOpen ? "rotate-180 border-transparent shadow-lg text-white" : "border-black/10 group-hover:border-black/30"
                            )}
                            style={{
                              color: isOpen ? '#FFFFFF' : themeColors.mainText,
                              backgroundColor: isOpen ? brandColor : 'transparent',
                              borderColor: isOpen ? brandColor : undefined
                            }}
                          >
                            {isOpen ? <ChevronUp strokeWidth={1} size={18} /> : <ChevronDown strokeWidth={1} size={18} />}
                          </div>
                        </button>

                        <div
                          className={cn(
                            "grid transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]",
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="pl-20 lg:pl-32 pb-10">
                              {feature.shortDescription && (
                                <div className="text-sm md:text-base font-light leading-relaxed opacity-70 mb-4" style={{ color: themeColors.secondaryText }}>
                                  <TiptapRenderer content={feature.shortDescription} />
                                </div>
                              )}
                              {feature.fullDescription && (
                                <div className="text-sm md:text-base font-light leading-relaxed opacity-70 max-w-2xl" style={{ color: themeColors.secondaryText }}>
                                  <TiptapRenderer content={feature.fullDescription} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Process Section */}
            {process.length > 0 && (
              <div className="space-y-12">
                <div className="space-y-4">
                  <span 
                    className="text-[9px] tracking-[0.6em] uppercase font-bold opacity-40 block"
                    style={{ color: brandColor }}
                  >
                    PROCESS
                  </span>
                  <h3 
                    className="text-3xl lg:text-4xl font-extralight uppercase tracking-tighter leading-[1.1]"
                    style={{ 
                      color: themeColors.mainText,
                      fontFamily: themeFonts.heading
                    }}
                  >
                    Our Approach
                  </h3>
                </div>
                
                <div className="space-y-12 lg:space-y-16">
                  {process.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-8 lg:gap-12">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                        style={{ backgroundColor: brandColor }}
                      >
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <h4 
                          className="text-2xl lg:text-3xl font-extralight uppercase tracking-tighter leading-[1.1]"
                          style={{ 
                            color: themeColors.mainText,
                            fontFamily: themeFonts.heading
                          }}
                        >
                          <TiptapRenderer content={step.title} as="inline" />
                        </h4>
                        {step.description && (
                          <div 
                            className="text-base lg:text-lg font-light leading-relaxed opacity-70 max-w-2xl"
                            style={{ color: themeColors.secondaryText }}
                          >
                            <TiptapRenderer content={step.description} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits Section */}
            {benefits.length > 0 && (
              <div className="space-y-12">
                <div className="space-y-4">
                  <span 
                    className="text-[9px] tracking-[0.6em] uppercase font-bold opacity-40 block"
                    style={{ color: brandColor }}
                  >
                    BENEFITS
                  </span>
                  <h3 
                    className="text-3xl lg:text-4xl font-extralight uppercase tracking-tighter leading-[1.1]"
                    style={{ 
                      color: themeColors.mainText,
                      fontFamily: themeFonts.heading
                    }}
                  >
                    Why Choose Us
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                  {benefits.map((benefit: any, index: number) => (
                    <div key={index} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${brandColor}15` }}
                        >
                          <div style={{ color: brandColor }}>
                            {getIcon(benefit.icon)}
                          </div>
                        </div>
                        <h4 
                          className="text-xl lg:text-2xl font-extralight uppercase tracking-tighter leading-[1.1]"
                          style={{ 
                            color: themeColors.mainText,
                            fontFamily: themeFonts.heading
                          }}
                        >
                          <TiptapRenderer content={benefit.title} as="inline" />
                        </h4>
                      </div>
                      
                      {benefit.description && (
                        <div 
                          className="text-base lg:text-lg font-light leading-relaxed opacity-70 pl-16"
                          style={{ color: themeColors.secondaryText }}
                        >
                          <TiptapRenderer content={benefit.description} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            {details.ctaButton && (
              <div className="pt-16 border-t border-black/10">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <span 
                      className="text-[9px] tracking-[0.6em] uppercase font-bold opacity-40 block"
                      style={{ color: brandColor }}
                    >
                      NEXT STEPS
                    </span>
                    <h3 
                      className="text-3xl lg:text-4xl font-extralight uppercase tracking-tighter leading-[1.1]"
                      style={{ 
                        color: themeColors.mainText,
                        fontFamily: themeFonts.heading
                      }}
                    >
                      Ready to Begin
                    </h3>
                  </div>
                  
                  <Link
                    href={details.ctaButton.href || details.ctaButton.url || '#'}
                    className="inline-flex items-center gap-8 group"
                  >
                    <span
                      className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase transition-colors"
                      style={{ color: brandColor }}
                    >
                      {details.ctaButton.text || details.ctaButton.label || 'Get Started'}
                    </span>
                    <div
                      className="w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-700 group-hover:scale-110"
                      style={{ borderColor: brandColor, color: brandColor }}
                    >
                      <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};