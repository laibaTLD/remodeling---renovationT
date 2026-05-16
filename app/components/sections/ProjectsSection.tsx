'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Page, Project } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { usePrefersReducedMotion } from '@/app/hooks/usePrefersReducedMotion';
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

type ManualProject = NonNullable<NonNullable<Page['projectsSection']>['projects']>[number];
type DisplayItem = Project | ManualProject;

function isProjectEntity(p: DisplayItem): p is Project {
  return typeof (p as Project)._id === 'string' && typeof (p as Project).slug === 'string';
}

function projectHref(p: DisplayItem): string {
  if (isProjectEntity(p)) return `/project-detail/${p.slug}`;
  const href = (p as ManualProject).href;
  return typeof href === 'string' && href.length > 0 ? href : '#';
}

function projectTitle(p: DisplayItem): React.ReactNode {
  if (isProjectEntity(p)) return p.title;
  const t = (p as ManualProject).title;
  if (typeof t === 'string') return t;
  if (t) return <TiptapRenderer content={t} as="inline" />;
  return 'Project';
}

function projectImageUrl(p: DisplayItem): string | null {
  if (isProjectEntity(p)) {
    return getImageSrc(p.featuredImage?.url || p.featuredImage);
  }
  const img = (p as ManualProject).image;
  return img?.url ? getImageSrc(img.url) : null;
}

interface ProjectSlideProps {
  item: DisplayItem;
  index: number;
  brandColor: string;
  fonts: { heading?: string; body?: string };
  themeColors: any;
}

const ProjectSlide: React.FC<ProjectSlideProps> = ({ item, index, brandColor, fonts, themeColors }) => {
  const imageUrl = projectImageUrl(item);
  const href = projectHref(item);
  const title = projectTitle(item);
  const [hovered, setHovered] = useState(false);

  const viewControl =
    href === '#' ? (
      <div className="group/link relative flex h-16 w-16 items-center justify-center rounded-full border" style={{ borderColor: `${themeColors.mainText}20` }}>
        <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest" style={{ color: themeColors.mainText }}>View</span>
      </div>
    ) : (
      <Link
        href={href}
        className="group/link relative flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-500 hover:scale-110"
        style={{ borderColor: `${themeColors.mainText}20` }}
      >
        <div
          className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 group-hover/link:scale-100"
          style={{ backgroundColor: brandColor }}
        />
        <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest" style={{ color: themeColors.mainText }}>View</span>
      </Link>
    );

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden lg:flex-row"
      style={{ backgroundColor: themeColors.cardBackground }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          data-project-bg
          className="absolute inset-0 h-full w-full scale-110 opacity-60 transition-transform duration-1000 ease-out group-hover:scale-100"
        >
          {imageUrl && (
            <OptimizedImage
              src={imageUrl}
              alt={typeof title === 'string' ? title : 'Project'}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index < 2}
            />
          )}
        </div>
        <div className="absolute inset-0 z-10 opacity-80" style={{ background: `linear-gradient(to top, ${themeColors.cardBackground}, ${themeColors.cardBackground}20, transparent)` }} />
        <div
          className="absolute inset-0 z-10 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at center, ${brandColor} 0%, transparent 70%)`,
            opacity: hovered ? 0.4 : 0.2,
          }}
        />
      </div>

      <div className="relative z-20 flex flex-col items-center px-6 text-center lg:px-20">
        <span
          className="mb-6 block text-[10px] font-black uppercase tracking-[0.6em]"
          style={{ color: brandColor }}
        >
          Project {String(index + 1).padStart(2, '0')}
        </span>

        <h3
          className="mb-10 text-[clamp(2.5rem,8vw,7rem)] font-light uppercase leading-[0.9] tracking-tighter"
          style={{ fontFamily: fonts.heading, color: themeColors.mainText }}
        >
          {title}
        </h3>

        {viewControl}
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { projects } = useWebBuilder();
  const reducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const brandColor = themeColors.primaryButton;
  const sectionEnabled = Boolean(projectsSection?.enabled);

  const published = (projects || []).filter((p) => p.status === 'published');
  const displayItems: DisplayItem[] =
    sectionEnabled && projectsSection
      ? (
          projectsSection.projects?.length
            ? (projectsSection.projects as ManualProject[])
            : (published as Project[])
        ).slice(0, 6)
      : [];

  useLayoutEffect(() => {
    if (!sectionEnabled || reducedMotion || !containerRef.current || displayItems.length === 0) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.project-panel', containerRef.current);

      sections.forEach((section, i) => {
        if (i === sections.length - 1) return;

        const bg = section.querySelector('[data-project-bg]');

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            },
          })
          .to(section, {
            scale: 0.9,
            opacity: 0,
            filter: 'blur(10px)',
            ease: 'none',
          })
          .to(
            bg,
            {
              yPercent: -20,
              ease: 'none',
            },
            0,
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [sectionEnabled, displayItems.length, reducedMotion]);

  if (!sectionEnabled || !projectsSection || displayItems.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className={cn('relative', className)}
      style={{ fontFamily: themeFonts.body, backgroundColor: themeColors.cardBackground }}
    >
      <div className="relative z-50 flex h-[60vh] flex-col justify-end px-6 pb-20 lg:px-20">
        <div className="mb-8 h-px w-12" style={{ backgroundColor: brandColor }} />
        <h2
          className="text-[clamp(2rem,5vw,4rem)] font-light uppercase leading-tight"
          style={{ fontFamily: themeFonts.heading, color: themeColors.mainText }}
        >
          {projectsSection.title ? (
            <TiptapRenderer content={projectsSection.title} as="inline" />
          ) : null}
        </h2>
      </div>

      <div className="relative">
        {displayItems.map((item, idx) => (
          <div
            key={isProjectEntity(item) ? item._id : `manual-${idx}`}
            className="project-panel relative h-screen w-full"
          >
            <ProjectSlide
              item={item}
              index={idx}
              brandColor={brandColor}
              fonts={{ heading: themeFonts.heading, body: themeFonts.body }}
              themeColors={themeColors}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
