/**
 * lib/motion.ts — spec-aligned motion system
 * Brand easing E = [0.16,1,0.3,1] (refined out-expo)
 * All variants use "hidden" / "show" keys for <Reveal>
 * Backward-compat aliases keep existing components working.
 */

import type { Variants, Transition } from 'framer-motion'

// ─── Brand easing ────────────────────────────────────────────────────────────
export const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const VP = { once: true, margin: '-12% 0px' }

// ─── Reveal variants ────────────────────────────────────────────────────────
// NEUTRALIZED: these previously animated each block in on scroll (opacity/slide/
// scale/blur via whileInView). That repetitive pop-in felt slow and laggy on
// mobile, so `hidden` and `show` are now IDENTICAL — content renders instantly
// and visibly with zero scroll detection and zero layout shift. The keys are
// kept so every existing call site (variants={...} initial="hidden"
// whileInView="show") keeps working without edits. To restore an animation,
// give `hidden` a different value again.
const INSTANT: Variants = { hidden: {}, show: {} }

export const rise: Variants = INSTANT
export const riseLg: Variants = INSTANT
export const fade: Variants = INSTANT
export const maskUp: Variants = INSTANT
export const slideL: Variants = INSTANT
export const slideR: Variants = INSTANT
export const scaleReveal: Variants = INSTANT
export const blurIn: Variants = INSTANT
export const eyebrowReveal: Variants = INSTANT
export const heroImageReveal: Variants = INSTANT
export const checkPop: Variants = INSTANT
export const dividerReveal: Variants = INSTANT

// Stagger container factory
export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show:   { transition: { staggerChildren: delay } },
})

// ─── Backward-compat aliases (older components use visible/hidden or named exports) ──
// Also NEUTRALIZED (see note above) — hidden === visible so these render instantly.
export const defaultTransition: Transition = { duration: 0.5, ease: E }
export const springTransition:  Transition = { type: 'spring', stiffness: 300, damping: 30 }
export const fadeIn         = { hidden: {}, visible: {} }
export const fadeInUp       = { hidden: {}, visible: {} }
export const fadeInLeft     = { hidden: {}, visible: {} }
export const fadeInRight    = { hidden: {}, visible: {} }
export const scaleIn        = { hidden: {}, visible: {} }
export const staggerContainer: Variants = { hidden: {}, visible: {} }
export const staggerChild: Variants     = { hidden: {}, visible: {} }
export const containerVariants = staggerContainer
export const itemVariants      = staggerChild
export const fadeInVariants    = fadeIn
export const viewportConfig    = { once: true, margin: '-100px 0px' }
export const viewportConfigEager = { once: true, margin: '-50px 0px' }



// ============================================================