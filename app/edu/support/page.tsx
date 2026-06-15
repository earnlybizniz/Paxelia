// app/edu/support/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { LifeBuoy, BookOpen, Receipt, Settings2, HelpCircle } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { SupportForm } from "@/components/academy/support-form"

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with your Wylorise membership. Email support@wylorise.store — we aim to reply within 24 hours.",
  alternates: { canonical: "/support" },
}

const LINKS = [
  { icon: HelpCircle, title: "Read the FAQ", body: "Answers to the most common questions.", href: "/faq" },
  { icon: Receipt, title: "Refund policy", body: "Our 30-day money-back guarantee.", href: "/refund" },
  { icon: Settings2, title: "Manage or cancel", body: "Change your plan, payment, or cancel.", href: "/manage" },
  { icon: BookOpen, title: "The book", body: "What's inside Mastering Google Ads.", href: "/field-guide" },
]

export default function SupportPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.13),transparent)] blur-2xl"
        />
        <Container className="relative pt-20 sm:pt-28">
          <Reveal>
            <SectionHeading
              eyebrow="support"
              title="We're here to help."
              description="Email us and we aim to reply within 24 hours. For Google Ads questions, the community and ask-the-group are there for you too."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-[var(--omni-line)] bg-white p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                    <LifeBuoy className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-bold text-[var(--omni-ink)]">Send us a message</h2>
                    <a
                      href="mailto:support@wylorise.store"
                      className="text-sm font-medium text-[var(--omni-brand)] hover:underline"
                    >
                      support@wylorise.store
                    </a>
                  </div>
                </div>
                <div className="mt-6">
                  <SupportForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid gap-4 sm:grid-cols-2">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group rounded-3xl border border-[var(--omni-line)] bg-white p-6 transition-shadow hover:shadow-[0_20px_44px_-28px_rgba(11,14,26,0.3)]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--omni-brand-soft)] text-[var(--omni-brand)]">
                      <l.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold text-[var(--omni-ink)]">{l.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{l.body}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--omni-ink-soft)]">
            Billing and access are handled by Whop. You can manage or cancel your membership anytime from your account —
            see{" "}
            <Link href="/manage" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
              Manage membership
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  )
}
