'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useHome } from '@/contexts/home-context'
import { ImageFrame } from '@/components/shell/ImageFrame'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { slideL, slideR } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * FeatureScenes — Scroll Animation Skill
 * 
 * Split-screen scrollytelling: text on left, image on right.
 * On wheel/keyboard, the left half slides DOWN and the right half slides UP
 * to reveal the next feature. Creates a dramatic "peel" effect.
 */
export function FeatureScenes() {
  const { features } = useHome()
  const [activeRow, setActiveRow] = useState(0)
  const [isInSection, setIsInSection] = useState(false)
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const scrolling = useRef(false)
  const animTime = 800

  const numFeatures = features.rows.length

  const navigateUp = () => {
    if (activeRow > 0) setActiveRow(p => p - 1)
  }

  const navigateDown = () => {
    if (activeRow < numFeatures - 1) setActiveRow(p => p + 1)
  }

  // Handle wheel events when section is in view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInSection(entry.isIntersecting && entry.intersectionRatio > 0.5)
      },
      { threshold: [0.5] }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInSection) return

    const handleWheel = (e: WheelEvent) => {
      const atTop = activeRow === 0 && e.deltaY < 0
      const atBottom = activeRow === numFeatures - 1 && e.deltaY > 0
      
      if (atTop || atBottom) return
      
      e.preventDefault()
      
      if (scrolling.current) return
      scrolling.current = true
      
      if (e.deltaY > 0) navigateDown()
      else navigateUp()
      
      setTimeout(() => { scrolling.current = false }, animTime)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInSection || scrolling.current) return
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const atTop = activeRow === 0 && e.key === 'ArrowUp'
        const atBottom = activeRow === numFeatures - 1 && e.key === 'ArrowDown'
        
        if (atTop || atBottom) return
        
        scrolling.current = true
        if (e.key === 'ArrowDown') navigateDown()
        else navigateUp()
        setTimeout(() => { scrolling.current = false }, animTime)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isInSection, activeRow, numFeatures])

  return (
    <>
      {/* ─── Desktop: Full section with header + scrollytelling ─── */}
      <section
        id="features"
        ref={sectionRef}
        className="hidden lg:block relative bg-[var(--paper)] overflow-hidden"
        style={{ height: '90vh' }}
      >
        {/* Content wrapper with max-width constraint */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-10 h-full">
          {/* Section header — left aligned */}
          <div className="pt-20 pb-8">
            <Eyebrow className="mb-3">{features.eyebrow}</Eyebrow>
            <SectionHeading className="max-w-[22ch]">{features.heading}</SectionHeading>
          </div>

          {/* Split-screen scrollytelling area — overflow-hidden clips the sliding panels */}
          <div className="relative overflow-hidden" style={{ height: '62vh' }}>
            {features.rows.map((row, i) => {
              const isBefore = i < activeRow
              const isAfter = i > activeRow

              let leftTransform = 'translateY(0)'
              let rightTransform = 'translateY(0)'

              if (isBefore) {
                leftTransform = 'translateY(-100%)'
                rightTransform = 'translateY(100%)'
              } else if (isAfter) {
                leftTransform = 'translateY(100%)'
                rightTransform = 'translateY(-100%)'
              }

              return (
                <div key={i} className="absolute inset-0 grid grid-cols-2 gap-8">
                  {/* Left Half — Text content, slides DOWN */}
                  <div
                    className="h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: leftTransform }}
                  >
                    <div className="h-full flex flex-col justify-center pr-8">
                      {/* Feature number */}
                      <span
                        className="font-display text-[4rem] leading-none font-normal opacity-15 mb-4"
                        style={{ color: 'var(--accent)' }}
                      >
                        {row.num}
                      </span>
                      
                      <Eyebrow className="mb-2">{row.kicker}</Eyebrow>
                      
                      <h3
                        className="font-display font-normal text-[var(--ink)] leading-[1.1] tracking-[-0.02em] mb-4"
                        style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                      >
                        {row.title}
                      </h3>
                      
                      <p className="font-sans text-[var(--ink-soft)] leading-relaxed text-[0.9rem] max-w-md mb-6">
                        {row.body}
                      </p>
                      
                      {/* Specs */}
                      <div className="flex gap-6">
                        {row.specs.map((spec, si) => (
                          <div key={si} className="flex flex-col gap-0.5">
                            <span
                              className="font-display text-[var(--ink)] font-normal leading-none text-xl"
                              style={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                              {spec.value}
                            </span>
                            <span className="font-sans text-[0.65rem] text-[var(--ink-mute)] uppercase tracking-[0.15em]">
                              {spec.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Half — Image, slides UP */}
                  <div
                    className="h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: rightTransform }}
                  >
                    <div className="h-full flex items-center justify-center pl-8">
                      <div className="w-full max-w-sm">
                        <ImageFrame
                          slot={row.image}
                          caption={row.kicker}
                          sizes="(max-width:1024px) 100vw, 40vw"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Progress indicator — positioned inside content area with padding for scale effect */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
              {features.rows.map((row, i) => (
                <button
                  key={i}
                  onClick={() => setActiveRow(i)}
                  aria-label={`Go to feature ${row.num}`}
                  className={cn(
                    'w-7 h-7 rounded-full border flex items-center justify-center font-sans text-[0.6rem] font-medium transition-all duration-300',
                    activeRow === i
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--paper)]'
                      : 'border-[var(--ink)]/20 text-[var(--ink-mute)] hover:border-[var(--ink)]/40'
                  )}
                >
                  {row.num}
                </button>
              ))}
            </div>
          </div>

          {/* Scroll hint — bottom of content area */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
            <span className="font-sans text-[0.6rem] text-[var(--ink-mute)] uppercase tracking-[0.2em]">Scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-4 h-5 border border-[var(--ink-mute)] rounded-full flex justify-center pt-1"
            >
              <div className="w-0.5 h-1 bg-[var(--ink-mute)] rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Mobile/tablet: stacked alternating ─── */}
      <section id="features-mobile" className="lg:hidden bg-[var(--paper)] py-16">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
          {/* Header */}
          <div className="mb-12">
            <Eyebrow className="mb-3">{features.eyebrow}</Eyebrow>
            <SectionHeading className="max-w-[22ch]">{features.heading}</SectionHeading>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-16">
            {features.rows.map((row, i) => (
              <motion.div
                key={i}
                variants={i % 2 === 0 ? slideL : slideR}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-12% 0px' }}
                className="grid sm:grid-cols-2 gap-8 items-center"
              >
                <div className={cn('flex flex-col gap-4', i % 2 === 1 && 'sm:order-2')}>
                  <Eyebrow>{row.kicker}</Eyebrow>
                  <h3
                    className="font-display font-normal text-[var(--ink)] leading-[1.1] tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                  >
                    {row.title}
                  </h3>
                  <p className="font-sans text-[var(--ink-soft)] leading-relaxed text-[0.9rem]">{row.body}</p>
                  <div className="flex gap-5 mt-1">
                    {row.specs.map((spec, si) => (
                      <div key={si} className="flex flex-col gap-0.5">
                        <span className="font-display text-[var(--ink)] text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>{spec.value}</span>
                        <span className="font-sans text-[0.65rem] text-[var(--ink-mute)] uppercase tracking-[0.15em]">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cn(i % 2 === 1 && 'sm:order-1')}>
                  <ImageFrame slot={row.image} caption={row.kicker} sizes="(max-width:640px) 100vw, 40vw" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
