// app/edu/faq/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"
import { FaqAccordion, type FaqItem } from "@/components/academy/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about the Wylorise membership — what's included, the 30/60/90-day plans, refunds and cancellation, the ebook, the Telegram community, and how to get help.",
  alternates: { canonical: "/faq" },
}

const GROUPS: { category: string; items: FaqItem[] }[] = [
  {
    category: "Membership & access",
    items: [
      {
        q: "What do I get with my membership?",
        a: "Everything. One membership includes the full ebook and the entire community — no tiers, no locked rooms, no upgrades.",
      },
      {
        q: "How do I get access after I join?",
        a: "Instantly. You'll get access through your Whop account right after checkout, and Whop adds you to the private Telegram community automatically — there's nothing to connect.",
      },
      {
        q: "Do I need Google Ads experience to start?",
        a: "No. The ebook starts from clean account setup and assumes zero experience — it's written for beginners.",
      },
    ],
  },
  {
    category: "Plans & billing",
    items: [
      {
        q: "What's the difference between the 30, 60, and 90-day plans?",
        a: "Only the billing length. All three include the exact same full membership; longer plans simply cost less per day.",
      },
      {
        q: "Is this a recurring subscription?",
        a: "Yes. Your plan auto-renews on its cycle until you cancel. Your charge appears as WYLORISE.",
      },
      {
        q: "Can I switch plans later?",
        a: "Yes — change your billing length anytime from your account, since every plan includes the same access.",
      },
    ],
  },
  {
    category: "Refunds & cancellation",
    items: [
      {
        q: "What's your refund policy?",
        a: "If Wylorise isn't for you, email support@wylorise.store within 30 days of your first payment for a full refund. Renewals after that are non-refundable.",
      },
      {
        q: "How do I cancel?",
        a: "Cancel anytime from your account. You keep full access through the end of the period you already paid for, and you simply aren't billed again.",
      },
    ],
  },
  {
    category: "The ebook",
    items: [
      {
        q: "What format is the book?",
        a: "It's a digital book you can read on any device, available through your account for as long as you're a member.",
      },
      {
        q: "What does it cover?",
        a: "Five chapters: account setup and clean conversion tracking, staying approved, Shopping feeds in Merchant Center, search ads that convert, and the weekly optimization loop.",
      },
    ],
  },
  {
    category: "The community",
    items: [
      {
        q: "Where does the community live?",
        a: "On Telegram. The moment you join, Whop gives you access automatically — there's nothing to connect or set up. A Telegram account is free to create.",
      },
      {
        q: "How does getting help work?",
        a: "All help is taught to the room — post in the right room and get a clear answer in the open, plus monthly office hours. It is not private, 1-on-1 account management.",
      },
    ],
  },
  {
    category: "Compliance & affiliation",
    items: [
      {
        q: "Does Wylorise guarantee results?",
        a: "No. Wylorise is educational; outcomes depend on your product, offer, budget, market, and execution. We make no income or results guarantees.",
      },
      {
        q: "Is Wylorise affiliated with Google?",
        a: "No. Wylorise is independent and not affiliated with, endorsed by, or sponsored by Google.",
      },
    ],
  },
]

export default function FaqPage() {
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
              eyebrow="faq"
              title="Everything you might be wondering."
              description="Still have a question after this? Reach us anytime at support@wylorise.store."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container size="narrow">
          <div className="space-y-12">
            {GROUPS.map((group, gi) => (
              <Reveal key={group.category} delay={gi * 0.04}>
                <div>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-[var(--omni-brand)]">
                    {group.category}
                  </h2>
                  <div className="mt-4">
                    <FaqAccordion items={group.items} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-3xl border border-[var(--omni-line)] bg-[var(--omni-surface)] p-8 text-center">
              <h3 className="font-display text-xl font-bold text-[var(--omni-ink)]">Ready when you are.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--omni-ink-soft)]">
                One membership, the full ebook and community, 30-day money-back.
              </p>
              <div className="mt-5 flex justify-center">
                <Button asChild size="lg" variant="primary">
                  <Link href="/pricing">
                    Get access <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
