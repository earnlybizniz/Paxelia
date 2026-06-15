'use client'

/**
 * components/shell/MaskText.tsx
 * Wraps each line in overflow-hidden so text animates up from beneath.
 * Also parses *asterisks* → accent italic spans in headlines.
 */
import { motion, useReducedMotion } from 'framer-motion'
import { E } from '@/lib/motion'

interface MaskTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  /** If true, parse *emphasis* → accent italic */
  parseEmphasis?: boolean
}

function parseEmphasis(text: string) {
  const parts = text.split(/\*([^*]+)\*/)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <em key={i} style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{part}</em>
      : <span key={i}>{part}</span>
  )
}

export function MaskText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  parseEmphasis: doParse = false,
}: MaskTextProps) {
  const reduced = useReducedMotion()

  // Split on newlines or auto-split by word chunks for natural breaks
  const lines = text.includes('\n') ? text.split('\n') : [text]

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: '110%', opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            transition={{ duration: 0.9, ease: E, delay: delay + i * 0.08 }}
          >
            {doParse ? parseEmphasis(line) : line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
