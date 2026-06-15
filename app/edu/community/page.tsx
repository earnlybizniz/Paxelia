// app/edu/community/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Users, ShieldCheck, ListChecks, Library, Trophy, CalendarClock, MessageSquare, LayoutGrid } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { Button } from "@/components/academy/ui/button"
import { CommunityPreview } from "@/components/academy/home/previews"

export const metadata: Metadata = {
  title: "The Community",
  description:
    "Your weekly operating desk — a focused action each week, Google policy updates, a template vault, ask-the-group Q&A, wins, and monthly office hours. Included with every Wylorise membership, on Telegram.",
  alternates: { canonical: "/community" },
}

const FEATURES = [
  { icon: ListChecks, title: "Weekly optimize loop", body: "One focused action each week, straight from the book — do it, then check in." },
  { icon: ShieldCheck, title: "Weekly policy updates", body: "Google & Merchant Center policy changes, the moment they matter — so you stay approved." },
  { icon: Library, title: "Template vault", body: "Every checklist from the book, ready to copy — and it keeps growing." },
  { icon: MessageSquare, title: "Ask the group", body: "Post your question and get a clear answer in the open, where everyone learns." },
  { icon: Trophy, title: "Wins", body: "Share approvals, first conversions, and lower cost per conversion — what worked, honestly." },
  { icon: CalendarClock, title: "Monthly office hours", body: "A monthly live Q&A. Everything else runs on the weekly rhythm, so you're never waiting." },
]

export default function CommunityPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.14),transparent)] blur-2xl"
        />
        <Container className="relative pt-20 sm:pt-28">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--omni-line)] bg-[var(--omni-surface)] px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-tight text-[var(--omni-ink-soft)]">
                <Users className="h-3.5 w-3.5 text-[var(--omni-brand)]" /> the community
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.07] tracking-tight text-[var(--omni-ink)] sm:text-5xl">
                Your weekly operating desk
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--omni-ink-soft)]">
                The book teaches the system once. The private Telegram community keeps it current as Google changes —
                and it&apos;s all taught to the room, never private 1-on-1.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" variant="primary">
                  <Link href="/pricing">
                    Get access <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-14">
            <div className="mx-auto max-w-3xl">
              <CommunityPreview />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="what's inside" title="Everything you need to stay sharp." />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-3xl border border-[var(--omni-line)] bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-[var(--omni-ink)]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--omni-surface)] py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl border border-[var(--omni-line)] bg-white p-8">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-[var(--omni-ink)]">Help, taught to the room</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                  Ask your question and get a clear answer in the open, where everyone learns from it. It&apos;s
                  practical coaching for the whole community — not private, 1-on-1 account management.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-[var(--omni-line)] bg-white p-8">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                  <LayoutGrid className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-[var(--omni-ink)]">Organized to match the book</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                  Rooms map to the chapters — setup, staying approved, feeds, search, and tracking — so you always know
                  where to go. One membership, every room open; no tiers, no locked rooms.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-3xl border border-[var(--omni-line)] bg-white p-8 text-center">
              <h2 className="font-display text-2xl font-bold text-[var(--omni-ink)]">How you join</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">
                The community runs on Telegram. The moment you join Wylorise, Whop gives you access automatically —
                there&apos;s nothing to connect or set up. A Telegram account is free to create.
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
