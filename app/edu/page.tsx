// app/edu/page.tsx
import { Hero } from "@/components/academy/home/hero"
import { Problem } from "@/components/academy/home/problem"
import { Pillars } from "@/components/academy/home/pillars"
import { LookInside } from "@/components/academy/home/look-inside"
import { HowItWorks } from "@/components/academy/home/how-it-works"
import { WhoItsFor } from "@/components/academy/home/who-its-for"
import { Why } from "@/components/academy/home/why"
import { PricingTeaser } from "@/components/academy/home/pricing-teaser"
import { FaqPreview } from "@/components/academy/home/faq-preview"
import { FinalCta } from "@/components/academy/home/final-cta"
import { Marquee } from "@/components/academy/ui/marquee"

const STRIP = [
  "Account setup that tracks",
  "Staying approved",
  "Shopping feed fixes",
  "Search-intent mapping",
  "Conversion tracking",
  "Weekly optimize loop",
  "Policy updates",
  "Template vault",
]

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="border-y border-[var(--omni-line)] bg-white py-5">
        <Marquee>
          {STRIP.map((s) => (
            <span key={s} className="flex items-center gap-3 px-2 text-sm font-medium text-[var(--omni-ink-soft)]">
              {s}
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--omni-brand-2)]" />
            </span>
          ))}
        </Marquee>
      </div>

      <Problem />
      <Pillars />
      <LookInside />
      <HowItWorks />
      <WhoItsFor />
      <Why />
      <PricingTeaser />
      <FaqPreview />
      <FinalCta />
    </>
  )
}
