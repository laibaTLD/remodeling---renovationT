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
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

type HeroIntroContextValue = {
  isHeroIntroPending: boolean;
  beginHeroIntro: () => void;
  completeHeroIntro: () => void;
};

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null);

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const { pages } = useWebBuilder();

  const introExpected = useMemo(
    () => Boolean(pages?.find((p) => p.pageType === 'home')?.hero?.enabled),
    [pages]
  );

  const [introActive, setIntroActive] = useState(introExpected);

  useEffect(() => {
    setIntroActive(introExpected);
  }, [introExpected]);

  const beginHeroIntro = useCallback(() => {
    setIntroActive(true);
  }, []);

  const completeHeroIntro = useCallback(() => {
    setIntroActive(false);
  }, []);

  const value = useMemo(
    () => ({
      isHeroIntroPending: introExpected && introActive,
      beginHeroIntro,
      completeHeroIntro,
    }),
    [introExpected, introActive, beginHeroIntro, completeHeroIntro]
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
