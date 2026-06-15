'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHome } from '@/contexts/home-context'
import { maskUp } from '@/lib/motion'

export function AnnouncementBar() {
  const { announcement } = useHome()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (announcement.length <= 1) return
    const t = setInterval(() => setIdx(i => (i + 1) % announcement.length), 3500)
    return () => clearInterval(t)
  }, [announcement.length])

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="bg-[var(--ink)] text-[var(--paper)] text-[0.75rem] font-sans tracking-[0.1em] uppercase"
      style={{ minHeight: '36px' }}
    >
      {/* Desktop: all items inline */}
      <div className="hidden md:flex items-center justify-center gap-6 h-9 px-6">
        {announcement.map((msg, i) => (
          <span key={i} className="flex items-center gap-2 opacity-80">
            {i > 0 && <span className="w-1 h-1 rounded-full bg-[var(--accent)]" aria-hidden="true" />}
            {msg}
          </span>
        ))}
      </div>

      {/* Mobile: rotating single item */}
      <div className="flex md:hidden items-center justify-center h-9 overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            variants={maskUp}
            initial="hidden"
            animate="show"
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.4 } }}
            className="text-center opacity-80 block"
            aria-live="off"
          >
            {announcement[idx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
