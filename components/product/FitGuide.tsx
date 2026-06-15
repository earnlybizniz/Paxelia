'use client'

import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { Ruler, Monitor, ShieldCheck } from 'lucide-react'

const E = [0.16, 1, 0.3, 1] as const

// Three answers to "will it fit you?"
const FITS = [
  {
    icon: Ruler,
    kicker: 'Fits your body',
    headline: 'Sit or stand, dialed in with one tap',
    detail: 'The natural bamboo top rises from 23.6" to 48.8" on a smooth dual-motor lift, controlled by a wireless remote with four programmable presets — low enough to sit ergonomically, tall enough to stand comfortably through a long day. Anti-collision detection keeps everything safe.',
    stat: '23.6"–48.8"',
    statLabel: 'Height range',
  },
  {
    icon: Monitor,
    kicker: 'Fits your setup',
    headline: 'From a single laptop to a full triple-monitor command center',
    detail: 'The Standard (55") suits a focused single-screen setup in compact spaces. The Pro (63") is the sweet spot for dual monitors and the size most people choose. The Executive (72") spreads out a full multi-monitor, dual-tower setup with room to breathe — all 30" deep.',
    stat: '55" / 63" / 72"',
    statLabel: 'Width options',
  },
  {
    icon: ShieldCheck,
    kicker: 'Fits your life',
    headline: 'Holds 220 lb and stays rock-steady',
    detail: 'A dual-motor lift rated for 220 lb carries dual monitors, desktop computers, and everything else smoothly between sitting and standing. Genuine bamboo on top, premium steel frame beneath, backed by a 15-year warranty on frame, motors, and electronics.',
    stat: '220 lb',
    statLabel: 'Lift capacity',
  },
]


export function FitGuide() {

  return (
    <Section id="fit-guide" tone="paper">
      <div className="flex flex-col gap-10 md:gap-14">
        {/* Heading */}
        <div className="max-w-2xl">
          <Eyebrow>Will It Fit You?</Eyebrow>
          <SectionHeading as="h2" className="!text-[clamp(1.75rem,4vw,2.75rem)] mt-3">
            Built around you — not the other way around
          </SectionHeading>
          <p className="font-sans text-[0.95rem] md:text-[1.05rem] text-[var(--ink-soft)] leading-relaxed mt-4">
            Three things decide whether a desk truly fits: your body, your setup, and how hard you push it. Here&apos;s where this one lands on all three.
          </p>
        </div>

        {/* Three fit cards — stacked on mobile, 3 columns on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">
          {FITS.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="flex flex-col gap-4 p-6 md:p-7 rounded-[10px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
              >
                {/* Icon + kicker */}
                <div className="flex items-center gap-2.5">
                  <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] font-medium text-[var(--accent)]">
                    {f.kicker}
                  </span>
                </div>

                {/* Big stat */}
                <div className="flex flex-col">
                  <span className="font-display text-[2rem] md:text-[2.25rem] leading-none text-[var(--ink)]">
                    {f.stat}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-wider text-[var(--ink-mute)] mt-1.5">
                    {f.statLabel}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-display text-[1.15rem] md:text-[1.25rem] leading-snug text-[var(--ink)]">
                  {f.headline}
                </h3>

                {/* Detail */}
                <p className="font-sans text-[0.9rem] text-[var(--ink-soft)] leading-relaxed">
                  {f.detail}
                </p>
              </div>
            )
          })}
        </div>

        {/* Reassurance line */}
        <Reveal variant="fade">
          <p className="text-center text-[0.875rem] text-[var(--ink-mute)] max-w-xl mx-auto">
            Still unsure? Every desk ships with a 30-day trial — set it up, live with it, and send it back free if it&apos;s not right.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
