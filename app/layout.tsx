import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { siteData } from '../data/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteData.canonicalUrl),
  title: {
    default: 'Marcos Water Solutions | RO, STP, ETP & Water Softener Systems',
    template: '%s | Marcos Water Solutions',
  },
  description: siteData.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Marcos Water Solutions',
    description: siteData.description,
    url: siteData.canonicalUrl,
    siteName: 'Marcos Water Solutions',
    type: 'website',
    images: [
      {
        url: '/marcos/hero.png',
        width: 1774,
        height: 887,
        alt: 'Marcos Water Solutions water treatment systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marcos Water Solutions',
    description: siteData.description,
    images: ['/marcos/hero.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0891b2',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
