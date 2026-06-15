'use client'

/**
 * components/shell/Reveal.tsx — PASSTHROUGH (instant paint).
 *
 * Renders its children immediately, with no entrance animation at all. It used
 * to add a CSS mount-fade (.reveal-in); that's been removed so every section —
 * above all the product hero — paints the instant it mounts, with zero opacity
 * ramp, zero scroll detection, zero JS animation, and zero layout shift. This is
 * deliberate: conversion + speed over motion.
 *
 * The public API is unchanged, so none of the ~25 call sites need editing —
 * extra props (variant / delay / staggerChildren) are accepted and ignored.
 */
import type { ReactNode, ElementType } from 'react'

interface RevealProps {
  children: ReactNode
  variant?: string
  delay?: number
  staggerChildren?: number
  className?: string
  as?: ElementType
}

export function Reveal({ children, className, as: Tag = 'div' }: RevealProps) {
  const Component = Tag as ElementType
  return <Component className={className}>{children}</Component>
}

/** Reveal.Item — kept for API compatibility; renders plainly. */
export function RevealItem({ children, className, as: Tag = 'div' }: Omit<RevealProps, 'delay' | 'staggerChildren'>) {
  const Component = Tag as ElementType
  return <Component className={className}>{children}</Component>
}
