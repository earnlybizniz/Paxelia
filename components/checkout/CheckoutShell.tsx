/**
 * components/checkout/CheckoutShell.tsx
 * Minimal checkout header: brand wordmark + "Secure checkout" label.
 * No nav links per spec.
 */
'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useHome } from '@/contexts/home-context'

export function CheckoutShell({ children }: { children: React.ReactNode }) {
  const { brand } = useHome()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--paper)' }}>
      {/* Minimal header */}
      <header className="border-b border-[var(--ink)]/8 bg-[var(--paper)]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-[var(--ink)] tracking-[0.12em] text-base select-none"
          >
            {brand.logoWordmark}
          </Link>
          <span className="flex items-center gap-1.5 font-sans text-[0.75rem] text-[var(--ink-mute)] tracking-wide">
            <Lock size={12} strokeWidth={2} aria-hidden />
            Secure checkout
          </span>
        </div>
      </header>

      {/* Page body */}
      <main id="main" className="flex-1">
        {children}
      </main>

      {/* Policies footer */}
      <footer className="border-t border-[var(--ink)]/8 py-6 px-5">
        <div className="mx-auto max-w-[1100px] flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {[
            { label: 'Refund policy',   href: '/refund' },
            { label: 'Shipping policy', href: '/shipping' },
            { label: 'Privacy policy',  href: '/privacy' },
            { label: 'Terms of service', href: '/terms' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[0.72rem] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors underline underline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}