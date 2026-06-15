import { EduReveal } from '@/components/edu/EduReveal'
import { ShieldCheck } from 'lucide-react'

export function HomeGuarantee() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-[var(--edu-gold-deep)]">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Try it for 30 days.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            If Omnirise isn&apos;t for you, email us within 30 days of your first
            payment for a full refund. No hoops.
          </p>
        </EduReveal>
      </div>
    </section>
  )
}
