// components/academy/home/who-its-for.tsx
import { Store, MapPin, Briefcase } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"

const CARDS = [
  { icon: Store, title: "Store owners", body: "Run your own Google Ads with a system instead of outsourcing the guesswork." },
  { icon: MapPin, title: "Local & service businesses", body: "Turn 'near me' searches into booked calls and jobs in your area." },
  {
    icon: Briefcase,
    title: "Freelancers & media buyers",
    body: "Sharpen a repeatable process and stay current for every client account.",
  },
]

export function WhoItsFor() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="who it's for"
            title="Built for anyone running Google Ads."
            description="Whether you're launching your first campaign or already spending daily, the book starts from clean account setup, so it meets you where you are. No tiers — everyone gets the same full access."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-[var(--omni-line)] bg-white p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--omni-brand)] text-white">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-[var(--omni-ink)]">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--omni-ink-soft)]">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
