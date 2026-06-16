import { Section } from '@/components/shell/Section'
import { Eyebrow } from '@/components/shell/Typography'
import {
  ArrowUpDown,
  LayoutGrid,
  MoveVertical,
  Blocks,
  Layers,
  LayoutDashboard,
  Lightbulb,
  BatteryCharging,
  Server,
  Dumbbell,
} from 'lucide-react'

/**
 * FeatureGrid — the broad, at-a-glance overview that opens the product story.
 * Pure icon + label grid (lucide icons, no image assets) so it renders instantly
 * and stays crisp at any size. Sits directly below the social-proof bar.
 */

const FEATURES: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; label: string }[] = [
  { icon: ArrowUpDown, label: 'Ergonomic sit-stand' },
  { icon: LayoutGrid, label: 'Hidden pegboard storage' },
  { icon: MoveVertical, label: '30–55.9″ height range' },
  { icon: Blocks, label: 'Modular accessories' },
  { icon: Layers, label: 'Three-tier workspace' },
  { icon: LayoutDashboard, label: 'Zoned space management' },
  { icon: Lightbulb, label: 'Task light + RGB' },
  { icon: BatteryCharging, label: '3-in-1 charging' },
  { icon: Server, label: 'PC case stand' },
]

export function FeatureGrid() {
  return (
    <Section id="overview" tone="paper">
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-4 max-w-2xl">
          <Eyebrow>10-in-1 standing desk</Eyebrow>
          <h2
            className="font-display font-semibold leading-[1.12] tracking-[-0.01em] text-[var(--ink)]"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            One desk. Everything built in.
          </h2>
          <p className="font-sans text-[1rem] leading-relaxed text-[var(--ink-soft)]">
            The Snapsticker Apex folds a whole workspace — lift, storage, power, light, and more — into a single
            dual-level frame. Here&apos;s what you get out of the box.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center text-center gap-3 rounded-[12px] bg-[var(--paper2)] px-4 py-7 md:py-9"
            >
              <f.icon size={30} strokeWidth={1.5} className="text-[var(--highlight)]" />
              <span className="font-display font-medium text-[0.9rem] leading-snug text-[var(--ink)]">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Capacity badge */}
        <div className="flex items-center justify-center gap-3 rounded-[12px] bg-[var(--ink)] px-6 py-5">
          <Dumbbell size={26} strokeWidth={1.5} className="text-[var(--highlight)]" />
          <span className="font-display font-semibold text-[1.05rem] md:text-[1.2rem] text-[var(--paper)]">
            Built to carry 50&nbsp;kg / 110&nbsp;lb
          </span>
        </div>
      </div>
    </Section>
  )
}
