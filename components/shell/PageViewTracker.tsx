'use client'

/**
 * components/shell/PageViewTracker.tsx
 * Fires a Meta Pixel PageView on every client-side route change.
 *
 * WHY THIS EXISTS:
 * The base Pixel snippet in app/layout.tsx fires PageView once, on the initial
 * full page load. But Next.js App Router navigations are client-side (SPA) — the
 * layout script does NOT re-run, so PageView would never fire again as the user
 * moves between pages. This component listens to pathname changes and fires the
 * missing PageViews, so every page is tracked (matching how a normal multi-page
 * site behaves).
 *
 * It SKIPS the very first render, because the layout snippet already sent the
 * initial PageView — firing here too would double-count the landing page.
 */
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageViewTracker() {
  const pathname = usePathname()
  const isFirst = useRef(true)

  useEffect(() => {
    // Skip the initial load — the base snippet in layout.tsx already fired it.
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
    window.fbq('track', 'PageView')
  }, [pathname])

  return null
}