import type { Metadata } from 'next'
import './globals.css'
import { WebBuilderProvider } from '@/app/providers/WebBuilderProvider'
import { ErrorBoundary } from '@/app/components/ui/ErrorBoundary'
import { ThemeFontWrapper } from './components/ui/ThemeFontWrapper'
import { LanguageProvider } from '@/app/i18n/LanguageProvider'
import { LenisProvider } from '@/app/components/cinematic/LenisProvider'
import { HeroIntroProvider } from '@/app/providers/HeroIntroProvider'

export const metadata: Metadata = {
  title: 'Web Builder Site',
  description: 'Generated site using Web Builder',
}

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
                <HeroIntroProvider>
                  <ThemeFontWrapper>
                    <main className="min-h-screen">
                      {children}
                    </main>
                  </ThemeFontWrapper>
                </HeroIntroProvider>
              </LenisProvider>
            </LanguageProvider>
          </WebBuilderProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
