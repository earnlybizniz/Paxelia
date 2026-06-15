import Image from 'next/image'
import { EduReveal } from '@/components/edu/EduReveal'

const cards = [
  {
    src: '/images/edu/home/look-inside-guide.png',
    alt: 'A sample framework spread from the field guide showing a method, a worked example, and a this-week action.',
    caption:
      'A sample framework — method, worked example, and a this-week action.',
  },
  {
    src: '/images/edu/home/look-inside-community.png',
    alt: 'Inside the Omnirise community showing the channel list and a sample daily ad breakdown.',
    caption:
      'Inside the community — daily breakdowns, alerts, and the weekly call.',
  },
]

export function HomeLookInside() {
  return (
    <section
      id="look-inside"
      className="scroll-mt-24 border-b border-border bg-secondary/40 py-20 lg:py-28"
    >
      <div className="container">
        <EduReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            See exactly what you&apos;re getting.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            No mystery box. Look inside the field guide and the community before
            you decide.
          </p>
        </EduReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {cards.map((card, i) => (
            <EduReveal key={card.src} delay={i * 100}>
              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={card.src || "/placeholder.svg"}
                    alt={card.alt}
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
                  {card.caption}
                </figcaption>
              </figure>
            </EduReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
