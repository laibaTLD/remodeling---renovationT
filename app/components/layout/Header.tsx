'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useHeroIntro } from '@/app/providers/HeroIntroProvider';
import {
  getBrandName,
  getBusinessAddressLine,
  getCopyrightText,
  getHomePageLabel,
  getMenuFooterLine,
  getHeaderNavItems,
  getPrimaryHeroImageFromPages,
  getTestimonialsNavItem,
  splitHeaderNavItems,
} from '@/app/lib/siteContent';

const HeaderMenuDistortion = dynamic(
  () => import('@/app/components/cinematic/HeaderMenuDistortion'),
  { ssr: false }
) as React.ComponentType<{
  imageUrl: string;
  mouse: MutableRefObject<{ x: number; y: number }>;
  className?: string;
}>;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('inline-flex', className)} aria-hidden>
      {text.split('').map((char, i) => (
        <span key={`${char}-${i}`} className="hdr-menu-char inline-block overflow-hidden">
          <span className="hdr-menu-char-inner inline-block will-change-transform">
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}

function MagneticLink({
  href,
  children,
  className,
  onClick,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const wrap = wrapRef.current;
    const link = linkRef.current;
    const line = lineRef.current;

    if (!wrap || !link) return;

    const rect = wrap.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.18;

    gsap.to(link, {
      x,
      y,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: true,
    });

    if (line) {
      gsap.to(line, {
        scaleX: 1,
        duration: 0.45,
        ease: 'power3.out',
      });
    }
  }, []);

  const onLeave = useCallback(() => {
    const link = linkRef.current;
    const line = lineRef.current;

    if (link) {
      gsap.to(link, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power4.out',
      });
    }

    if (line) {
      gsap.to(line, {
        scaleX: 0,
        duration: 0.45,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <span
      ref={wrapRef}
      className={cn('relative inline-flex flex-col items-center', className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Link
        ref={linkRef}
        href={href}
        onClick={onClick}
        className="relative inline-block will-change-transform"
        style={style}
      >
        {children}
      </Link>

      <span
        ref={lineRef}
        className="mt-1 block h-px w-full origin-left scale-x-0"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent)',
        }}
        aria-hidden
      />
    </span>
  );
}

function HamburgerButton({
  open,
  onClick,
  className,
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  const topRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const top = topRef.current;
    const bot = botRef.current;

    if (!top || !bot) return;

    if (open) {
      gsap.to(top, {
        y: 5,
        rotate: 45,
        duration: 0.55,
        ease: 'power3.inOut',
      });

      gsap.to(bot, {
        y: -5,
        rotate: -45,
        width: '100%',
        duration: 0.55,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(top, {
        y: 0,
        rotate: 0,
        duration: 0.55,
        ease: 'power3.inOut',
      });

      gsap.to(bot, {
        y: 0,
        rotate: 0,
        width: '62%',
        duration: 0.55,
        ease: 'power3.inOut',
      });
    }
  }, [open]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex h-11 w-11 flex-col items-end justify-center gap-[7px]',
        className
      )}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/[0.08]" />

      <span
        ref={topRef}
        className="relative z-10 block h-px w-full bg-white/90"
      />

      <span
        ref={botRef}
        className="relative z-10 block h-px w-[62%] bg-white/90"
      />
    </button>
  );
}

export const Header: React.FC = () => {
  const { site, pages } = useWebBuilder();

  const themeFonts = useThemeFonts();
  const themeColors = useThemeColors();

  const { isHeroIntroPending } = useHeroIntro();

  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBgRef = useRef<HTMLDivElement>(null);

  const menuMouse = useRef({ x: 0, y: 0 });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const brandName = getBrandName(site);
  const brandDisplay = brandName.toUpperCase();

  const headingFont =
    themeFonts.heading || site?.theme?.headingFont || 'inherit';

  const bodyFont =
    themeFonts.body || site?.theme?.bodyFont || 'inherit';

  const brandColor =
    themeColors.primaryButton || themeColors.mainText;

  const menuFooterLine = getMenuFooterLine(site);
  const addressLine = getBusinessAddressLine(site);
  const copyrightText = getCopyrightText(site);
  const homeLabel = getHomePageLabel(pages);

  const menuBg = useMemo(
    () => getPrimaryHeroImageFromPages(pages),
    [pages]
  );

  const testimonialsNav = useMemo(
    () => getTestimonialsNavItem(pages),
    [pages]
  );

  const headerNavItems = useMemo(
    () => getHeaderNavItems(pages),
    [pages]
  );

  const { leftNavItems, rightNavItems } = useMemo(
    () => splitHeaderNavItems(testimonialsNav, headerNavItems),
    [testimonialsNav, headerNavItems]
  );

  const menuLinks = useMemo(() => {
    const home = homeLabel
      ? [{ id: 'home', name: homeLabel, href: '/' }]
      : [];

    const rest = [...leftNavItems, ...rightNavItems].map((item) => ({
      id: item.id,
      name: item.name,
      href: item.href,
    }));

    const combined = [
      ...home,
      ...rest.filter((item) => !(item.href === '/' && home.length > 0)),
    ];

    const seen = new Set<string>();

    return combined.filter((item) => {
      if (seen.has(item.href)) return false;

      seen.add(item.href);

      return true;
    });
  }, [leftNavItems, rightNavItems, homeLabel]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((v) => !v), []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    setPrefersReducedMotion(mq.matches);

    const fn = () => setPrefersReducedMotion(mq.matches);

    mq.addEventListener('change', fn);

    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!shellRef.current) return;

    const shell = shellRef.current;

    if (isHeroIntroPending) {
      gsap.set(shell, {
        yPercent: -110,
        opacity: 0,
      });

      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(shell, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.hdr-item', {
        y: -24,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.15,
      });
    }, headerRef);

    return () => ctx.revert();
  }, [isHeroIntroPending]);

  useEffect(() => {
    if (!shellRef.current) return;

    const shell = shellRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();

          setIsScrolled(y > 24);

          if (progressRef.current) {
            gsap.set(progressRef.current, {
              scaleX: self.progress,
            });
          }
        },
      });

      let lastY = 0;

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();

          if (y < 60) {
            gsap.to(shell, {
              yPercent: 0,
              duration: 0.45,
            });

            lastY = y;
            return;
          }

          if (y > lastY + 8) {
            gsap.to(shell, {
              yPercent: -110,
              duration: 0.6,
              ease: 'power3.inOut',
            });
          } else if (y < lastY - 8) {
            gsap.to(shell, {
              yPercent: 0,
              duration: 0.6,
              ease: 'power3.out',
            });
          }

          lastY = y;
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;

    if (isMenuOpen) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.set(menu, { pointerEvents: 'auto' })
          .fromTo(
            menu,
            {
              clipPath: 'inset(0% 0% 100% 0%)',
              opacity: 0,
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: 1,
              ease: 'power4.inOut',
            }
          )
          .from(
            '.hdr-menu-char-inner',
            {
              yPercent: 110,
              opacity: 0,
              duration: 0.9,
              stagger: 0.02,
              ease: 'power4.out',
            },
            0.2
          );
      });

      return () => ctx.revert();
    }

    gsap.to(menu, {
      clipPath: 'inset(0% 0% 100% 0%)',
      opacity: 0,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(menu, { pointerEvents: 'none' });
      },
    });
  }, [isMenuOpen]);

  if (!site) return null;

  return (
    <>
      <div
        ref={progressRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-px w-full origin-left scale-x-0"
        style={{
          background: `linear-gradient(to right, ${brandColor}, transparent)`,
        }}
      />

      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[100]"
      >
        <div
          ref={shellRef}
          className="pointer-events-auto will-change-transform"
        >
          <div
            className={cn(
              'relative transition-all duration-700',
              isScrolled
                ? 'backdrop-blur-2xl'
                : 'backdrop-blur-md'
            )}
            style={{
              background: isScrolled
                ? 'rgba(0,0,0,0.28)'
                : 'transparent',
              borderBottom: isScrolled
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid transparent',
              boxShadow: isScrolled
                ? '0 10px 40px rgba(0,0,0,0.18)'
                : 'none',
            }}
          >
            {/* top glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    to bottom,
                    rgba(255,255,255,0.08),
                    transparent
                  )
                `,
              }}
            />

            {/* animated line */}
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{
                background: `
                  linear-gradient(
                    to right,
                    transparent,
                    ${brandColor},
                    transparent
                  )
                `,
                opacity: isScrolled ? 0.7 : 0.2,
              }}
            />

            <div className="container relative mx-auto flex min-h-[78px] items-center px-5 md:px-8 lg:px-12">
              {/* left nav */}
              <nav
                className="hdr-item hidden min-w-0 flex-1 items-center gap-5 md:flex lg:gap-6"
                aria-label="Primary"
              >
                {leftNavItems.map((item) => (
                  <MagneticLink
                    key={item.id}
                    href={item.href}
                    className="shrink-0 whitespace-nowrap text-[10px] uppercase tracking-[0.32em] text-white/60 transition-colors hover:text-white"
                    style={{ fontFamily: bodyFont }}
                  >
                    {item.name}
                  </MagneticLink>
                ))}
              </nav>

              {/* logo */}
              <Link
                href="/"
                className="hdr-item group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-label={brandName || site.name}
              >
                {site.theme?.logoUrl ? (
                  <OptimizedImage
                    src={getImageSrc(site.theme.logoUrl)}
                    alt={brandName || site.name}
                    width={130}
                    height={42}
                    className="h-8 w-auto object-contain transition-all duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span
                    className="block text-[clamp(0.9rem,1vw,1rem)] font-light uppercase tracking-[0.35em] text-white"
                    style={{
                      fontFamily: headingFont,
                    }}
                  >
                    {brandDisplay}
                  </span>
                )}
              </Link>

              {/* desktop nav */}
              <div className="hdr-item flex flex-1 items-center justify-end gap-4">
                <nav className="hidden items-center gap-5 md:flex">
                  {rightNavItems.map((item) => (
                    <MagneticLink
                      key={item.id}
                      href={item.href}
                      className="text-[10px] uppercase tracking-[0.3em] text-white/60 transition-all hover:text-white"
                      style={{ fontFamily: bodyFont }}
                    >
                      {item.name}
                    </MagneticLink>
                  ))}
                </nav>

                {/* mobile button */}
                <HamburgerButton
                  open={isMenuOpen}
                  onClick={toggleMenu}
                  className="md:hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* fullscreen menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[200] flex flex-col bg-[#050505] opacity-0"
        style={{
          clipPath: 'inset(0% 0% 100% 0%)',
          pointerEvents: 'none',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {menuBg ? (
            <>
              <div
                ref={menuBgRef}
                className="absolute inset-0 scale-110 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${menuBg})`,
                  filter:
                    'brightness(0.35) saturate(0.85) contrast(1.05)',
                }}
              />

              {isMenuOpen && (
                <HeaderMenuDistortion
                  imageUrl={menuBg}
                  mouse={menuMouse}
                  className="absolute inset-0 opacity-40 mix-blend-soft-light"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}

          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-end px-5 py-6 md:px-10">
            <button
              type="button"
              onClick={closeMenu}
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition-colors hover:text-white"
              style={{
                fontFamily: bodyFont,
              }}
            >
              Close
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
            {menuLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMenu}
                className="group relative overflow-hidden py-2"
                style={{
                  fontFamily: headingFont,
                }}
              >
                <span className="block text-[clamp(2.7rem,8vw,6rem)] font-light uppercase leading-none tracking-[0.08em] text-white/90 transition-all duration-500 group-hover:text-white">
                  <SplitChars text={item.name} />
                </span>

                <span
                  className="mt-2 block h-px w-0 transition-all duration-700 group-hover:w-full"
                  style={{
                    background: `
                      linear-gradient(
                        to right,
                        transparent,
                        ${brandColor},
                        transparent
                      )
                    `,
                  }}
                />
              </Link>
            ))}
          </nav>

          {(menuFooterLine || addressLine || copyrightText) && (
            <div className="flex items-end justify-between border-t border-white/10 px-5 py-6 md:px-10">
              {(menuFooterLine || addressLine) && (
                <p
                  className="max-w-xs text-[11px] leading-relaxed text-white/35"
                  style={{
                    fontFamily: bodyFont,
                  }}
                >
                  {menuFooterLine || addressLine}
                </p>
              )}

              {copyrightText && (
                <p className="text-[10px] tracking-[0.22em] text-white/30">
                  {copyrightText}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .hdr-menu-char {
          perspective: 520px;
        }

        .hdr-menu-char-inner {
          transform-origin: 50% 100%;
        }
      `}</style>
    </>
  );
};