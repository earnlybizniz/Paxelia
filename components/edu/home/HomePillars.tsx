import { EduReveal } from '@/components/edu/EduReveal'
import { ArrowRight, BookOpen, Users } from 'lucide-react'

const pillars = [
  {
    label: 'The field guide',
    icon: BookOpen,
    title: 'Signal & Scale: The Meta Field Guide',
    body: 'A practitioner-level system built on 12 frameworks — from clean tracking and account setup through creative, budgeting, audiences, landing pages, troubleshooting, and compliance, all the way to scaling on honest metrics. Every framework comes with a step-by-step method, a worked example with real numbers, and a "do this week" action — so you use it, not just read it.',
    linkLabel: 'Explore the field guide',
    href: '/field-guide',
  },
  {
    label: 'The community',
    icon: Users,
    title: 'Your live intelligence desk',
    body: 'The book teaches the system once; the community keeps it current as Meta changes. Daily ad breakdowns, real-time policy and delivery alerts, a weekly recap, vetted product research, creative resources, an AI/workflow channel, a peer community, a live weekly group call, and a replay library. Every bit of help is taught to the room — never private 1-on-1 account management.',
    linkLabel: 'Step inside the community',
    href: '/community',
  },
]

export function HomePillars() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--edu-gold-deep)]">
            What you get
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            One membership. Two parts that work together.
          </h2>
        </EduReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <EduReveal
                key={pillar.title}
                delay={i * 100}
                className="flex flex-col rounded-2xl border border-border bg-card p-8 lg:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-[var(--edu-gold-deep)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {pillar.label}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-4 flex-1 text-pretty leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
                <a
                  href={pillar.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-[var(--edu-gold-deep)]"
                >
                  {pillar.linkLabel}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </EduReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
