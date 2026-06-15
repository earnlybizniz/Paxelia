'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { MagneticButton } from '@/components/shell/MagneticButton'
import { scaleReveal, E } from '@/lib/motion'

export function FinalCta() {
  const { finalCta } = useHome()
  const reduced = useReducedMotion()

  return (
    <div className="bg-[var(--ink)] relative overflow-hidden">
      {/* Ambient drifting glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] max-w-[700px] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(ellipse, var(--accent), transparent 70%)',
          filter: 'blur(80px)',
          animation: 'ambientDrift 20s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[720px] px-5 md:px-10 text-center"
        style={{ padding: 'clamp(6rem, 14vw, 10rem) 2rem' }}>

        <motion.div
          variants={scaleReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-12% 0px' }}
          className="flex flex-col items-center gap-8"
        >
          {/* Eyebrow */}
          <p className="font-sans font-medium uppercase tracking-[0.22em] text-[0.75rem] text-[var(--accent)]">
            {finalCta.eyebrow}
          </p>

          {/* Headline — mask per line */}
          <h2
            className="font-display font-normal text-[var(--paper)] leading-[1.04] tracking-[-0.02em] max-w-[16ch]"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5rem)' }}
          >
            {finalCta.headline.split(/\*([^*]+)\*/).map((part, i) =>
              i % 2 === 1
                ? <em key={i} style={{ color: 'var(--highlight)', fontStyle: 'italic' }}>{part}</em>
                : <span key={i}>{part}</span>
            )}
          </h2>

          {/* Sub */}
          <p
            className="font-sans text-[var(--paper)]/60 max-w-[48ch]"
            style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)' }}
          >
            {finalCta.sub}
          </p>

          {/* CTA */}
          <MagneticButton href={finalCta.cta.href} label={finalCta.cta.label} variant="inverted" />

          {/* Price line */}
          <p className="font-sans text-[0.8rem] text-[var(--paper)]/40 tracking-wide">
            {finalCta.priceLine}
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes ambientDrift {
          0%, 100% { transform: translate(-50%,-50%) translate(0, 0); }
          33%       { transform: translate(-50%,-50%) translate(-40px, 30px); }
          66%       { transform: translate(-50%,-50%) translate(30px, -20px); }
        }
      `}</style>
    </div>
  )
}
