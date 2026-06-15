// app/edu/layout.tsx
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google"
import { SiteHeader } from "@/components/academy/site-header"
import { SiteFooter } from "@/components/academy/site-footer"
import "./omni.css"

// Academy-scoped fonts. Applied only on .omni-root below, so the store tenant's
// fonts are never touched.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-omni-display",
  display: "swap",
})
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-omni-body",
  display: "swap",
})
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-omni-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://wylorise.store"),
  title: {
    default: "Wylorise — Mastering Google Ads",
    template: "%s — Wylorise",
  },
  description:
    "Mastering Google Ads by Wylorise: a beginner-friendly ebook plus a private community that keeps you current as Google changes. One membership, everyone gets everything. Educational and independent — not affiliated with Google.",
  applicationName: "Wylorise",
  keywords: [
    "Google Ads",
    "Google Ads for beginners",
    "Search ads",
    "Google Shopping",
    "Merchant Center",
    "conversion tracking",
    "PPC",
    "Google Ads course",
    "Google Ads community",
    "Wylorise",
  ],
  openGraph: {
    type: "website",
    siteName: "Wylorise",
    url: "https://wylorise.store",
    title: "Wylorise — Mastering Google Ads",
    description:
      "One membership: a beginner-friendly Google Ads ebook plus a private community that keeps you current as Google changes.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Wylorise — Mastering Google Ads" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wylorise — Mastering Google Ads",
    description:
      "One membership: a beginner-friendly Google Ads ebook plus a private community that keeps you current as Google changes.",
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wylorise",
  url: "https://wylorise.store",
  description:
    "Mastering Google Ads — a beginner-friendly ebook and a private community for running Google Ads as a repeatable system. Educational and independent; not affiliated with Google.",
  logo: "https://wylorise.store/og.png",
  email: "support@wylorise.store",
}

export default function EduLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`omni-root ${display.variable} ${body.variable} ${mono.variable} flex min-h-screen flex-col bg-white text-neutral-800 antialiased`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
