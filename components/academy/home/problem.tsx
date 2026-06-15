// components/academy/home/problem.tsx
import { TrendingDown, Repeat, Clock } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"

const POINTS = [
  {
    icon: TrendingDown,
    title: "Budget you can't read",
    body: "Clicks come in, but you can't tell which ones become leads or sales — so you keep guessing.",
  },
  {
    icon: Repeat,
    title: "No repeatable process",
    body: "Every campaign starts from a blank page instead of a system you trust.",
  },
  {
    icon: Clock,
    title: "One policy from a shutdown",
    body: "A disapproval or a Google update can stall your ads before the last fix paid off.",
  },
]

export function Problem() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="the problem"
            title="Most advertisers are guessing."
            description="You change a setting, hope it works, and check the numbers tomorrow. Half the advice online contradicts the other half — and Google changes the rules again before you've figured out the last set. It isn't a knowledge problem. It's the lack of a system."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-[var(--omni-line)] bg-white p-7 transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(11,14,26,0.35)]">
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
  )
}
