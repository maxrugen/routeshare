import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
          {children}
        </div>
      </body>
    </html>
  )
}
