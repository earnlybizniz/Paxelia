import { EduReveal } from '@/components/edu/EduReveal'
import { eduPlans, eduIncluded } from '@/lib/edu/site'
import { Check } from 'lucide-react'

export function HomePricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border bg-secondary/40 py-20 lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            One membership. Choose your billing length.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every plan includes the same full membership. Longer commitments
            cost less per day.
          </p>
        </EduReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {eduPlans.map((plan, i) => (
            <EduReveal
              key={plan.id}
              delay={i * 90}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
                plan.highlight
                  ? 'border-[var(--edu-gold-deep)] shadow-md ring-1 ring-[var(--edu-gold-deep)]'
                  : 'border-border'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--edu-gold-deep)] px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-foreground">
                  {plan.price}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.perDay}
                {plan.note ? ` · ${plan.note}` : ''}
              </p>
              <a
                href={plan.href}
                className={`mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90 ${
                  plan.highlight
                    ? 'bg-[var(--edu-gold-deep)] text-white'
                    : 'bg-foreground text-background'
                }`}
              >
                Get access
              </a>
            </EduReveal>
          ))}
        </div>

        {/* Included (shown once) */}
        <EduReveal className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Every plan includes
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {eduIncluded.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-[var(--edu-gold-deep)]" />
                {item}
              </li>
            ))}
          </ul>
        </EduReveal>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          Auto-renews on your chosen cycle. Cancel anytime — keep access through
          your paid period. 30-day satisfied-or-refunded on your first payment.
          No free trial.
        </p>
      </div>
    </section>
  )
}
