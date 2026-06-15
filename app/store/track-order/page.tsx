/**
 * app/store/track-order/page.tsx
 * User-facing path: /track-order  (middleware rewrites → /store/track-order)
 *
 * Self-contained client component. No backend calls, no env vars.
 * On submit: opens https://parcelsapp.com/en/tracking/{number} in a new tab.
 * Parcels App auto-detects the carrier from any tracking number format.
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { E, rise } from '@/lib/motion'

export default function TrackOrderPage() {
  const [tracking, setTracking] = useState('')

  const submit = () => {
    const t = tracking.trim()
    if (!t) return
    window.open(
      `https://parcelsapp.com/en/tracking/${encodeURIComponent(t)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  const isEmpty = !tracking.trim()

  return (
    <>
      <ThemeStyle />
      <Grain />
      <SiteHeader />

      <main
        id="main"
        className="flex flex-col items-center px-5 py-24 md:py-32"
        style={{ backgroundColor: 'var(--paper)' }}
      >
        <motion.div
          className="w-full max-w-[480px] flex flex-col items-center text-center gap-8"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: E }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
          >
            <Package
              size={56}
              strokeWidth={1.25}
              className="text-[var(--accent)]"
              aria-hidden
            />
          </motion.div>

          {/* Heading */}
          <motion.div
            className="flex flex-col gap-2"
            variants={rise}
            initial="hidden"
            animate="show"
          >
            <h1
              className="font-display font-normal text-[var(--ink)] leading-tight text-balance"
              style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)' }}
            >
              Track your order
            </h1>
            <p className="font-sans text-[0.95rem] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Enter your tracking number below and we&apos;ll take you straight to live carrier updates.
            </p>
          </motion.div>

          {/* Input + button */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-3 w-full">
              <label htmlFor="tracking-number" className="sr-only">
                Tracking number
              </label>
              <input
                id="tracking-number"
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="e.g. 1Z999AA10123456784"
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-4 px-4 rounded-[6px] border font-sans text-[0.9rem] bg-[var(--paper)] text-[var(--ink)] placeholder:text-[var(--ink-mute)] outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: 'color-mix(in srgb, var(--ink) 20%, transparent)',
                  // @ts-ignore css var
                  '--tw-ring-color': 'var(--accent)',
                }}
                aria-label="Tracking number"
              />
              <button
                type="button"
                onClick={submit}
                disabled={isEmpty}
                className="w-full py-4 rounded-[6px] font-sans text-[0.9rem] font-medium transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--paper)',
                }}
              >
                Track
              </button>
            </div>

            {/* Helper text */}
            <p className="font-sans text-[0.78rem]" style={{ color: 'var(--ink-mute)' }}>
              Your tracking number was emailed to you once your order shipped.
            </p>
          </div>

          {/* Fallback */}
          <p className="font-sans text-[0.82rem]" style={{ color: 'var(--ink-mute)' }}>
            No tracking number yet?{' '}
            {/* /support exists in app/store/support */}
            <Link
              href="/support"
              className="underline underline-offset-2 transition-colors hover:text-[var(--ink)]"
              style={{ color: 'var(--ink-soft)' }}
            >
              Contact support
            </Link>
          </p>
        </motion.div>
      </main>

      <SiteFooter />
    </>
  )
}
