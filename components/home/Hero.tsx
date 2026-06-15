'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useHome } from '@/contexts/home-context'
import { MagneticButton } from '@/components/shell/MagneticButton'
import { ImageFrame } from '@/components/shell/ImageFrame'
import { CountUp } from '@/components/shell/CountUp'
import { Eyebrow } from '@/components/shell/Typography'
import { blurIn, eyebrowReveal, heroImageReveal, stagger, rise, E, VP } from '@/lib/motion'

export function Hero() {
  const { hero } = useHome()
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -60])
  const grainY  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -30])

  const containerV = stagger(0.08)
  const DELAY_START = 0.2

  return (
    <div ref={ref} className="relative min-h-[calc(100vh-116px)] flex flex-col justify-center overflow-hidden bg-[var(--paper)]">

      {/* Ambient drifting glow behind image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[10%] w-[55vw] h-[55vw] max-w-[700px] rounded-full opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, var(--accent), transparent 70%)',
          filter: 'blur(80px)',
          animation: 'ambientDrift 18s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 md:gap-8 items-center">

          {/* ─── Left: text ─── */}
          <div className="order-2 md:order-1 flex flex-col gap-6">

            {/* Eyebrow */}
            <motion.div
              variants={eyebrowReveal}
              initial="hidden"
              whileInView="show"
              viewport={VP}
              transition={{ delay: DELAY_START }}
            >
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </motion.div>

            {/* Headline — mask reveal line by line */}
            <h1
              className="font-display font-normal text-[var(--ink)] leading-[1.04] tracking-[-0.02em] max-w-[20ch]"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', fontFeatureSettings: "'ss01','liga'" }}
            >
              {hero.headline.split(' ').reduce<string[][]>((acc, word) => {
                // Group words into ~2 lines for natural mask
                const last = acc[acc.length - 1]
                if (!last || last.join(' ').length > 18) acc.push([word])
                else last.push(word)
                return acc
              }, []).map((lineWords, lineIdx) => {
                const line = lineWords.join(' ')
                const parts = line.split(/\*([^*]+)\*/)
                return (
                  <span key={lineIdx} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={reduced ? { opacity: 0 } : { y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{ duration: 0.9, ease: E, delay: DELAY_START + 0.1 + lineIdx * 0.08 }}
                    >
                      {parts.map((p, pi) =>
                        pi % 2 === 1
                          ? <em key={pi} className="not-italic" style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{p}</em>
                          : <span key={pi}>{p}</span>
                      )}
                    </motion.span>
                  </span>
                )
              })}
            </h1>

            {/* Sub */}
            <motion.p
              className="font-sans text-[var(--ink-soft)] max-w-[52ch] leading-relaxed"
              style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: DELAY_START + 0.45, duration: 0.8, ease: E }}
            >
              {hero.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: DELAY_START + 0.55, duration: 0.8, ease: E }}
            >
              <MagneticButton href={hero.primaryCta.href} label={hero.primaryCta.label} />
              <MagneticButton href={hero.secondaryCta.href} label={hero.secondaryCta.label} variant="ghost" />
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: DELAY_START + 0.7, duration: 0.6 }}
            >
              {hero.stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span
                    className="font-display text-[var(--ink)] leading-none tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontVariantNumeric: 'tabular-nums' }}
                  >
                    <CountUp value={stat.value} dec={stat.dec} suffix={stat.suffix} />
                  </span>
                  <span className="font-sans text-[0.75rem] text-[var(--ink-mute)] uppercase tracking-[0.12em]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── Right: image ─── */}
          <div className="order-1 md:order-2 relative">
            <motion.div
              variants={heroImageReveal}
              initial="hidden"
              whileInView="show"
              viewport={VP}
              style={{ y: imageY }}
            >
              <ImageFrame
                slot={hero.image}
                priority
                sizes="(max-width:860px) 100vw, 48vw"
                caption={hero.badge}
              />
            </motion.div>

            {/* Floating price card */}
            {hero.priceFloat && (
              <motion.div
                className="absolute bottom-6 left-[-1rem] md:left-[-2.5rem] bg-[var(--paper)] border border-[var(--ink)]/10 rounded-[3px] px-5 py-3 shadow-[0_4px_24px_var(--ink)/8]"
                variants={blurIn}
                initial="hidden"
                whileInView="show"
                viewport={VP}
                style={{
                  animation: 'floaty 4s ease-in-out infinite',
                }}
              >
                <p className="font-display text-[var(--ink)] text-xl leading-none">{hero.priceFloat.price}</p>
              </motion.div>
            )}

            {/* Badge */}
            {hero.badge && (
              <motion.div
                className="absolute top-4 right-4 bg-[var(--ink)] text-[var(--paper)] text-[0.7rem] font-sans font-medium tracking-[0.1em] uppercase px-3 py-1.5 rounded-[2px]"
                variants={blurIn}
                initial="hidden"
                whileInView="show"
                viewport={VP}
              >
                {hero.badge}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Ambient drift keyframe */}
      <style>{`
        @keyframes ambientDrift {
          0%, 100% { transform: translate(0, 0); }
          33%       { transform: translate(-30px, 20px); }
          66%       { transform: translate(20px, -15px); }
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
