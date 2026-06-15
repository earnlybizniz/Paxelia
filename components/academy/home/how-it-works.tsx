// components/academy/home/how-it-works.tsx
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"

const STEPS = [
  { n: "01", title: "Join", body: "Pick your billing length and get instant access." },
  { n: "02", title: "Get the book + community", body: "The full ebook and every community room, immediately." },
  { n: "03", title: "Run the weekly loop", body: "Apply the frameworks with one focused action each week." },
  { n: "04", title: "Stay current", body: "Weekly actions and policy updates keep you ahead as Google changes." },
]

export function HowItWorks() {
  return (
    <section className="bg-[var(--omni-surface)] py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="how it works" title="From guesswork to a system in four steps." />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <div className="relative h-full rounded-3xl border border-[var(--omni-line)] bg-white p-7">
                <span className="font-display text-3xl font-extrabold text-transparent [-webkit-text-stroke:1px_rgba(0,87,231,0.55)]">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-[var(--omni-ink)]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
