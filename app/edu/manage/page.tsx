// app/edu/manage/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Settings2, CreditCard, CalendarX, Receipt, ArrowRight } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"

export const metadata: Metadata = {
  title: "Manage membership",
  description: "Manage or cancel your Wylorise membership, update payment, or request a refund.",
  alternates: { canonical: "/manage" },
}

const ACTIONS = [
  {
    icon: Settings2,
    title: "Switch your plan",
    body: "Move between the 30, 60, and 90-day billing lengths anytime — same full access either way.",
  },
  { icon: CreditCard, title: "Update payment", body: "Change the card on file for your renewals." },
  {
    icon: CalendarX,
    title: "Cancel anytime",
    body: "When you cancel, you keep full access through the end of your paid period and aren't billed again.",
  },
  {
    icon: Receipt,
    title: "Request a refund",
    body: "Within 30 days of your first payment, email support@wylorise.store for a full refund.",
  },
]

export default function ManagePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.13),transparent)] blur-2xl"
        />
        <Container className="relative pt-20 sm:pt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Your membership"
              title="Manage or cancel — anytime."
              description="Your membership and billing are handled securely by Whop. Everything below takes a minute from your account."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-3xl bg-neutral-950 p-8 text-center sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">Open your account</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-neutral-300">
                Manage your plan, update payment, or cancel from your Whop account in a couple of clicks.
              </p>
              <div className="mt-6 flex justify-center">
                <Button asChild size="lg" variant="accent">
                  <a href="https://whop.com/hub" target="_blank" rel="noreferrer">
                    Manage on Whop <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ACTIONS.map((action, i) => (
              <Reveal key={action.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-[var(--omni-line)] bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--omni-brand-soft)] text-[var(--omni-brand)]">
                    <action.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-[var(--omni-ink)]">{action.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{action.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-[var(--omni-ink-soft)]">
            Cancelling stops future renewals; renewals already paid are non-refundable. See our{" "}
            <Link href="/refund" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
              Refund Policy
            </Link>{" "}
            or{" "}
            <Link href="/support" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
              contact support
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  )
}
