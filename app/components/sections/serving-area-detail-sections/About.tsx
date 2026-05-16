'use client';

import React from 'react';
import type { Page } from '@/app/lib/types';
import { AboutSection } from '@/app/components/sections/AboutSection';

interface AboutProps {
  about: unknown;
  className?: string;
}

type AboutSectionData = NonNullable<Page['aboutSection']>;

function normalizeImage(raw: unknown): AboutSectionData['image'] | undefined {
  if (!raw) return undefined;
  if (typeof raw === 'string' && raw.trim()) {
    return { url: raw.trim() };
  }
  if (typeof raw === 'object' && raw !== null && 'url' in raw) {
    const record = raw as { url?: string; altText?: string };
    if (record.url?.trim()) {
      return { url: record.url.trim(), altText: record.altText };
    }
  }
  return undefined;
}

function normalizeAboutSection(about: unknown): AboutSectionData | null {
  if (!about || typeof about !== 'object') return null;

  const data = about as Record<string, unknown>;
  if (data.enabled === false) return null;

  const features = Array.isArray(data.features)
    ? (data.features as AboutSectionData['features']).filter((f) => f?.label?.trim())
    : [];

  const image = normalizeImage(data.image);
  const title = data.title as AboutSectionData['title'];
  const description = data.description as AboutSectionData['description'];

  if (!title && !description && !image && features.length === 0) return null;

  return {
    enabled: true,
    title,
    description,
    features,
    image,
  };
}

/** Service area about — same layout as site AboutSection. */
export const About: React.FC<AboutProps> = ({ about, className }) => {
  const aboutSection = normalizeAboutSection(about);
  if (!aboutSection) return null;

  return <AboutSection aboutSection={aboutSection} className={className} />;
};

export default About;
