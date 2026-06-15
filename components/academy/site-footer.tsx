// components/academy/site-footer.tsx
import Link from "next/link"
import { Container } from "@/components/academy/container"

const EXPLORE = [
  { label: "The Book", href: "/field-guide" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
]

const POLICIES = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
  { label: "License (EULA)", href: "/eula" },
]

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-24 overflow-hidden bg-neutral-950 text-neutral-300">
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(0,87,231,0.7),rgba(255,167,0,0.7),transparent)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.28),transparent)] blur-2xl"
      />

      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-baseline gap-[3px]">
              <span className="font-display text-lg font-extrabold tracking-tight text-white">Wylorise</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--omni-pop)]" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Mastering Google Ads by Wylorise — a beginner-friendly ebook plus a private community that keeps you
              current as Google changes. Built to take you from clicks to customers.
            </p>
            <a
              href="mailto:support@wylorise.store"
              className="mt-5 inline-block text-sm font-medium text-[#8fb4ff] hover:text-white"
            >
              support@wylorise.store
            </a>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-500">Explore</h3>
            <ul className="mt-4 space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-500">Policies</h3>
            <ul className="mt-4 space-y-3">
              {POLICIES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/manage"
                  className="text-sm font-medium text-neutral-200 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Manage or cancel membership
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-neutral-500 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p>© {year} Wylorise. All rights reserved.</p>
            <p>5742 Satterfield Drive, Macon, GA 31206 · Governed by the laws of the State of Georgia, USA.</p>
          </div>
          <p className="max-w-2xl md:text-right">
            Educational only — no income or results guarantees. Independent and not affiliated with, endorsed by, or
            sponsored by Google.
          </p>
        </div>
      </Container>
    </footer>
  )
}
