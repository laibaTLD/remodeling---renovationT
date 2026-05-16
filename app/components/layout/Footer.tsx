'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeFonts, useThemeColors } from '@/app/hooks/useTheme';
import { usePrefersReducedMotion } from '@/app/hooks/usePrefersReducedMotion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import {
  ArrowUpRight,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Page } from '@/app/lib/types';
import { getFooterNavLinks } from '@/app/lib/siteContent';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterProps {
  page?: Page | null;
}

const isNonEmptyTiptap = (value: unknown): boolean => {
  if (!value) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).includes('"text"');
    } catch {
      return true;
    }
  }
  return false;
};

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const PARTICLE_LEFT = [5, 14, 22, 31, 40, 52, 61, 73, 82, 91, 8, 68, 44, 95];

function platformIcon(platform: string): LucideIcon {
  const p = platform.toLowerCase();
  if (p === 'facebook') return Facebook;
  if (p === 'instagram') return Instagram;
  if (p === 'linkedin') return Linkedin;
  if (p === 'youtube') return Youtube;
  if (p === 'x' || p === 'twitter') return Twitter;
  return Globe;
}

function FooterUnderlineLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const inner = (
    <span className="group/footer-link wb-text-on-dark-secondary relative inline-flex items-center gap-2 pb-0.5 text-[13px] font-light tracking-wide transition-colors duration-300 hover:text-[var(--wb-text-on-dark)] md:text-sm">
      <span className="relative">{children}</span>
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--wb-text-on-dark)_65%,transparent)] via-[color:color-mix(in_srgb,var(--wb-text-on-dark)_38%,transparent)] to-transparent transition-transform duration-500 ease-out group-hover/footer-link:scale-x-100"
        aria-hidden
      />
      <ArrowUpRight className="relative h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-300 group-hover/footer-link:translate-x-0.5 group-hover/footer-link:opacity-100" />
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--wb-primary)] focus-visible:ring-offset-2 focus-visible:wb-ring-offset-surface">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--wb-primary)] focus-visible:ring-offset-2 focus-visible:wb-ring-offset-surface">
      {inner}
    </Link>
  );
}

