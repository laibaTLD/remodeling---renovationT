'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

type HeroIntroContextValue = {
  isHeroIntroPending: boolean;
  beginHeroIntro: () => void;
  completeHeroIntro: () => void;
};

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null);

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomeRoute = pathname === '/';
  const { pages } = useWebBuilder();

  const introExpected = useMemo(
    () => Boolean(pages?.find((p) => p.pageType === 'home')?.hero?.enabled),
    [pages]
  );

  const [introActive, setIntroActive] = useState(false);

  useEffect(() => {
    setIntroActive(introExpected && isHomeRoute);
  }, [introExpected, isHomeRoute]);

  const beginHeroIntro = useCallback(() => {
    setIntroActive(true);
  }, []);

  const completeHeroIntro = useCallback(() => {
    setIntroActive(false);
  }, []);

  const isHeroIntroPending = introExpected && introActive && isHomeRoute;

  useEffect(() => {
    document.documentElement.classList.toggle('hero-intro-active', isHeroIntroPending);
    return () => {
      document.documentElement.classList.remove('hero-intro-active');
    };
  }, [isHeroIntroPending]);

  const value = useMemo(
    () => ({
      isHeroIntroPending,
      beginHeroIntro,
      completeHeroIntro,
    }),
    [isHeroIntroPending, beginHeroIntro, completeHeroIntro]
  );

  return (
    <HeroIntroContext.Provider value={value}>{children}</HeroIntroContext.Provider>
  );
}

export function useHeroIntro(): HeroIntroContextValue {
  const ctx = useContext(HeroIntroContext);
  if (!ctx) {
    return {
      isHeroIntroPending: false,
      beginHeroIntro: () => {},
      completeHeroIntro: () => {},
    };
  }
  return ctx;
}
