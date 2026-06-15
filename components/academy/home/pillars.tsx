// components/academy/home/pillars.tsx
import Link from "next/link"
import { ArrowRight, BookOpen, Users } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"

const BOOK_POINTS = [
  "5 chapters — setup to optimization",
  "A method plus a worked example in each",
  "A 'do this' action at the end of every chapter",
]
const COMMUNITY_POINTS = [
  "A weekly action from the optimize loop",
  "Weekly Google policy updates so you stay approved",
  "Template vault + ask-the-group Q&A",
]

export function Pillars() {
  return (
    <section className="bg-[var(--omni-surface)] py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="what you get"
            title="A system you can actually run."
            description="One complete membership — not a ladder of upsells. The moment you join, the full ebook and the entire community are yours."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-[var(--omni-line)] bg-white p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--omni-brand-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--omni-brand)]">
                <BookOpen className="h-3.5 w-3.5" /> The ebook
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-[var(--omni-ink)]">Mastering Google Ads</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                A beginner-friendly system — account setup and clean conversion tracking, staying approved, Shopping
                feeds, search ads that match intent, and the weekly optimization loop that turns clicks into customers.
              </p>
              <ul className="mt-5 space-y-2.5">
                {BOOK_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-[var(--omni-ink)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--omni-brand)]" /> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/field-guide"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--omni-brand)]"
              >
                Explore the book{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-[var(--omni-line)] bg-white p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--omni-brand-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--omni-brand)]">
                <Users className="h-3.5 w-3.5" /> The community
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-[var(--omni-ink)]">Your weekly operating desk</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                The book teaches the system once; the private Telegram community keeps it current as Google changes — a
                weekly action, policy updates, a growing template vault, and group Q&amp;A.
              </p>
              <ul className="mt-5 space-y-2.5">
                {COMMUNITY_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-[var(--omni-ink)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--omni-brand)]" /> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/community"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--omni-brand)]"
              >
                Step inside the community{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
