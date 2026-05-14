'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectsSectionProps {
  projectsSection: Page['projectsSection'];
  className?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsSection, className }) => {
  const themeColors = useThemeColors();
  const { projects } = useWebBuilder();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectsSection?.enabled) return;

    const ctx = gsap.context(() => {
      // Horizontal Scroll Animation
      if (scrollRef.current && containerRef.current) {
        const scrollWidth = Math.max(containerRef.current.scrollWidth - window.innerWidth, 0);

        if (scrollWidth <= 0) return;

        gsap.to(containerRef.current, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: scrollRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          }
        });
      }
    }, scrollRef);

    return () => ctx.revert();
  }, [projectsSection, projects]);

  if (!projectsSection?.enabled) return null;

  const brandColor = themeColors.primaryButton;

  // Get projects from provider or manual selection
  const publishedProjects = (projects || []).filter((p) => p.status === 'published');
  const displayItems = projectsSection.projects?.length ? projectsSection.projects : publishedProjects;

  return (
    <div
      ref={scrollRef}
      className="relative overflow-x-clip overflow-y-hidden max-w-full"
      style={{ backgroundColor: brandColor }}
    >
      {/* Hide horizontal scrollbar across all browsers */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <section className={cn('relative min-h-screen flex flex-col justify-center overflow-x-clip overflow-y-hidden', className)}>
        <div className="px-8 md:px-16 lg:px-24 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1.5px] bg-white/40" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/60">
              Featured Projects
            </span>
          </div>
          {projectsSection.title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans tracking-tight uppercase font-light text-white leading-none max-w-2xl">
              <TiptapRenderer content={projectsSection.title} as="inline" />
            </h2>
          )}
        </div>

        {/* Horizontal Scrolling Projects Container */}
        <div className="relative w-full max-w-full overflow-x-clip overflow-y-visible scrollbar-hide">
          <div
            ref={containerRef}
            className="flex gap-6 md:gap-10 lg:gap-14 px-6 md:px-16 lg:px-24 w-max max-w-full"
          >
            {displayItems.map((item: any, idx) => {
              const imageUrl = getImageSrc(item.featuredImage?.url || item.image?.url || item.image || item.featuredImage);
              const titleText = item.name || item.title || 'Project';
              const locationText = item.location || 'Madrid';

              return (
                <Link
                  key={idx}
                  href={`/projects/${item.slug || 'detail'}`}
                  className="group flex flex-col w-[82vw] max-w-[280px] md:w-[320px] lg:w-[360px] shrink-0"
                >
                  {/* The Card Image Area - Reduced Size & Tighter Aspect Ratio */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5 mb-6">
                    {imageUrl ? (
                      <OptimizedImage
                        src={imageUrl}
                        alt={titleText}
                        fill
                        sizes="(max-width: 768px) 85vw, 360px"
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}

                    {/* Sold Out ribbon removed per user request */}

                    {/* Interactive Drag Hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">←</span>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0V11m0 0.5V14m0-2.5v-6a1.5 1.5 0 113 0V11m0 0.5V14m0-2.5v-6a1.5 1.5 0 113 0V11m0 0.5V14" />
                          </svg>
                          <span className="text-lg">→</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Info Area - White Minimal Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-light uppercase tracking-tight text-white leading-tight">
                      {typeof titleText === 'string' ? titleText : <TiptapRenderer content={titleText} as="inline" />}
                    </h3>
                    <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
                      {locationText}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsSection;