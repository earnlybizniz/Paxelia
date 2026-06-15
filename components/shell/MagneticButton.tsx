'use client'

/**
 * components/shell/MagneticButton.tsx
 * Primary CTA with magnetic cursor effect, fill-wipe on hover, arrow nudge.
 * Falls back to a plain button on touch / reduced-motion.
 * Supports both link (href) and button (onClick) modes.
 */
import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  href?: string
  label?: string
  children?: React.ReactNode
  variant?: 'primary' | 'ghost' | 'inverted'
  className?: string
  onClick?: () => void
  showArrow?: boolean
}

export function MagneticButton({ 
  href, 
  label, 
  children,
  variant = 'primary', 
  className, 
  onClick,
  showArrow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()

  function handleMouseMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.18
    const dy = (e.clientY - cy) * 0.18
    setPos({ x: Math.min(6, Math.max(-6, dx)), y: Math.min(4, Math.max(-4, dy)) })
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 })
    setHovered(false)
  }

  const base =
    'relative inline-flex items-center justify-center gap-2 overflow-hidden font-sans font-medium text-[0.9rem] tracking-wide px-7 py-3.5 rounded-[3px] select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2'

  const variants = {
    primary:  'bg-[var(--accent)] text-[var(--paper)] hover:bg-[var(--accent-deep)]',
    ghost:    'border border-[var(--ink)]/20 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
    inverted: 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper2)]',
  }

  const content = children || label

  // Button mode (no href)
  if (!href) {
    return (
      <motion.button
        ref={ref as React.RefObject<HTMLButtonElement>}
        type="button"
        animate={reduced ? {} : { x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={cn(base, variants[variant], className)}
      >
        <span className="relative z-10">{content}</span>
        {showArrow && (
          <motion.span
            className="relative z-10"
            animate={hovered && !reduced ? { x: 5 } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ArrowRight size={15} strokeWidth={1.5} />
          </motion.span>
        )}
      </motion.button>
    )
  }

  // Link mode (with href)
  return (
    <motion.a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      animate={reduced ? {} : { x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(base, variants[variant], className)}
    >
      <span className="relative z-10">{content}</span>
      {showArrow && (
        <motion.span
          className="relative z-10"
          animate={hovered && !reduced ? { x: 5 } : { x: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ArrowRight size={15} strokeWidth={1.5} />
        </motion.span>
      )}
    </motion.a>
  )
}
