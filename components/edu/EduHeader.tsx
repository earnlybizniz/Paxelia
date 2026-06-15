'use client'

import { useEffect, useState } from 'react'
import { eduBrand, eduNav } from '@/lib/edu/site'
import { Menu, X } from 'lucide-react'

/**
 * EDU tenant site header. Sticky, white, with wordmark + nav + a single primary
 * action ("Get access" → /pricing). Fresh component — no retail dependency.
 */
export function EduHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/90 backdrop-blur transition-colors ${
        scrolled ? 'border-border' : 'border-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-6 lg:h-20">
        <a href="/" className="flex items-center gap-2" aria-label={`${eduBrand.name} home`}>
          <span className="text-xl font-display font-semibold tracking-tight text-foreground lg:text-2xl">
            {eduBrand.wordmark}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {eduNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/pricing"
            className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Get access
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
            {eduNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/pricing"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-base font-semibold text-background"
            >
              Get access
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
