// app/edu/thank-you/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Mail, BookOpen, MessageSquare, ListChecks, ArrowRight } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { Button } from "@/components/academy/ui/button"

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to Wylorise — here's how to get started.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
}

const STEPS = [
  {
    icon: Mail,
    title: "Check your email",
    body: "We've sent your receipt and access details. Access is also available anytime in your Whop account.",
  },
  {
    icon: BookOpen,
    title: "Open the ebook",
    body: "Start Mastering Google Ads with Chapter 1 — setting up your account and clean conversion tracking.",
  },
  {
    icon: MessageSquare,
    title: "Join the Telegram community",
    body: "Your private Telegram access is in your Whop account — open it to join. It's set up automatically; nothing to connect.",
  },
  {
    icon: ListChecks,
    title: "Run this week's action",
    body: "Head to This Week's Loop in the community and do the first action. One change at a time — that's the method.",
  },
]

export default function ThankYouPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow">
        <Reveal>
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-[var(--omni-ink)]">
              You&apos;re in.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-[var(--omni-ink-soft)]">
              Welcome to Wylorise. Here&apos;s how to get the most out of your membership from day one.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex items-start gap-4 rounded-2xl border border-[var(--omni-line)] bg-white p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--omni-brand)] text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--omni-ink)]">
                    {i + 1}. {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild size="lg" variant="primary">
              <a href="https://whop.com/hub" target="_blank" rel="noreferrer">
                Go to your account <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <p className="max-w-md text-center text-xs leading-relaxed text-[var(--omni-ink-soft)]">
              Your membership auto-renews on your chosen cycle and your charge appears as WYLORISE. You can cancel
              anytime — see{" "}
              <Link href="/manage" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
                Manage membership
              </Link>
              . Need anything?{" "}
              <Link href="/support" className="font-medium text-[var(--omni-brand)] underline underline-offset-2">
                Contact support
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
