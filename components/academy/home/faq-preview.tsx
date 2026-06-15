// components/academy/home/faq-preview.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { FaqAccordion, type FaqItem } from "@/components/academy/ui/accordion"

const FAQS: FaqItem[] = [
  {
    q: "What do I get?",
    a: "Everything. One membership with the full ebook (Mastering Google Ads) and the entire private community — no tiers, no locked rooms.",
  },
  {
    q: "What's the difference between the 30, 60, and 90-day plans?",
    a: "Only the billing length. All three include the exact same full membership; longer plans cost less per day.",
  },
  {
    q: "Do I need Google Ads experience?",
    a: "No. The book starts from clean account setup and assumes zero experience — it's written for beginners.",
  },
  {
    q: "How do access and cancellation work?",
    a: "Instant access when you join. It auto-renews on your chosen cycle; cancel anytime and keep access through your paid period. 30-day satisfied-or-refunded on your first payment.",
  },
  {
    q: "Is Wylorise affiliated with Google, and does it guarantee results?",
    a: "No to both. Wylorise is independent and educational; outcomes depend on your product, offer, budget, market, and execution.",
  },
  {
    q: "Where does the community live?",
    a: "On Telegram. The moment you join, Whop gives you access automatically — there's nothing to connect or set up. A Telegram account is free.",
  },
]

export function FaqPreview() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow">
        <Reveal>
          <SectionHeading eyebrow="faq" title="Questions, answered." />
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <FaqAccordion items={FAQS} />
        </Reveal>
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--omni-brand)]"
          >
            See all FAQs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
