'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { Page } from '@/app/lib/types';

export default function ProjectDetailPage() {
    const { pages, loading } = useWebBuilder();
    const projectPage = pages.find((p: Page) => p.pageType === 'project-detail');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {!loading && projectPage && <HeroSection hero={projectPage.hero} />}
            </main>
            <Footer />
        </div>
    );
}
