import { EduReveal } from '@/components/edu/EduReveal'
import { ArrowRight } from 'lucide-react'

export function HomeWhy() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--edu-gold-deep)]">
            Why Omnirise
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Why Omnirise.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Most Meta ads education sells hype or one guru&apos;s highlight
            reel. We do the opposite: a clear, current system, taught in the
            open, with no income promises and nothing hidden. We&apos;re
            independent — not affiliated with Meta — and we&apos;d rather earn
            your renewal than oversell the join.
          </p>
          <a
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-[var(--edu-gold-deep)]"
          >
            More about Omnirise
            <ArrowRight className="h-4 w-4" />
          </a>
        </EduReveal>
      </div>
    </section>
  )
}
