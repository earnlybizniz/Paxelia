// components/academy/site-header.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/academy/ui/button"

const NAV = [
  { label: "The Book", href: "/field-guide" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
]

function Wordmark() {
  return (
    <Link href="/" className="group inline-flex items-baseline gap-[3px]" aria-label="Wylorise — home">
      <span className="font-display text-xl font-extrabold tracking-tight text-[var(--omni-ink)]">Wylorise</span>
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--omni-pop)] transition-transform duration-300 group-hover:scale-125" />
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 z-50 h-0.5 origin-left bg-[linear-gradient(90deg,var(--omni-brand),var(--omni-pop))]"
      />
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "border-b border-[var(--omni-line)] bg-white/80 shadow-[0_8px_30px_-12px_rgba(11,14,26,0.12)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8" aria-label="Primary">
          <Wordmark />

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active ? "text-[var(--omni-ink)]" : "text-[var(--omni-ink-soft)] hover:text-[var(--omni-ink)]",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--omni-brand)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden md:block">
            <Button asChild size="sm" variant="primary">
              <Link href="/pricing">
                Get access <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--omni-ink)] hover:bg-[var(--omni-surface)] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-white md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="flex flex-col gap-1 px-6 py-6"
            >
              {NAV.map((item) => (
                <motion.li key={item.href} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-medium text-[var(--omni-ink)] hover:bg-[var(--omni-surface)]"
                  >
                    {item.label}
                    <ArrowRight className="h-5 w-5 text-[var(--omni-ink-soft)]" />
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mt-4">
                <Button asChild size="lg" variant="primary" className="w-full">
                  <Link href="/pricing">
                    Get access <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