export const Footer: React.FC<FooterProps> = ({ page }) => {
  const { site, pages, currentPage } = useWebBuilder();
  const themeFonts = useThemeFonts();
  const themeColors = useThemeColors();
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const safePages = Array.isArray(pages) ? pages : [];

  const footerRef = useRef<HTMLElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const normalizePath = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.replace(/^\/+|\/+$/g, '').toLowerCase();
  };

  const resolvedPage = useMemo(() => {
    if (page) return page;
    if (currentPage) return currentPage;
    const pathKey = normalizePath(pathname);
    if (!pathKey) {
      return safePages.find((p) => p?.pageType === 'home') ?? null;
    }
    return safePages.find((p) => normalizePath(p?.slug) === pathKey) ?? null;
  }, [page, currentPage, pathname, safePages]);

  const pageOverrides = resolvedPage?.footerOverrides;
  const isPageOverrideActive = Boolean(pageOverrides?.enabled);
  const siteFooter = site?.footer;
  const business = site?.business;
  const address = business?.address;

  const normalizeHref = (href: unknown): string => {
    if (typeof href !== 'string') return '';
    const trimmed = href.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      return trimmed;
    }
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  };

  const brandColor = themeColors.primaryButton;

  const logoUrl = isNonEmptyString(siteFooter?.logo?.url)
    ? siteFooter.logo.url
    : isNonEmptyString(site?.theme?.logoUrl)
      ? site.theme.logoUrl
      : null;
  const businessName = isNonEmptyString(business?.name) ? business.name : isNonEmptyString(site?.name) ? site.name : null;
  const businessTagline = isNonEmptyString(business?.tagline) ? business.tagline : null;
  const logoAlt = siteFooter?.logo?.altText || businessName || 'Logo';

  const rawDescriptionCandidates: unknown[] = [siteFooter?.description, business?.description];
  const resolvedDescription: string | object | null =
    (rawDescriptionCandidates.find((d) => isNonEmptyString(d) || isNonEmptyTiptap(d)) as string | object | undefined) ?? null;
  const isDescriptionTiptap = !!resolvedDescription && typeof resolvedDescription === 'object';
  const descriptionString = isNonEmptyString(resolvedDescription) ? resolvedDescription : null;

  const showSocial = Boolean(siteFooter?.showSocialLinks);
  const socialLinks = showSocial ? (site?.socialLinks || []).filter((l) => isNonEmptyString(l?.url)) : [];

  const navLinks = useMemo(() => getFooterNavLinks(safePages), [safePages]);

  const siteColumns = !isPageOverrideActive
    ? (siteFooter?.columns || [])
        .map((col) => ({
          title: isNonEmptyString(col?.title) ? col.title : '',
          links: (col?.links || [])
            .filter((l) => isNonEmptyString(l?.label) && isNonEmptyString(l?.url))
            .map((l) => ({ label: l.label, url: normalizeHref(l.url) })),
        }))
        .filter((col) => col.links.length > 0)
    : [];

  const contactPhone = isNonEmptyString(business?.phone) ? business.phone : null;
  const contactEmail = isNonEmptyString(business?.email) ? business.email : null;
  const addressLine1 = isNonEmptyString(address?.street) ? address.street : null;
  const addressLine2Parts = [
    isNonEmptyString(address?.city) ? address.city : null,
    isNonEmptyString(address?.state) ? address.state : null,
    isNonEmptyString(address?.zipCode) ? address.zipCode : null,
  ].filter(Boolean) as string[];
  const addressLine2 = addressLine2Parts.length
    ? `${addressLine2Parts[0]}${addressLine2Parts[1] ? `, ${addressLine2Parts[1]}` : ''}${addressLine2Parts[2] ? ` ${addressLine2Parts[2]}` : ''}`
    : null;
  const addressCountry = isNonEmptyString(address?.country) ? address.country : null;
  const hasAddress = Boolean(addressLine1 || addressLine2 || addressCountry);
  const hasContact = Boolean(contactPhone || contactEmail || hasAddress);

  const overrideCopyright = isPageOverrideActive && isNonEmptyString(pageOverrides?.copyright) ? pageOverrides.copyright : null;
  const siteCopyright = isNonEmptyTiptap(siteFooter?.copyright) ? siteFooter?.copyright : null;
  const hasCopyright = Boolean(overrideCopyright || siteCopyright);

  const contactSectionTitle = site?.contactSection?.title;

  const hasBrand = Boolean(logoUrl || businessName || businessTagline || resolvedDescription || socialLinks.length > 0);
  const hasNav = navLinks.length > 0;
  const hasSiteColumns = siteColumns.length > 0;
  const hasAnyContent = hasBrand || hasNav || hasSiteColumns || hasContact || hasCopyright;

  const onFooterPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || !footerRef.current || !cursorGlowRef.current) return;
      const r = footerRef.current.getBoundingClientRect();
      gsap.to(cursorGlowRef.current, {
        x: e.clientX - r.left - 200,
        y: e.clientY - r.top - 200,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [reducedMotion]
  );

  const onFooterPointerLeave = useCallback(() => {
    if (!cursorGlowRef.current || reducedMotion) return;
    gsap.to(cursorGlowRef.current, { opacity: 0, duration: 0.45, ease: 'power2.in' });
  }, [reducedMotion]);

  const onFooterPointerEnter = useCallback(() => {
    if (!cursorGlowRef.current || reducedMotion) return;
    gsap.to(cursorGlowRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, [reducedMotion]);

  useEffect(() => {
    if (!hasAnyContent || !footerRef.current) return;

    if (reducedMotion) {
      const reveals = footerRef.current.querySelectorAll('[data-footer-reveal]');
      gsap.set(reveals, { opacity: 1, y: 0, clearProps: 'transform' });
      footerRef.current.querySelectorAll('[data-footer-line]').forEach((el) => gsap.set(el, { scaleX: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      const root = footerRef.current;
      if (!root) return;

      const reveals = root.querySelectorAll('[data-footer-reveal]');
      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 92%',
            },
          }
        );
      }

      root.querySelectorAll<HTMLElement>('[data-footer-line]').forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.15,
            ease: 'power2.inOut',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: line,
              start: 'top 96%',
            },
          }
        );
      });

      if (meshRef.current) {
        gsap.to(meshRef.current, {
          backgroundPosition: '100% 40%',
          duration: 20,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }
      if (orbARef.current) {
        gsap.to(orbARef.current, {
          xPercent: 10,
          yPercent: -8,
          duration: 16,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }
      if (orbBRef.current) {
        gsap.to(orbBRef.current, {
          xPercent: -12,
          yPercent: 10,
          duration: 20,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      const dots = particlesRef.current?.querySelectorAll<HTMLElement>('.footer-particle');
      dots?.forEach((dot, i) => {
        gsap.to(dot, {
          y: gsap.utils.random(10, 28) * (i % 2 === 0 ? 1 : -1),
          opacity: gsap.utils.random(0.08, 0.28),
          duration: gsap.utils.random(4, 7),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.08,
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, [hasAnyContent, reducedMotion]);

  if (!hasAnyContent) return null;

  const eyebrowClass = 'wb-text-on-dark-secondary text-[10px] font-semibold uppercase tracking-[0.38em] opacity-70';

  return (
    <footer
      ref={footerRef}
      onPointerMove={onFooterPointerMove}
      onPointerEnter={onFooterPointerEnter}
      onPointerLeave={onFooterPointerLeave}
      className="footer-premium wb-bg-section-dark wb-text-on-dark relative isolate w-full overflow-hidden"
    >
      <div
        ref={meshRef}
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(115deg, color-mix(in srgb, ${brandColor} 18%, transparent) 0%, transparent 42%, color-mix(in srgb, var(--wb-text-on-dark) 5%, transparent) 55%, color-mix(in srgb, ${brandColor} 12%, transparent) 100%)`,
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 40%',
        }}
        aria-hidden
      />
      <div
        ref={orbARef}
        className="pointer-events-none absolute -left-[18%] top-[25%] h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full opacity-30 blur-[100px]"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${brandColor} 38%, transparent), transparent 68%)`,
        }}
        aria-hidden
      />
      <div
        ref={orbBRef}
        className="pointer-events-none absolute -right-[12%] bottom-[15%] h-[min(48vw,360px)] w-[min(48vw,360px)] rounded-full opacity-25 blur-[90px]"
        style={{ background: `radial-gradient(circle, color-mix(in srgb, var(--wb-text-on-dark) 9%, transparent) 0%, transparent 70%)` }}
        aria-hidden
      />

      <div ref={particlesRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {PARTICLE_LEFT.map((left, i) => (
          <span
            key={i}
            className="footer-particle absolute rounded-full bg-[var(--wb-text-on-dark)]"
            style={{
              left: `${left}%`,
              top: `${(i * 41 + 7) % 85}%`,
              width: 2,
              height: 2,
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      <div
        ref={cursorGlowRef}
        className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full opacity-0 blur-3xl"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${brandColor} 28%, transparent) 0%, transparent 65%)`,
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:color-mix(in_srgb,var(--wb-text-on-dark)_12%,transparent)] to-transparent" aria-hidden />

      <div className="relative z-[1] mx-auto max-w-[1320px] px-6 pb-16 pt-20 sm:px-10 md:px-14 md:pb-20 md:pt-24 lg:px-20">
        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-12 lg:gap-x-20">
          {hasBrand && (
            <div data-footer-reveal className="md:col-span-12 lg:col-span-5 flex flex-col gap-8">
              {logoUrl && (
                <div className="relative h-16 w-auto self-start md:h-20" style={{ minWidth: 140 }}>
                  <OptimizedImage
                    src={getImageSrc(logoUrl)}
                    alt={logoAlt}
                    fill
                    sizes="(max-width: 768px) 160px, 220px"
                    className="object-contain object-left opacity-95"
                  />
                </div>
              )}

              {(businessName || businessTagline) && (
                <div className="space-y-3">
                  {businessName && (
                    <h2
                      className="max-w-[16ch] text-balance text-[clamp(1.75rem,3.5vw,2.75rem)] font-extralight uppercase leading-[1.05] tracking-[0.14em] wb-text-on-dark"
                      style={{
                        fontFamily: themeFonts.heading ? `${themeFonts.heading}, var(--font-heading, ui-serif)` : 'var(--font-heading, ui-serif)',
                      }}
                    >
                      {businessName}
                    </h2>
                  )}
                  {businessTagline && <p className={eyebrowClass}>{businessTagline}</p>}
                </div>
              )}

              {resolvedDescription && (
                <div
                  className="wb-text-on-dark-secondary max-w-md text-sm font-light leading-relaxed md:text-[15px]"
                  style={{
                    fontFamily: themeFonts.body ? `${themeFonts.body}, ui-sans-serif, system-ui` : undefined,
                  }}
                >
                  {isDescriptionTiptap ? <TiptapRenderer content={resolvedDescription} as="inline" /> : <p>{descriptionString}</p>}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {socialLinks.map((link, idx) => {
                    const platformKey =
                      typeof link.platform === 'string' ? link.platform : String(link.platform || 'social');
                    const Icon = platformIcon(platformKey);
                    return (
                      <a
                        key={link.url || `social-${idx}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      className="group/soc wb-text-on-dark-secondary relative flex h-11 w-11 items-center justify-center rounded-full border wb-border-on-dark wb-glass-on-dark backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:text-[var(--wb-text-on-dark)] hover:border-[color:color-mix(in_srgb,var(--wb-text-on-dark)_22%,transparent)] hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--wb-section-bg-dark)_60%,transparent)]"
                        style={{
                          boxShadow: `0 0 0 1px color-mix(in srgb, ${brandColor} 12%, transparent)`,
                        }}
                        aria-label={platformKey}
                      >
                        <Icon className="relative z-[1] h-4 w-4" strokeWidth={1.35} />
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover/soc:opacity-100"
                          style={{
                            background: `radial-gradient(circle, color-mix(in srgb, ${brandColor} 45%, transparent), transparent 70%)`,
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {hasNav && (
            <div data-footer-reveal className="md:col-span-6 lg:col-span-3 flex flex-col gap-6 md:pt-4 lg:pt-2">
              <h3 className={`${eyebrowClass}`}>Explore</h3>
              <div data-footer-line className="h-px w-full max-w-[120px] origin-left scale-x-0 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--wb-text-on-dark)_32%,transparent)] to-transparent" aria-hidden />
              <nav className="flex flex-col gap-4" aria-label="Footer site links">
                {navLinks.map((link, idx) => {
                  const isExternal = link.href.startsWith('http://') || link.href.startsWith('https://');
                  return (
                    <FooterUnderlineLink key={`${link.href}-${idx}`} href={link.href} external={isExternal}>
                      {link.label}
                    </FooterUnderlineLink>
                  );
                })}
              </nav>
            </div>
          )}

          {hasContact && (
            <div data-footer-reveal className="md:col-span-6 lg:col-span-4 flex flex-col gap-6 md:pt-4 lg:pt-2">
              {isNonEmptyTiptap(contactSectionTitle) || isNonEmptyString(contactSectionTitle) ? (
                <h3 className={eyebrowClass}>
                  {typeof contactSectionTitle === 'string' ? contactSectionTitle : <TiptapRenderer content={contactSectionTitle} as="inline" />}
                </h3>
              ) : (
                <h3 className={eyebrowClass}>Contact</h3>
              )}
              <div data-footer-line className="h-px w-full max-w-[120px] origin-left scale-x-0 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--wb-text-on-dark)_32%,transparent)] to-transparent" aria-hidden />
              <ul className="flex flex-col gap-5 text-sm">
                {contactPhone && (
                  <li>
                    <a
                      href={`tel:${contactPhone}`}
                      className="group/contact wb-text-on-dark-secondary inline-flex items-start gap-3 transition-colors hover:text-[var(--wb-text-on-dark)]"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border wb-border-on-dark wb-glass-on-dark transition-all duration-300 group-hover/contact:border-[color:color-mix(in_srgb,var(--wb-text-on-dark)_22%,transparent)] group-hover/contact:shadow-[0_0_20px_-4px_color-mix(in_srgb,var(--wb-text-on-dark)_10%,transparent)]">
                        <Phone className="h-3.5 w-3.5" strokeWidth={1.25} />
                      </span>
                      <span className="pt-1 text-[15px] font-light tracking-wide">{contactPhone}</span>
                    </a>
                  </li>
                )}
                {contactEmail && (
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="group/contact wb-text-on-dark-secondary inline-flex items-start gap-3 break-all transition-colors hover:text-[var(--wb-text-on-dark)]"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border wb-border-on-dark wb-glass-on-dark transition-all duration-300 group-hover/contact:border-[color:color-mix(in_srgb,var(--wb-text-on-dark)_22%,transparent)] group-hover/contact:shadow-[0_0_20px_-4px_color-mix(in_srgb,var(--wb-text-on-dark)_10%,transparent)]">
                        <Mail className="h-3.5 w-3.5" strokeWidth={1.25} />
                      </span>
                      <span className="pt-1 text-[15px] font-light tracking-wide">{contactEmail}</span>
                    </a>
                  </li>
                )}
                {hasAddress && (
                  <li className="flex items-start gap-3 wb-text-on-dark-secondary">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border wb-border-on-dark wb-glass-on-dark">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.25} />
                    </span>
                    <address className="not-italic text-[13px] font-light leading-relaxed tracking-wide md:text-sm">
                      {addressLine1 && (
                        <>
                          {addressLine1}
                          <br />
                        </>
                      )}
                      {addressLine2 && (
                        <>
                          {addressLine2}
                          <br />
                        </>
                      )}
                      {addressCountry && <>{addressCountry}</>}
                    </address>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {hasSiteColumns && (
          <div data-footer-reveal className="mt-20 border-t wb-border-on-dark pt-16 md:mt-24 md:pt-20">
            <div className="grid grid-cols-2 gap-x-10 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-16">
              {siteColumns.map((col, colIdx) => (
                <div key={`${col.title}-${colIdx}`} className="flex flex-col gap-5">
                  {col.title && <h3 className={eyebrowClass}>{col.title}</h3>}
                  <div data-footer-line className="h-px w-full max-w-[100px] origin-left scale-x-0 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--wb-text-on-dark)_28%,transparent)] to-transparent" aria-hidden />
                  <nav className="flex flex-col gap-3" aria-label={col.title || 'Footer links'}>
                    {col.links.map((link, linkIdx) => {
                      const isExternal = link.url.startsWith('http://') || link.url.startsWith('https://');
                      return (
                        <FooterUnderlineLink key={`${link.url}-${linkIdx}`} href={link.url} external={isExternal}>
                          {link.label}
                        </FooterUnderlineLink>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasCopyright && (
        <div data-footer-reveal className="relative border-t wb-border-on-dark">
          <div data-footer-line className="absolute left-0 top-0 hidden h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--wb-text-on-dark)_18%,transparent)] via-transparent to-[color:color-mix(in_srgb,var(--wb-text-on-dark)_18%,transparent)] md:block" aria-hidden />
          <div className="mx-auto max-w-[1320px] px-6 py-8 sm:px-10 md:px-14 lg:px-20">
            <div className="wb-text-on-dark-secondary flex flex-col gap-2 text-[11px] font-light uppercase tracking-[0.28em] opacity-75 md:flex-row md:items-center md:justify-between">
              {overrideCopyright ? (
                <span>{overrideCopyright}</span>
              ) : siteCopyright ? (
                <div className="normal-case tracking-normal opacity-85">
                  <TiptapRenderer content={siteCopyright} as="inline" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
