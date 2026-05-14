'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';
import { CompanyDetailSection } from '@/app/components/sections/CompanyDetailSection';
import { CTA2Section } from '@/app/components/sections/CTA2Section';

export default function AboutPage() {
  const { pages, loading } = useWebBuilder();
  const aboutPage = pages.find((p: Page) => p.pageType === 'about');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {!loading && aboutPage && (
          <>
            <HeroSection hero={aboutPage.hero} />
            <AboutSection aboutSection={aboutPage.aboutSection} />
            <WhyChooseUsSection whyChooseUsSection={aboutPage.whyChooseUsSection} />
            <CompanyDetailSection companyDetailSection={aboutPage.companyDetailSection} />
            <CTA2Section cta2Section={aboutPage.cta2Section} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
