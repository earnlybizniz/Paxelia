import type { Metadata, Viewport } from 'next'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import { Poppins, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

// Retail tenant (Snapsticker): Poppins = display/headings, Inter = body.
// Each exposes a CSS variable that globals.css @theme maps the font utilities to.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Serif kept for the academy tenant's headings (--font-heading-serif).
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: C.brandName,
  description: "An electric dual-level sit-stand desk — sit, stand, present, and everything you need, built in.",
  // Favicon — shared across both storefronts (retail + academy). Served from /public/favicon.png.
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
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
