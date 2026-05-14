'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface GallerySectionProps {
    gallerySection: Page['gallerySection'];
    className?: string;
}

type GalleryImage = NonNullable<Page['gallerySection']>['images'][number];

export const GallerySection: React.FC<GallerySectionProps> = ({ gallerySection, className }) => {
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();

    const images = useMemo(() => {
        if (!gallerySection?.images?.length) return [];
        return gallerySection.images.map((image: GalleryImage | string, index: number) => {
            const imageUrl = typeof image === 'string' ? image : image.url;
            const altText = typeof image === 'object' ? image.altText : '';
            return {
                key: `${imageUrl}-${index}`,
                imageUrl,
                altText,
            };
        });
    }, [gallerySection]);

    if (!gallerySection?.enabled || images.length === 0) return null;

    const mainImg = images[0];
    const topSecondaryImg = images[1] || images[0];
    const bottomSecondaryImg = images[2] || images[1] || images[0];

    return (
        <section
            className={cn('relative overflow-hidden py-20 text-white lg:py-32', className)}
            style={{
                background: 'linear-gradient(180deg, #050508 0%, #0a0a12 50%, #050508 100%)',
            }}
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:56px_56px] opacity-40" />
            <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-14">
                    <motion.div
                        className="flex flex-col gap-12 md:col-span-7 lg:gap-20"
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_32px_100px_rgba(0,0,0,0.5)]">
                            <OptimizedImage
                                src={getImageSrc(mainImg.imageUrl)}
                                alt={mainImg.altText || ''}
                                fill
                                sizes="(max-width: 768px) 100vw, 58vw"
                                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>

                        <div className="max-w-2xl space-y-4">
                            <div 
                                className="text-balance text-2xl font-light uppercase leading-[1.3] tracking-[0.14em] md:text-3xl lg:text-4xl xl:text-5xl"
                                style={{ 
                                    fontFamily: themeFonts.heading,
                                    color: 'rgba(255,255,255,0.92)'
                                }}
                            >
                                <TiptapRenderer content={gallerySection.title} />
                                
                                {gallerySection.description && (
                                    <div 
                                        className="mt-4 text-sm font-light italic leading-relaxed tracking-[0.08em] md:text-base lg:text-lg"
                                        style={{ color: themeColors.primaryButton }} 
                                    >
                                        <TiptapRenderer content={gallerySection.description} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col gap-8 md:col-span-5 md:pt-16 lg:pt-24"
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
                           <OptimizedImage
                                src={getImageSrc(topSecondaryImg.imageUrl)}
                                alt={topSecondaryImg.altText || ''}
                                fill
                                sizes="(max-width: 768px) 100vw, 42vw"
                                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                            />
                        </div>

                        <div className="group relative z-10 aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl md:aspect-[3/4]">
                            <OptimizedImage
                                src={getImageSrc(bottomSecondaryImg.imageUrl)}
                                alt={bottomSecondaryImg.altText || ''}
                                fill
                                sizes="(max-width: 768px) 100vw, 42vw"
                                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </div>

                {images.length > 3 && (
                    <div className="mt-20 grid grid-cols-2 gap-5 opacity-80 transition-opacity duration-700 hover:opacity-100 md:grid-cols-4 md:gap-6">
                        {images.slice(3, 7).map((img, i) => (
                            <motion.div 
                                key={img.key} 
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className={cn(
                                    "group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/30",
                                    i % 2 === 1 ? "md:translate-y-8" : ""
                                )}
                            >
                                <OptimizedImage
                                    src={getImageSrc(img.imageUrl)}
                                    alt={img.altText || ''}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default GallerySection;
