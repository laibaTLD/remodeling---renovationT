'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import 'lenis/dist/lenis.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    lenis.on('scroll', ScrollTrigger.update);
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
