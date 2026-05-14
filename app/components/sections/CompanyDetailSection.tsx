'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
   gsap.registerPlugin(ScrollTrigger);
}

interface CompanyDetailSectionProps {
   companyDetailSection: Page['companyDetailSection'];
   className?: string;
}

export const CompanyDetailSection: React.FC<CompanyDetailSectionProps> = ({ companyDetailSection, className }) => {
   const themeColors = useThemeColors();
   const containerRef = useRef<HTMLDivElement>(null);
   const stickyTitleRef = useRef<HTMLDivElement>(null);
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   useEffect(() => {
      if (!isMounted || !companyDetailSection?.enabled) return;

      const timer = setTimeout(() => {
         const ctx = gsap.context(() => {
            
            // 1. HERO PINNING (The Caledonian "Philosophy" Title)
            if (stickyTitleRef.current) {
               ScrollTrigger.create({
                  trigger: stickyTitleRef.current,
                  start: "top top",
                  end: "bottom top",
                  pin: true,
                  pinSpacing: false,
                  scrub: true,
               });

               gsap.to(stickyTitleRef.current.querySelector('.title-inner'), {
                  scale: 0.9,
                  opacity: 0,
                  ease: 'none',
                  scrollTrigger: {
                     trigger: stickyTitleRef.current,
                     start: 'top top',
                     end: 'bottom top',
                     scrub: true,
                  }
               });
            }

            // 2. SUB-SECTION PARALLAX & PINNING
            const sections = gsap.utils.toArray<HTMLElement>('.story-journey-part');
            sections.forEach((section) => {
               const imgContainer = section.querySelector('.story-image-container');
               const img = section.querySelector('.story-image-container img');
               const bar = section.querySelector('.story-detail-bar');

               // PIN THE IMAGE: It stays fixed while the bar scrolls over it
               if (imgContainer) {
                  ScrollTrigger.create({
                     trigger: imgContainer,
                     start: "top top",
                     endTrigger: bar, // Keep pinned until the text bar finishes
                     end: "bottom bottom",
                     pin: true,
                     pinSpacing: false,
                  });
               }

               // IMAGE INTERNAL PARALLAX: The image moves inside its pinned container
               if (img) {
                  gsap.fromTo(img, 
                     { yPercent: -15, scale: 1.1 },
                     {
                        yPercent: 15,
                        scale: 1.2,
                        ease: 'none',
                        scrollTrigger: {
                           trigger: section,
                           start: 'top bottom',
                           end: 'bottom top',
                           scrub: true
                        }
                     }
                  );
               }

               // TEXT REVEAL
               if (bar) {
                  gsap.fromTo(bar.querySelectorAll('.reveal-text'),
                     { opacity: 0, y: 100 },
                     {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1.5,
                        ease: 'power4.out',
                        scrollTrigger: {
                           trigger: bar,
                           start: "top 80%",
                        }
                     }
                  );
               }
            });

         }, containerRef);

         return () => ctx.revert();
      }, 100);

      return () => clearTimeout(timer);
   }, [companyDetailSection, isMounted]);

   if (!companyDetailSection?.enabled) return null;

   const details = companyDetailSection.details || [];
   const brandColor = themeColors.primaryButton;

   return (
      <div 
         ref={containerRef} 
         className={cn("relative w-full overflow-hidden", className)} 
         style={{ backgroundColor: brandColor }} 
      >
         {/* PHASE 1: HERO TITLE */}
         <section
            ref={stickyTitleRef}
            className="relative h-screen w-full flex items-center justify-center z-10"
            style={{ backgroundColor: themeColors.pageBackground }}
         >
            <div className="title-inner w-full text-center select-none px-6">
               {companyDetailSection.title && (
                  <h2 className="text-[10vw] md:text-[12vw] font-bold uppercase tracking-[-0.05em] leading-none" style={{ color: brandColor }}>
                     <TiptapRenderer content={companyDetailSection.title} as="inline" />
                  </h2>
               )}
            </div>
         </section>

         {/* PHASE 2: SUB-SECTIONS */}
         <div className="relative z-20 w-full">
            {details.map((d, idx) => {
               const imageUrl = getImageSrc(d.image?.url);
               const title = d.title || d.label;
               const description = d.description || d.value;

               return (
                  <div key={idx} className="story-journey-part relative w-full">
                     {/* PINNED IMAGE CONTAINER */}
                     <section className="story-image-container relative h-screen w-full overflow-hidden">
                        <OptimizedImage
                           src={imageUrl}
                           alt={d.image?.altText || ''}
                           fill
                           sizes="100vw"
                           className="object-cover"
                        />
                        {/* Architectural Overlay UI */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center">
                               <div className="w-1 h-1 bg-white rounded-full shadow-xl" />
                           </div>
                           <div className="absolute text-white/40 text-[11px] tracking-[1em] mt-48 uppercase font-light">
                              Vision 0{idx + 1}
                           </div>
                        </div>
                     </section>

                     {/* TEXT BAR: This slides over the image */}
                     <section 
                        className="story-detail-bar relative z-30 py-32 md:py-48 px-8 md:px-16 lg:px-24 w-full" 
                        style={{ backgroundColor: brandColor }}
                     >
                        <div className="max-w-7xl mx-auto">
                           <div className="flex flex-col gap-12">
                              <div className="border-l border-white/30 pl-8 md:pl-12">
                                 <span className="reveal-text block text-[10px] font-bold tracking-[0.6em] uppercase text-white/40 mb-8">
                                    {d.label || `Part 0${idx + 1}`}
                                 </span>
                                 <h3 className="reveal-text text-5xl md:text-7xl lg:text-8xl font-sans font-light uppercase tracking-tighter text-white leading-[0.85]">
                                    <TiptapRenderer content={title} as="inline" />
                                 </h3>
                              </div>

                              <div className="max-w-2xl ml-auto md:mr-12">
                                 <div className="reveal-text text-white/70 text-lg md:text-2xl font-light leading-relaxed">
                                    <TiptapRenderer content={description} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default CompanyDetailSection;