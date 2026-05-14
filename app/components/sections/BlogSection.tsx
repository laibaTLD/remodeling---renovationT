'use client';

import React, { useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { CardLoader } from '@/app/components/ui/SkeletonLoader';

interface BlogSectionProps {
    blogSection: Page['blogSection'];
    className?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogSection, className }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    const { blogPosts, loading } = useWebBuilder();

    if (!blogSection?.enabled) return null;

    const displayPosts = blogPosts.slice(0, blogSection.postsToShow || 3);

    if (loading && blogPosts.length === 0) {
        return (
            <section className="h-screen w-full flex overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 border-r border-black/5 p-12">
                        <CardLoader />
                    </div>
                ))}
            </section>
        );
    }

    return (
        <section 
            className={cn('relative h-[100vh] min-h-[700px] w-full overflow-hidden flex flex-col md:flex-row', className)}
            style={{ backgroundColor: themeColors.pageBackground }}
        >
            {/* Background Image Layer (The "Reveal" Effect) */}
            <div className="absolute inset-0 z-0 hidden md:block">
                {displayPosts.map((post, idx) => (
                    <div
                        key={`bg-${post._id}`}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            hoveredIndex === idx ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {post.featuredImage && (
                            <>
                                <OptimizedImage
                                    src={getImageSrc(post.featuredImage.url || (post.featuredImage as any))}
                                    alt=""
                                    fill
                                    sizes="100vw"
                                    className="object-cover grayscale-[0.3] brightness-75"
                                />
                                {/* Overlay to ensure text readability based on theme */}
                                <div className="absolute inset-0 bg-black/20" />
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Content Columns */}
            {displayPosts.map((post, idx) => (
                <article
                    key={post._id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className="relative z-10 flex-1 flex flex-col justify-between p-8 lg:p-12 border-b md:border-b-0 md:border-r transition-colors duration-500"
                    style={{ borderColor: `${themeColors.inactive}30` }}
                >
                    {/* Top Branding / Logo Space */}
                    <div className="flex justify-between items-start">
                        <span 
                            className="text-[10px] tracking-[0.4em] uppercase font-bold"
                            style={{ color: '#fff', mixBlendMode: 'difference', fontFamily: themeFonts.body }}
                        >
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                    </div>

                    {/* Floating Project Card (Center) */}
                    <div className="relative group w-full max-w-[320px] mx-auto transition-transform duration-700 ease-out transform group-hover:-translate-y-2">
                         <a href={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[3/4] shadow-2xl">
                            {post.featuredImage && (
                                <OptimizedImage
                                    src={getImageSrc(post.featuredImage.url || (post.featuredImage as any))}
                                    alt={post.title}
                                    fill
                                    sizes="320px"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            )}
                            {/* "Sold Out" or Status Tag Style */}
                            <div className="absolute top-4 right-[-35px] bg-red-600 text-white text-[10px] font-bold py-1 px-10 rotate-45 uppercase tracking-widest">
                                Project
                            </div>
                         </a>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="mt-8">
                        <h3
                            className="text-xl lg:text-2xl font-medium tracking-widest uppercase mb-2"
                            style={{ 
                                color: hoveredIndex === idx ? '#fff' : themeColors.lightPrimaryText, 
                                fontFamily: themeFonts.heading,
                                mixBlendMode: 'difference'
                            }}
                        >
                            <a href={`/blog/${post.slug}`}>{post.title}</a>
                        </h3>
                        
                        {post.excerpt && (
                            <div
                                className="text-[11px] uppercase tracking-[0.2em] opacity-80"
                                style={{ 
                                    color: hoveredIndex === idx ? '#fff' : themeColors.lightSecondaryText, 
                                    fontFamily: themeFonts.body,
                                    mixBlendMode: 'difference'
                                }}
                            >
                                <TiptapRenderer content={post.excerpt} />
                            </div>
                        )}
                    </div>
                </article>
            ))}

            {/* Menu Label (Absolute position like the reference) */}
            <div className="absolute top-8 right-12 z-20 hidden md:flex items-center gap-4">
                 <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#fff', mixBlendMode: 'difference' }}>Menu</span>
                 <div className="flex flex-col gap-1">
                    <div className="w-6 h-px bg-current" style={{ color: '#fff', mixBlendMode: 'difference' }} />
                    <div className="w-6 h-px bg-current" style={{ color: '#fff', mixBlendMode: 'difference' }} />
                 </div>
            </div>
        </section>
    );
};