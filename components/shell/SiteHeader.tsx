'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useHome } from '@/contexts/home-context'
import { MagneticButton } from '@/components/shell/MagneticButton'
import { useCart } from '@/contexts/cart-context'
import { E } from '@/lib/motion'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'The Desk', href: '/product' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Our Story', href: '/about' },
  { label: 'Support', href: '/support' },
]

export function SiteHeader() {
  const { brand } = useHome()
  const { items, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const reduced = useReducedMotion()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <motion.header
        animate={{ height: scrolled ? 64 : 80 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E }}
        className={cn(
          'sticky top-0 z-40 flex items-center transition-all duration-300',
          scrolled
            ? 'bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--ink)]/8 shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[var(--paper)]',
        )}
        style={{ willChange: 'height' }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10 flex items-center justify-between gap-6">

          {/* Wordmark */}
          <Link href="/" className="font-display text-[var(--ink)] tracking-[0.12em] text-lg select-none">
            <motion.span
              animate={{ scale: scrolled ? 0.92 : 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E }}
              className="block"
            >
              {brand.logoWordmark}
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-sans text-[0.875rem] text-[var(--ink-soft)] tracking-wide
                  after:absolute after:left-0 after:bottom-[-2px] after:h-px after:w-0 after:bg-[var(--accent)]
                  after:transition-[width] after:duration-300 hover:after:w-full hover:text-[var(--ink)]
                  transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={openCart}
              aria-label={`Cart (${itemCount} items)`}
              className="relative p-2 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--paper)] text-[0.6rem] flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <MagneticButton href="/product" label="Shop the Desk" />
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-height overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: E }}
            className="fixed inset-0 z-50 bg-[var(--paper)] flex flex-col pt-24 px-8 pb-10 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 p-2 hover:opacity-60 transition-opacity"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            <nav className="flex flex-col gap-2 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: E }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 font-display text-[2rem] text-[var(--ink)] leading-tight border-b border-[var(--ink)]/8 hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <MagneticButton href="/product" label="Shop the Desk" className="w-full justify-center" onClick={() => setMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
