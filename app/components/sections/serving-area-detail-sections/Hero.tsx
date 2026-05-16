'use client';

import React from 'react';
import type { Page } from '@/app/lib/types';
import { HeroSection as CinematicHeroSection } from '@/app/components/sections/HeroSection';

interface HeroSectionProps {
  hero?: Page['hero'];
  className?: string;
}

/** Service area hero — same cinematic layout as the site home hero, without the intro loader. */
export const HeroSection: React.FC<HeroSectionProps> = ({ hero, className }) => {
  if (!hero || hero.enabled === false) return null;

  return <CinematicHeroSection hero={hero} skipIntro className={className} />;
};

export default HeroSection;
