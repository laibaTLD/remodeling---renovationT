'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
    testimonialsSection: Page['testimonialsSection'];
    className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonialsSection, className }) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();

    const items = testimonialsSection?.testimonials || [];

    const scrollToIndex = (idx: number) => {
        const track = trackRef.current;
        if (!track) return;
        const target = track.querySelector<HTMLElement>(`[data-testimonial-index="${idx}"]`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    };

    const scrollByCard = (direction: -1 | 1) => {
        const next = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
        scrollToIndex(next);
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track || items.length === 0) return;

        const handler = () => {
            const children = Array.from(track.querySelectorAll<HTMLElement>('[data-testimonial-index]'));
            const trackRect = track.getBoundingClientRect();
            const trackCenterX = trackRect.left + trackRect.width / 2;

            let bestIdx = 0;
            let bestDist = Number.POSITIVE_INFINITY;
            children.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const elCenterX = rect.left + rect.width / 2;
                const dist = Math.abs(elCenterX - trackCenterX);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = Number(el.dataset.testimonialIndex || 0);
                }
            });
            setActiveIndex(bestIdx);
        };

        track.addEventListener('scroll', handler, { passive: true });
        return () => track.removeEventListener('scroll', handler as any);
    }, [items.length]);

    if (!testimonialsSection?.enabled) return null;

    return (
        <section
            className={cn('relative py-24 lg:py-32 overflow-hidden', className)}
            style={{ backgroundColor: themeColors.sectionBackground }}
        >
            <div className="container mx-auto px-6">
                
                {/* Section Header */}
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="mb-6 flex items-center gap-3">
                        {testimonialsSection.description && (
                            <span 
                                className="text-[10px] tracking-[0.4em] uppercase font-bold"
                                style={{ 
                                    color: themeColors.primaryButton,
                                    fontFamily: themeFonts.body
                                }}
                            >
                                <TiptapRenderer content={testimonialsSection.description} as="inline" />
                            </span>
                        )}
                        <div className="w-12 h-[1px]" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                    </div>
                    
                    {testimonialsSection.title && (
                        <h2
                            className="text-3xl lg:text-4xl leading-tight max-w-3xl"
                            style={{ 
                                color: themeColors.lightPrimaryText,
                                fontFamily: themeFonts.heading
                            }}
                        >
                            <TiptapRenderer content={testimonialsSection.title} />
                        </h2>
                    )}
                </div>

                {/* Main Carousel Display */}
                <div className="relative mt-16">
                    <div
                        ref={trackRef}
                        className="flex gap-12 lg:gap-24 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 items-center"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {items.map((t, idx) => {
                            return (
                            <div
                                key={`${t.name}-${idx}`}
                                data-testimonial-index={idx}
                                className={cn(
                                    "min-w-full md:min-w-[70%] lg:min-w-[60%] snap-center transition-all duration-700 ease-out",
                                    activeIndex === idx ? "opacity-100 scale-100" : "opacity-30 scale-95 grayscale"
                                )}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <Quote 
                                        className="w-12 h-12 mb-10 opacity-20" 
                                        style={{ color: themeColors.primaryButton }} 
                                    />
                                    
                                    <div
                                        className="text-xl md:text-2xl lg:text-3xl italic leading-relaxed mb-12"
                                        style={{ 
                                            color: themeColors.lightPrimaryText,
                                            fontFamily: themeFonts.body
                                        }}
                                    >
                                        <TiptapRenderer content={t.text} />
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span 
                                            className="text-xs tracking-[0.3em] uppercase font-black mb-2"
                                            style={{ 
                                                color: themeColors.primaryButton,
                                                fontFamily: themeFonts.heading
                                            }}
                                        >
                                            {t.name}
                                        </span>
                                        <span 
                                            className="text-[10px] tracking-widest opacity-60 uppercase"
                                            style={{ 
                                                color: themeColors.lightSecondaryText,
                                                fontFamily: themeFonts.body
                                            }}
                                        >
                                            {t.role} {t.company && `• ${t.company}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    {/* Minimalist Controls */}
                    <div className="mt-12 flex flex-col items-center gap-8">
                        {/* Progress Line */}
                        <div className="flex gap-3 h-[2px] w-32 md:w-48 bg-black/5 relative">
                            <div 
                                className="absolute top-0 left-0 h-full transition-all duration-500"
                                style={{ 
                                    backgroundColor: themeColors.primaryButton,
                                    width: `${((activeIndex + 1) / items.length) * 100}%` 
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-12">
                            <button
                                onClick={() => scrollByCard(-1)}
                                className="group flex items-center gap-2 transition-all"
                                style={{ color: themeColors.lightPrimaryText }}
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] tracking-[0.2em] font-bold uppercase">Prev</span>
                            </button>
                            
                            <span className="text-[10px] tracking-[0.2em] font-bold opacity-30">
                                {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                            </span>

                            <button
                                onClick={() => scrollByCard(1)}
                                className="group flex items-center gap-2 transition-all"
                                style={{ color: themeColors.lightPrimaryText }}
                            >
                                <span className="text-[10px] tracking-[0.2em] font-bold uppercase">Next</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Decorative Heritage Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-t from-transparent via-black/10 to-transparent" />
        </section>
    );
};
