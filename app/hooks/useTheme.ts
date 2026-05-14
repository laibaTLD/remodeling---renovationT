'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

export interface ThemeColors {
  // Text colors
  mainText: string;
  secondaryText: string;
  darkPrimaryText: string;
  darkSecondaryText: string;
  lightPrimaryText: string;
  lightSecondaryText: string;
  // Background colors
  pageBackground: string;
  sectionBackground: string;
  sectionBackgroundLight: string;
  sectionBackgroundDark: string;
  cardBackground: string;
  cardBackgroundLight: string;
  cardBackgroundDark: string;
  // Button/UI colors
  primaryButton: string;
  primaryButtonLight: string;
  primaryButtonDark: string;
  hoverActive: string;
  hoverActiveLight: string;
  hoverActiveDark: string;
  inactive: string;
  inactiveLight: string;
  inactiveDark: string;

}

export interface ThemeFonts {
  heading?: string;
  body?: string;
}

export function useThemeColors(): ThemeColors {
  const { site } = useWebBuilder();
  const theme = site?.theme;

  return {
    // These now refer to the CSS variables that are injected by ThemeFontWrapper
    mainText: 'var(--wb-text-main)',
    secondaryText: 'var(--wb-text-secondary)',
    darkPrimaryText: 'var(--wb-text-on-dark)',
    darkSecondaryText: 'var(--wb-text-on-dark-secondary)',
    lightPrimaryText: 'var(--wb-text-main)',
    lightSecondaryText: 'var(--wb-text-secondary)',
    pageBackground: 'var(--wb-page-bg)',
    sectionBackground: 'var(--wb-section-bg-light)',
    sectionBackgroundLight: 'var(--wb-section-bg-light)',
    sectionBackgroundDark: 'var(--wb-section-bg-dark)',
    cardBackground: 'var(--wb-card-bg-light)',
    cardBackgroundLight: 'var(--wb-card-bg-light)',
    cardBackgroundDark: 'var(--wb-card-bg-dark)',
    primaryButton: 'var(--wb-primary)',
    primaryButtonLight: 'var(--wb-primary)',
    primaryButtonDark: 'var(--wb-primary)',
    hoverActive: 'var(--wb-primary-hover)',
    hoverActiveLight: 'var(--wb-primary-hover)',
    hoverActiveDark: 'var(--wb-primary-hover)',
    inactive: 'var(--color-gray-400)',
    inactiveLight: 'var(--color-gray-300)',
    inactiveDark: 'var(--color-gray-600)',
  };
}

export function useThemeFonts(): ThemeFonts {
  const { site } = useWebBuilder();
  return {
    heading: site?.theme?.headingFont,
    body: site?.theme?.bodyFont,
  };
}
