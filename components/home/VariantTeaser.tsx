'use client'

import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useHome } from '@/contexts/home-context'
import { MagneticButton } from '@/components/shell/MagneticButton'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { scaleReveal } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * DeskGraphic — a simple, representative standing-desk drawing. The bamboo top
 * stays constant; the frame (brackets, legs, feet) recolors to the selected
 * finish, which is the part that's actually White or Black on the real product.
 * Sits on a light card so both the white and black frame stay visible.
 */
function DeskGraphic({ frameColor }: { frameColor: string }) {
  const frame = {
    fill: frameColor,
    stroke: 'rgba(28,26,23,0.18)',
    strokeWidth: 1,
    style: { transition: 'fill 0.45s ease, stroke 0.45s ease' },
  }
  return (
    <svg viewBox="0 0 360 240" className="w-[80%] h-[80%]" role="img" aria-label="Standing desk, selected finish">
      <defs>
        <linearGradient id="vtBamboo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7ca90" />
          <stop offset="1" stopColor="#cda158" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="216" rx="132" ry="7" fill="rgba(28,26,23,0.10)" />
      {/* Frame — recolors with the finish */}
      <rect x="92" y="109" width="44" height="9" rx="2" {...frame} />
      <rect x="224" y="109" width="44" height="9" rx="2" {...frame} />
      <rect x="108" y="118" width="12" height="88" rx="2" {...frame} />
      <rect x="240" y="118" width="12" height="88" rx="2" {...frame} />
      <rect x="84" y="202" width="60" height="10" rx="5" {...frame} />
      <rect x="216" y="202" width="60" height="10" rx="5" {...frame} />
      {/* Bamboo top — constant */}
      <rect x="46" y="86" width="268" height="16" rx="4" fill="url(#vtBamboo)" />
      <rect x="46" y="101" width="268" height="7" rx="2" fill="#a8803f" />
      <rect x="276" y="103" width="24" height="4" rx="2" fill="rgba(28,26,23,0.4)" />
    </svg>
  )
}

export function VariantTeaser() {
  const { variantTeaser: vt } = useHome()
  const [activeSize, setActiveSize] = useState(1)
  const [activeFinish, setActiveFinish] = useState(0)
  const [hoveredFinish, setHoveredFinish] = useState<number | null>(null)
  const reduced = useReducedMotion()

  // Spotlight state — tracked relative to the FULL SECTION, not a child container
  const sectionRef = useRef<HTMLDivElement>(null)
  const [spotPos, setSpotPos] = useState<{ x: number; y: number } | null>(null)
  const [spotMoving, setSpotMoving] = useState(false)
  const spotTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setSpotPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setSpotMoving(true)
    if (spotTimeout.current) clearTimeout(spotTimeout.current)
    spotTimeout.current = setTimeout(() => setSpotMoving(false), 150)
  }

  const handleMouseLeave = () => {
    setSpotPos(null)
    setSpotMoving(false)
  }

  const displayFinish = hoveredFinish ?? activeFinish
  const spotSize = spotMoving ? 260 : 400

  return (
    <section
      id="configure"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--ink)] mt-16 md:mt-24"
      style={{ padding: 'clamp(4.5rem, 10vw, 8rem) 0' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive mouse-following spotlight — FULL WIDTH */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          style={{
            position: 'absolute',
            left: spotPos?.x ?? '60%',
            top: spotPos?.y ?? '35%',
            width: `${spotSize}px`,
            height: `${spotSize}px`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(107,74,47,0.65) 0%, transparent 70%)',
            opacity: 0.5,
            transition: 'width 300ms ease-out, height 300ms ease-out',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content — constrained width */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-10">
        {/* Static grid layout — no motion wrapper here to prevent re-animation on state change */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left text — only this part uses motion reveal */}
          <div className="flex flex-col gap-8">
            <motion.div
              variants={scaleReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Eyebrow className="text-[var(--accent)] mb-3">{vt.eyebrow}</Eyebrow>
              <SectionHeading as="h2" className="text-[var(--paper)]">{vt.heading}</SectionHeading>
            </motion.div>

            {/* Representative desk — recolors with the selected (or hovered) finish */}
            <div
              className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(160deg, #f7f5f1, #ece7de)' }}
            >
              <DeskGraphic frameColor={vt.finishes[displayFinish].swatch} />
            </div>

            <div>
              <p className="font-display text-[var(--paper)] text-3xl mb-1">
                {vt.sizes[activeSize].price}
              </p>
              <p className="font-sans text-[0.75rem] text-[var(--paper)]/50 uppercase tracking-[0.15em]">
                {vt.sizes[activeSize].label} · {vt.finishes[displayFinish].label} frame
              </p>
            </div>

            <MagneticButton href={vt.cta.href} label={vt.cta.label} variant="inverted" />
          </div>

          {/* Right controls — plain div, no motion, so state changes never retrigger animation */}
          <div className="flex flex-col gap-8">
            {/* Size chips */}
            <div>
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-[var(--paper)]/50 mb-4">Size</p>
              <div className="flex flex-wrap gap-3">
                {vt.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSize(i)}
                    className={cn(
                      'px-5 py-3 rounded-[3px] border font-sans text-[0.875rem] font-medium transition-all duration-200',
                      activeSize === i
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--paper)]'
                        : 'border-[var(--paper)]/20 text-[var(--paper)]/70 hover:border-[var(--accent)] hover:text-[var(--accent)]'
                    )}
                  >
                    <span className="block text-[1.1rem]">{size.label}</span>
                    <span className="block text-[0.7rem] opacity-60 mt-0.5">{size.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Finish swatches */}
            <div>
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-[var(--paper)]/50 mb-4">
                Finish — <span className="text-[var(--paper)]/80 normal-case tracking-normal">{vt.finishes[displayFinish].label}</span>
              </p>
              <div className="flex gap-3">
                {vt.finishes.map((finish, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFinish(i)}
                    onMouseEnter={() => setHoveredFinish(i)}
                    onMouseLeave={() => setHoveredFinish(null)}
                    aria-label={`${finish.label} finish`}
                    className={cn(
                      'w-11 h-11 rounded-full border border-[var(--paper)]/25 transition-all duration-200',
                      activeFinish === i
                        ? 'ring-2 ring-offset-2 ring-offset-[var(--ink)] ring-[var(--accent)] scale-110'
                        : 'hover:scale-110 opacity-70 hover:opacity-100'
                    )}
                    style={{ background: finish.swatch }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
