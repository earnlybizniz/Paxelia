import type { Metadata, Viewport } from 'next'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import { Outfit, Playfair_Display, Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

// Display + body fonts for the retail tenant (Wylorise)
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Legacy fonts for academy tenant
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading-serif',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading-sans',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: C.brandName,
  description: "A real bamboo standing desk — everything you need, nothing you don't, at the price it should have been.",
  // Favicon — shared across both storefronts (retail + academy).
  // Served from /public/favicon.png.
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.png'],
    apple: ['/favicon.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow users to zoom (accessibility) but render at correct mobile width by default.
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${display.variable} ${outfit.variable} ${playfair.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
