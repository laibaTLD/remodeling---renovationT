'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { TestimonialsSection } from '@/app/components/sections/TestimonialsSection';

export default function TestimonialsPage() {
  const { pages, loading } = useWebBuilder();
  const testimonialsPage = pages.find((p: Page) => p.slug === 'testimonials');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {!loading && testimonialsPage && (
          <>
            <HeroSection hero={testimonialsPage.hero} />
            <TestimonialsSection testimonialsSection={testimonialsPage.testimonialsSection} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
