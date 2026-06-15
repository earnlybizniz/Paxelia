// components/academy/home/pricing-teaser.tsx
import Link from "next/link"
import { Check } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading, Pill } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"
import { PLANS, MEMBERSHIP_INCLUDES } from "@/config/academy/plans"
import { cn } from "@/lib/utils"

export function PricingTeaser() {
  return (
    <section className="bg-[var(--omni-surface)] py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="pricing"
            title="One membership. Choose your billing length."
            description="Every plan includes the same full membership. Longer commitments cost less per day."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.07}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border bg-white p-7 transition-shadow",
                  plan.featured
                    ? "border-[var(--omni-brand)]/40 shadow-[0_30px_60px_-30px_rgba(0,87,231,0.45)]"
                    : "border-[var(--omni-line)] hover:shadow-[0_24px_50px_-30px_rgba(11,14,26,0.3)]",
                )}
              >
                {plan.badge ? (
                  <div className="absolute -top-3 left-7">
                    <Pill>{plan.badge}</Pill>
                  </div>
                ) : null}
                <h3 className="font-display text-lg font-bold text-[var(--omni-ink)]">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-[var(--omni-ink)]">
                    ${plan.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--omni-ink-soft)]">{plan.perDay}</p>
                {plan.note ? <p className="mt-1 text-xs font-medium text-[var(--omni-brand)]">{plan.note}</p> : null}
                <Button asChild variant={plan.featured ? "primary" : "outline"} className="mt-6 w-full">
                  <Link href={`/checkout?plan=${plan.id}`}>Get access</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--omni-line)] bg-white p-7">
            <p className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-[var(--omni-ink-soft)]">
              Every plan includes
            </p>
            <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {MEMBERSHIP_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--omni-ink)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--omni-brand)]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--omni-ink-soft)]">
          Auto-renews on your chosen cycle. Cancel anytime — keep access through your paid period. 30-day
          satisfied-or-refunded on your first payment. No free trial.
        </p>
      </Container>
    </section>
  )
}
