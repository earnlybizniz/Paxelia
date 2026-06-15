import { EduReveal } from '@/components/edu/EduReveal'
import { ArrowRight } from 'lucide-react'

export function HomeFinalCta() {
  return (
    <section className="bg-foreground py-20 text-background lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Run Meta ads with intention.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-background/70">
            Get the field guide, the community, and a system that keeps you
            current — in one membership.
          </p>
          <a
            href="/pricing"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-3.5 text-base font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Get access
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-background/50">
            Educational only. No income or results guarantees. Independent and
            not affiliated with Meta, Facebook, or Instagram.
          </p>
        </EduReveal>
      </div>
    </section>
  )
}
