import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { ClientLayout } from '@/components/client-layout'
import { RutaBot } from '@/components/ruta-bot'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'RutaGo - Descubre Santiago',
  description: 'Descubre Santiago auténtico con emprendimientos locales',
  generator: 'v0.app',
  icons: {
    icon: '/RGOlogo.png',
    apple: '/RGOlogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster />
            {/* Chatbot global - disponible en todas las páginas */}
            <RutaBot />
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
