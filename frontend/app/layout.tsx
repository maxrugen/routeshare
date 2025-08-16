import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Routeshare - Instagram Story Overlays for Activities',
  description: 'Create beautiful Instagram Story overlays from your Strava activities or GPX files',
  keywords: ['strava', 'gpx', 'instagram', 'overlay', 'running', 'cycling', 'fitness'],
  authors: [{ name: 'Routeshare Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-gray-200/60 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-gray-600 flex items-center justify-between">
              <span>© {new Date().getFullYear()} Routeshare</span>
              <nav className="space-x-4">
                <Link href="/imprint" className="hover:underline">Imprint</Link>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
