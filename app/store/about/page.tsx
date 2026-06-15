'use client'

/**
 * app/store/about/page.tsx
 * Editorial About / Our Story page.
 * All copy and image slots come from lib/about-config.ts — edit that file only.
 * Sections: Hero → Mission/Values → Craft & Materials → Sustainability → Closing CTA
 */

import Link from 'next/link'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { ABOUT_CONFIG as A } from '@/lib/about-config'

// ── Placeholder gradient shown when an image slot is empty ───────────────────
function ImagePlaceholder({
  className,
  aspect = 'aspect-[16/9]',
}: {
  className?: string
  aspect?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${aspect} rounded-[8px] ${className ?? ''}`}
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, var(--paper)) 0%, color-mix(in srgb, var(--ink) 6%, var(--paper)) 100%)',
      }}
    />
  )
}

// ── Eyebrow label used across sections ───────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-[var(--accent)] mb-3">
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <ThemeStyle />
      <Grain />
      <SiteHeader />

      <main id="main" className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>

        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-5 md:px-10">
          <div className="mx-auto max-w-[860px] text-center">
            <Reveal variant="fade">
              <Eyebrow>{A.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="riseLg" delay={0.05}>
              <h1
                className="font-display font-normal text-[var(--ink)] text-balance leading-[1.1] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
              >
                {A.heroHeadline}
              </h1>
            </Reveal>
            <Reveal variant="rise" delay={0.15}>
              <p
                className="font-sans text-[var(--ink-soft)] leading-relaxed max-w-[580px] mx-auto"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)' }}
              >
                {A.heroSub}
              </p>
            </Reveal>
          </div>

          {/* Hero image */}
          <Reveal variant="scaleReveal" delay={0.2} className="mx-auto mt-12 max-w-[1100px]">
            {A.heroImage ? (
              <img
                src={A.heroImage}
                alt="Omnirise marble desk in a modern workspace"
                className="w-full aspect-[16/9] object-cover rounded-[10px]"
              />
            ) : (
              <ImagePlaceholder aspect="aspect-[16/9]" />
            )}
          </Reveal>
        </section>

        {/* ── 2. Mission / Values ──────────────────────────────────────────── */}
        <section
          className="py-20 md:py-28 px-5 md:px-10"
          style={{ backgroundColor: 'var(--paper2, #f5f5f4)' }}
        >
          <div className="mx-auto max-w-[1100px]">
            {/* Heading block */}
            <div className="max-w-[620px] mb-14 md:mb-20">
              <Reveal variant="fade">
                <Eyebrow>{A.missionEyebrow}</Eyebrow>
              </Reveal>
              <Reveal variant="rise" delay={0.05}>
                <h2
                  className="font-display font-normal text-[var(--ink)] leading-tight text-balance mb-5"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
                >
                  {A.missionHeadline}
                </h2>
              </Reveal>
              <Reveal variant="rise" delay={0.1}>
                <p className="font-sans text-[1rem] text-[var(--ink-soft)] leading-relaxed">
                  {A.missionBody}
                </p>
              </Reveal>
            </div>

            {/* Values grid */}
            <Reveal staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {A.values.map((v) => (
                <RevealItem key={v.title} variant="rise">
                  <div
                    className="p-7 rounded-[8px] flex flex-col gap-3 h-full"
                    style={{ backgroundColor: 'var(--paper)' }}
                  >
                    <div
                      className="w-8 h-px"
                      style={{ backgroundColor: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                    <h3 className="font-sans font-semibold text-[0.95rem] text-[var(--ink)]">
                      {v.title}
                    </h3>
                    <p className="font-sans text-[0.875rem] text-[var(--ink-soft)] leading-relaxed">
                      {v.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── 3. Craft & Materials ─────────────────────────────────────────── */}
        <section className="py-20 md:py-28 px-5 md:px-10">
          <div className="mx-auto max-w-[1100px]">

            {/* Text + image side-by-side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-16 md:mb-20">
              <Reveal variant="slideL">
                <Eyebrow>{A.craftEyebrow}</Eyebrow>
                <h2
                  className="font-display font-normal text-[var(--ink)] leading-tight text-balance mb-5"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}
                >
                  {A.craftHeadline}
                </h2>
                <p className="font-sans text-[1rem] text-[var(--ink-soft)] leading-relaxed">
                  {A.craftBody}
                </p>
              </Reveal>

              <Reveal variant="slideR">
                {A.craftImage ? (
                  <img
                    src={A.craftImage}
                    alt="Close-up of the genuine marble desktop"
                    className="w-full aspect-[4/3] object-cover rounded-[8px]"
                  />
                ) : (
                  <ImagePlaceholder aspect="aspect-[4/3]" />
                )}
              </Reveal>
            </div>

            {/* Craft points */}
            <Reveal staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {A.craftPoints.map((pt) => (
                <RevealItem key={pt.label} variant="rise">
                  <div className="flex flex-col gap-2 py-6 border-t" style={{ borderColor: 'color-mix(in srgb, var(--ink) 12%, transparent)' }}>
                    <p className="font-sans font-semibold text-[0.9rem] text-[var(--ink)]">{pt.label}</p>
                    <p className="font-sans text-[0.85rem] text-[var(--ink-soft)] leading-relaxed">{pt.body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </div>

          {/* Process image — full-width band */}
          {(A.processImage || true) && (
            <Reveal variant="scaleReveal" delay={0.1} className="mx-auto mt-16 max-w-[1100px]">
              {A.processImage ? (
                <img
                  src={A.processImage}
                  alt="Omnirise desk detail and craftsmanship"
                  className="w-full aspect-[21/9] object-cover rounded-[10px]"
                />
              ) : (
                <ImagePlaceholder aspect="aspect-[21/9]" />
              )}
            </Reveal>
          )}
        </section>

        {/* ── 4. Sustainability ─────────────────────────────────────────────── */}
        <section
          className="py-20 md:py-28 px-5 md:px-10"
          style={{ backgroundColor: 'var(--paper2, #f5f5f4)' }}
        >
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-[640px] mb-14">
              <Reveal variant="fade">
                <Eyebrow>{A.sustainabilityEyebrow}</Eyebrow>
              </Reveal>
              <Reveal variant="rise" delay={0.05}>
                <h2
                  className="font-display font-normal text-[var(--ink)] leading-tight text-balance mb-5"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}
                >
                  {A.sustainabilityHeadline}
                </h2>
              </Reveal>
              <Reveal variant="rise" delay={0.1}>
                <p className="font-sans text-[1rem] text-[var(--ink-soft)] leading-relaxed">
                  {A.sustainabilityBody}
                </p>
              </Reveal>
            </div>

            {/* Stat blocks */}
            <Reveal staggerChildren={0.12} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {A.sustainabilityPoints.map((pt) => (
                <RevealItem key={pt.stat} variant="rise">
                  <div
                    className="p-8 rounded-[8px] flex flex-col gap-2"
                    style={{ backgroundColor: 'var(--paper)' }}
                  >
                    <span
                      className="font-display font-normal leading-none"
                      style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--accent)' }}
                    >
                      {pt.stat}
                    </span>
                    <span className="font-sans text-[0.85rem] text-[var(--ink-soft)] leading-snug">
                      {pt.label}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── 5. Closing CTA ───────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 px-5 md:px-10 text-center">
          <div className="mx-auto max-w-[600px]">
            <Reveal variant="rise">
              <h2
                className="font-display font-normal text-[var(--ink)] text-balance leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
              >
                {A.closeHeadline}
              </h2>
            </Reveal>
            <Reveal variant="rise" delay={0.08}>
              <p className="font-sans text-[1rem] text-[var(--ink-soft)] leading-relaxed mb-8">
                {A.closeBody}
              </p>
            </Reveal>
            <Reveal variant="rise" delay={0.15}>
              <Link
                href={A.closeCtaHref}
                className="inline-flex items-center justify-center py-4 px-10 rounded-[6px] font-sans text-[0.9rem] font-semibold transition-opacity hover:opacity-85 active:opacity-75"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
              >
                {A.closeCtaLabel}
              </Link>
            </Reveal>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}