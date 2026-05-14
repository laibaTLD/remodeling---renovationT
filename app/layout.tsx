import type { Metadata } from 'next'
import './globals.css'
import { WebBuilderProvider } from '@/app/providers/WebBuilderProvider'
import { ErrorBoundary } from '@/app/components/ui/ErrorBoundary'
import { ThemeFontWrapper } from './components/ui/ThemeFontWrapper'
import { LanguageProvider } from '@/app/i18n/LanguageProvider'
import { LenisProvider } from '@/app/components/cinematic/LenisProvider'

export const metadata: Metadata = {
  title: 'Web Builder Site',
  description: 'Generated site using Web Builder',
}

import Preloader from './components/ui/Preloader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <WebBuilderProvider>
            <LanguageProvider>
              <LenisProvider>
                <ThemeFontWrapper>
                  <main className="min-h-screen">
                    <Preloader />
                    {children}
                  </main>
                </ThemeFontWrapper>
              </LenisProvider>
            </LanguageProvider>
          </WebBuilderProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
