'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer, viewportConfig } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  variant?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'stagger'
  delay?: number
  className?: string
  once?: boolean
}

const variantMap: Record<string, Variants> = {
  fadeUp: fadeInUp,
  fadeLeft: fadeInLeft,
  fadeRight: fadeInRight,
  scale: scaleIn,
  stagger: staggerContainer,
}

export function Reveal({ 
  children, 
  variant = 'fadeUp', 
  delay = 0, 
  className = '',
  once = true,
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px 0px' })
  
  const selectedVariant = variantMap[variant]
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={selectedVariant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for multiple children
interface StaggerRevealProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerReveal({ children, className = '', staggerDelay = 0.1 }: StaggerRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' })
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Child item for stagger animations
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
