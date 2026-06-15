// components/academy/ui/reveal.tsx
"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.5, 0.26, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
