'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/hooks/useTheme';
import { Page } from '@/app/lib/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Header: React.FC = () => {
  const { site, pages } = useWebBuilder();
  const themeColors = useThemeColors();

  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle entrance
      gsap.fromTo(headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.8 }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // Specific Order: Home | About | Blog | Service | Serving Areas | Testimonials | Contact
  const orderedNavPages = useMemo(() => {
    if (!pages) return [];

    // Explicit requested order mapping
    const orderMap: Record<string, number> = {
      'home': 1,
      'about': 2,
      'blog-list': 3,
      'service-list': 4,
      'serving-areas': 5,
      'testimonials': 6,
      'contact': 7
    };

    const published = pages.filter(p => p.status === 'published');

    return published.sort((a, b) => {
      const aVal = orderMap[a.pageType] || 99;
      const bVal = orderMap[b.pageType] || 99;
      return aVal - bVal;
    });
  }, [pages]);

  if (!site) return null;

  const brandName = (site?.business?.name || site?.name || '').toUpperCase();
  const brandColor = themeColors.primaryButton;

  // Format address specifically to avoid ReactNode error
  const addressString = site.business?.address
    ? typeof site.business.address === 'string'
      ? site.business.address
      : `${site.business.address.street || ''} ${site.business.address.city || ''} ${site.business.address.state || ''}`.trim()
    : '';

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] px-8 md:px-16 lg:px-20 border-b',
          isScrolled
            ? 'py-4 border-white/10 bg-neutral-950/80 shadow-[0_12px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl'
            : 'py-8 md:py-12 border-white/10 bg-black/25 backdrop-blur-2xl',
          isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">

          <Link href="/" className="group flex items-center outline-none">
            {site.theme?.logoUrl ? (
              <OptimizedImage
                src={getImageSrc(site.theme.logoUrl)}
                alt={brandName}
                width={320}
                height={96}
                priority
                sizes="(max-width: 768px) 180px, 240px"
                className={cn(
                  "h-14 md:h-16 lg:h-20 w-auto transition-all duration-500",
                  isScrolled ? "brightness-100" : "brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                )}
              />
            ) : (
              <span className={cn(
                "text-xs md:text-sm font-medium tracking-[0.5em] uppercase transition-colors duration-500",
                isScrolled ? "text-white" : "text-white"
              )}>
                {brandName}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-12 lg:gap-16">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-4 group outline-none"
            >
              <span className={cn(
                "text-[9px] font-bold tracking-[0.3em] uppercase transition-colors duration-500",
                "text-white/90"
              )}>Menu</span>
              <div className="flex flex-col gap-1.5">
                <div className="w-6 h-[1.5px] transition-all duration-500" style={{ backgroundColor: brandColor }} />
                <div className="w-6 h-[1.5px] transition-all duration-500" style={{ backgroundColor: brandColor }} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[200] pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]",
          isMenuOpen ? "opacity-100" : "opacity-0 invisible"
        )}
      >
        {/* TOP FRAME - Links start from left */}
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-[70px] md:h-[80px] flex items-center justify-between px-8 md:px-12 lg:px-16 z-[210] pointer-events-auto transition-transform duration-700 delay-100",
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
          style={{ backgroundColor: brandColor, color: 'white' }}
        >
          {/* Navigation Container Aligned Left */}
          <div className="flex-1 flex items-center gap-4 md:gap-8 lg:gap-10 overflow-x-auto no-scrollbar">
            {orderedNavPages.map((p) => (
              <Link
                key={p.slug}
                href={p.pageType === 'home' ? '/' : `/${p.slug}`}
                className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase whitespace-nowrap hover:opacity-60 transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              >
                {p.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 group outline-none ml-8 shrink-0"
          >
            <span className="text-[8px] font-bold tracking-[0.2em] uppercase hidden md:inline">Close</span>
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full border border-white/20 group-hover:bg-white/10 transition-all">
              <div className="absolute w-3.5 h-[1.2px] bg-white rotate-45" />
              <div className="absolute w-3.5 h-[1.2px] bg-white -rotate-45" />
            </div>
          </button>
        </div>

        <div
          className={cn(
            "absolute top-0 left-0 w-4 md:w-8 lg:w-10 h-full transition-transform duration-700",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={{ backgroundColor: brandColor }}
        />

        <div
          className={cn(
            "absolute top-0 right-0 w-4 md:w-8 lg:w-10 h-full transition-transform duration-700",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          style={{ backgroundColor: brandColor }}
        />

        <div
          className={cn(
            "absolute bottom-0 left-0 w-full h-8 md:h-12 lg:h-16 flex items-center justify-center px-8 transition-transform duration-700",
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          )}
          style={{ backgroundColor: brandColor, color: 'white' }}
        >
          <div className="text-[7px] md:text-[8px] font-light tracking-[0.4em] uppercase opacity-60 text-center">
            {addressString} &bull; {site.business.email}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        body { 
          transition: transform 0.7s cubic-bezier(0.85, 0, 0.15, 1);
        }
        ${isMenuOpen ? 'body { transform: scale(0.98); overflow: hidden; height: 100vh; }' : ''}
      `}</style>
    </>
  );
};