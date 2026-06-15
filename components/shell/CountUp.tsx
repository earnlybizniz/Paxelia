'use client'

/**
 * components/shell/CountUp.tsx
 * Animated number that counts from 0 → value when it enters the viewport.
 * Respects prefers-reduced-motion.
 */
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface CountUpProps {
  value: number
  dec?: number          // decimal places
  suffix?: string
  prefix?: string
  duration?: number     // ms
  className?: string
}

export function CountUp({ value, dec = 0, suffix = '', prefix = '', duration = 1800, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  // Handle initial state for reduced motion
  useEffect(() => {
    if (reduced) setDisplay(value)
  }, [reduced, value])

  useEffect(() => {
    if (!inView || reduced) {
      setDisplay(value)
      return
    }
    let start = 0
    const step = 16
    const steps = Math.ceil(duration / step)
    let count = 0

    const timer = setInterval(() => {
      count++
      // Ease-out: progress slows at the end
      const progress = 1 - Math.pow(1 - count / steps, 3)
      const current = progress * value
      setDisplay(current)
      if (count >= steps) {
        clearInterval(timer)
        setDisplay(value)
      }
    }, step)

    return () => clearInterval(timer)
  }, [inView, value, duration, reduced])

  const formatted = (display ?? 0).toFixed(dec)

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}{formatted}{suffix}
    </span>
  )
}
