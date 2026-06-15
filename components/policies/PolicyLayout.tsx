/**
 * components/policies/PolicyLayout.tsx
 * Shared layout for all four policy pages.
 * Renders ThemeStyle + Grain, minimal back link, centered readable column,
 * page title, "Last updated" line, children, then PolicyNav at the bottom.
 */
'use client'

import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { PolicyNav } from './PolicyNav'

interface Props {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function PolicyLayout({ title, lastUpdated, children }: Props) {
  // Format ISO date to human-readable: "January 1, 2026"
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
    timeZone: 'UTC',
  })

  return (
    <>
      <ThemeStyle />
      <Grain />
      <SiteHeader />

      <main id="main" className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="mx-auto max-w-[760px] px-5 py-14 md:py-20">
          {/* Page header */}
          <div className="mb-12 pb-8 border-b" style={{ borderColor: 'color-mix(in srgb, var(--ink) 10%, transparent)' }}>
            <h1
              className="font-display font-normal text-[var(--ink)] leading-tight mb-3 text-balance"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              {title}
            </h1>
            <p className="font-sans text-[0.82rem]" style={{ color: 'var(--ink-mute)' }}>
              Last updated: {formattedDate}
            </p>
          </div>

          {/* Policy body */}
          <div className="policy-body">
            {children}
          </div>

          {/* Cross-links to other policies */}
          <PolicyNav />
        </div>
      </main>

      <SiteFooter />

      {/* Shared prose styles injected once */}
      <style>{`
        .policy-body { color: var(--ink); }
        .policy-body h2 {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--ink);
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .policy-body h3 {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--ink);
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .policy-body p {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--ink-soft, var(--ink));
          margin-bottom: 0.9rem;
        }
        .policy-body ul, .policy-body ol {
          padding-left: 1.4rem;
          margin-bottom: 0.9rem;
        }
        .policy-body li {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--ink-soft, var(--ink));
          margin-bottom: 0.3rem;
        }
        .policy-body a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .policy-body a:hover { opacity: 0.8; }
        .policy-body strong { color: var(--ink); font-weight: 600; }
        .policy-body hr {
          border: none;
          border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
          margin: 2rem 0;
        }
      `}</style>
    </>
  )
}