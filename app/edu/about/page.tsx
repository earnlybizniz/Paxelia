// app/edu/about/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, Eye, ShieldCheck } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"

export const metadata: Metadata = {
  title: "About",
  description:
    "Wylorise is the Google Ads membership for beginners, store owners, and freelancers — a clear, current system taught in the open, with no income promises. Independent and not affiliated with Google.",
  alternates: { canonical: "/about" },
}

const PRINCIPLES = [
  {
    icon: Compass,
    title: "A system, not hype",
    body: "We teach a repeatable process for running Google Ads — not a highlight reel or a get-rich promise.",
  },
  {
    icon: Eye,
    title: "Taught in the open",
    body: "Help happens in the room, where everyone learns. Nothing important is hidden behind another upsell.",
  },
  {
    icon: ShieldCheck,
    title: "Honest by default",
    body: "No income guarantees, clear policies, easy cancellation. We'd rather earn your renewal than oversell the join.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.13),transparent)] blur-2xl"
        />
        <Container className="relative pt-20 sm:pt-28">
          <Reveal>
            <SectionHeading
              eyebrow="about"
              title="Run Google Ads with intention."
              description="Wylorise is a membership for beginners, store owners, and freelancers who are tired of guessing — one place for the system and the support to run Google Ads on purpose."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-[var(--omni-ink-soft)]">
              <p>
                Most Google Ads education falls into two camps: vague theory that never touches a real account, or a
                guru selling their highlight reel. Both leave you guessing when leads dry up or Google changes the rules
                again.
              </p>
              <p>
                Wylorise was built as the opposite — a clear, current system you can actually run, paired with a
                community that keeps it sharp as the platform shifts. One membership, everyone gets everything: the full
                ebook and the entire community, no tiers and no locked rooms.
              </p>
              <p>
                We don&apos;t promise income or results. What we promise is clarity, honesty, and a system taught in the
                open — so you always know what to do next.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-[var(--omni-surface)] py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="what we stand for" title="The principles behind Wylorise." />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-[var(--omni-line)] bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-[var(--omni-ink)]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-3xl border border-[var(--omni-line)] bg-white p-8 text-center">
              <p className="text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                Wylorise is independent and educational. It is not affiliated with, endorsed by, or sponsored by Google.
              </p>
              <div className="mt-6 flex justify-center">
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
