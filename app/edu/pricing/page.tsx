// app/edu/pricing/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading, Pill } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"
import { FaqAccordion, type FaqItem } from "@/components/academy/ui/accordion"
import { PLANS, MEMBERSHIP_INCLUDES } from "@/config/academy/plans"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One Wylorise membership, three billing lengths — 30, 60, or 90 days. Everyone gets the full ebook and the entire community. Cancel anytime; 30-day money-back on your first payment.",
  alternates: { canonical: "/pricing" },
}

const BILLING_FAQ: FaqItem[] = [
  {
    q: "Is this a subscription?",
    a: "Yes. Your plan auto-renews on its cycle (every 30, 60, or 90 days) until you cancel. You can cancel anytime and keep access through the end of your paid period.",
  },
  {
    q: "Can I switch between the 30, 60, and 90-day plans?",
    a: "Yes. Every plan includes the same full membership, so you can change your billing length anytime from your account — for example, moving to 90 days for the better per-day rate.",
  },
  {
    q: "How does the refund work?",
    a: "If Wylorise isn't for you, email support@wylorise.store within 30 days of your first payment for a full refund. Renewals after that are non-refundable.",
  },
  {
    q: "What happens when I cancel?",
    a: "You keep full access until the end of the period you already paid for, and you simply aren't billed again.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Checkout is handled securely by Whop, including card and express options like Apple Pay and Google Pay. Your charge appears as WYLORISE.",
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.14),transparent)] blur-2xl"
        />
        <Container className="relative pt-20 sm:pt-28">
          <Reveal>
            <SectionHeading
              eyebrow="pricing"
              title="One membership. Choose your billing length."
              description="Every plan includes the same full membership — the entire ebook and the entire community. Longer commitments simply cost less per day."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.07}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border bg-white p-8 transition-shadow",
                    plan.featured
                      ? "border-[var(--omni-brand)]/40 shadow-[0_30px_60px_-30px_rgba(0,87,231,0.45)]"
                      : "border-[var(--omni-line)] hover:shadow-[0_24px_50px_-30px_rgba(11,14,26,0.3)]",
                  )}
                >
                  {plan.badge ? (
                    <div className="absolute -top-3 left-8">
                      <Pill>{plan.badge}</Pill>
                    </div>
                  ) : null}
                  <h3 className="font-display text-xl font-bold text-[var(--omni-ink)]">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[var(--omni-ink-soft)]">Full membership · billed every {plan.days} days</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-extrabold tracking-tight text-[var(--omni-ink)]">
                      ${plan.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--omni-ink-soft)]">{plan.perDay}</p>
                  {plan.note ? <p className="mt-1 text-xs font-medium text-[var(--omni-brand)]">{plan.note}</p> : null}
                  <Button asChild variant={plan.featured ? "primary" : "outline"} size="lg" className="mt-6 w-full">
                    <Link href={`/checkout?plan=${plan.id}`}>Get access</Link>
                  </Button>
                  <p className="mt-3 text-center text-xs text-[var(--omni-ink-soft)]">30-day money-back · cancel anytime</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--omni-line)] bg-[var(--omni-surface)] p-8">
              <p className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-[var(--omni-ink-soft)]">
                Every plan includes the same full membership
              </p>
              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {MEMBERSHIP_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--omni-ink)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--omni-brand)]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--omni-ink-soft)]">
            Auto-renews on your chosen cycle. Cancel anytime — keep access through your paid period; renewals are
            non-refundable. No free trial. Checkout is secured by Whop and your charge appears as WYLORISE.
          </p>
        </Container>
      </section>

      <section className="py-8">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-3xl border border-[var(--omni-line)] bg-[var(--omni-surface)] p-8 text-center">
              <h2 className="font-display text-2xl font-bold text-[var(--omni-ink)]">Try it for 30 days</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                If Wylorise isn&apos;t for you, email us within 30 days of your first payment for a full refund. No
                hoops.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container size="narrow">
          <Reveal>
            <SectionHeading eyebrow="billing" title="Billing questions, answered." />
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <FaqAccordion items={BILLING_FAQ} />
          </Reveal>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 px-8 py-14 text-center sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.4),transparent)] blur-2xl"
              />
              <div className="relative">
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">Get the full membership.</h2>
                <p className="mx-auto mt-3 max-w-lg text-neutral-300">
                  The ebook and the community, in one place. Pick the billing length that suits you.
                </p>
                <div className="mt-7 flex justify-center">
                  <Button asChild size="lg" variant="primary">
                    <Link href="/checkout?plan=90">Get access</Link>
                  </Button>
                </div>
                <p className="mx-auto mt-5 max-w-md text-xs text-neutral-500">
                  Educational only. No income or results guarantees. Not affiliated with Google.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
