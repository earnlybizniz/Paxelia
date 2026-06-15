// app/edu/field-guide/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, FlaskConical, CalendarCheck } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"
import { BookPreview } from "@/components/academy/home/previews"

export const metadata: Metadata = {
  title: "The Book",
  description:
    "Mastering Google Ads — a beginner-friendly system in five chapters, from account setup and clean conversion tracking to staying approved, Shopping feeds, search ads, and the weekly optimize loop. Included with every Wylorise membership.",
  alternates: { canonical: "/field-guide" },
}

const CHAPTERS: [string, string, string][] = [
  ["01", "Account setup that tracks", "Create the account with the right goal and verified conversion tracking before you spend a dollar."],
  ["02", "Staying approved", "The Policy Shield Workflow — match every ad claim to your page and avoid disapprovals and suspensions."],
  ["03", "Shopping feeds & Merchant Center", "Fix feed errors with GMC Diagnostics so your products move from disapproved to eligible."],
  ["04", "Search ads that convert", "The Intent-to-Offer Map — line up search intent, your offer, and your landing page so clicks become leads."],
  ["05", "Tracking & the optimize loop", "Trustworthy conversion tracking and a simple weekly loop that turns clicks into customers."],
]

const BUILD = [
  { icon: BookOpen, title: "A clear method", body: "Each chapter lays out the steps in plain language — no fluff, no jargon walls." },
  { icon: FlaskConical, title: "A worked example", body: "See it applied with a real scenario so you know exactly what 'good' looks like." },
  { icon: CalendarCheck, title: "A 'do this' action", body: "Every chapter ends with a concrete next step you can take immediately." },
]

export default function FieldGuidePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.14),transparent)] blur-2xl"
        />
        <Container className="relative grid items-center gap-12 pt-20 sm:pt-28 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--omni-line)] bg-[var(--omni-surface)] px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-tight text-[var(--omni-ink-soft)]">
                <BookOpen className="h-3.5 w-3.5 text-[var(--omni-brand)]" /> the ebook
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.07] tracking-tight text-[var(--omni-ink)] sm:text-5xl">
                Mastering Google Ads
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--omni-ink-soft)]">
                A beginner-friendly system for running Google Ads — five chapters that take you from clean account setup
                and conversion tracking all the way to a weekly optimization loop. Included with every membership.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="primary">
                  <Link href="/pricing">
                    Get access <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/community">See the community</Link>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <BookPreview />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="what you'll learn"
              title="Five chapters, setup to optimization."
              description="Each one builds on the last, so you finish with a system you can run on repeat — not a pile of disconnected tips."
            />
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map(([n, title, body], i) => (
              <Reveal key={n} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-2xl border border-[var(--omni-line)] bg-white p-6 transition-shadow hover:shadow-[0_20px_44px_-28px_rgba(11,14,26,0.3)]">
                  <span className="font-mono text-sm font-bold text-[var(--omni-brand)]">{n}</span>
                  <h3 className="mt-2 font-display text-base font-bold text-[var(--omni-ink)]">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--omni-surface)] py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="how it's built" title="Made to use, not just read." />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {BUILD.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-[var(--omni-line)] bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-[var(--omni-ink)]">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 px-8 py-14 text-center sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.4),transparent)] blur-2xl"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  The book is half the membership.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-neutral-300">
                  The other half is the community — where the system stays current as Google changes, with a weekly
                  action, policy updates, a template vault, and group Q&amp;A.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg" variant="primary">
                    <Link href="/pricing">
                      Get access <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Link
                    href="/community"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#8fb4ff] hover:text-white"
                  >
                    Explore the community{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
