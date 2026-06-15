import { EduReveal } from '@/components/edu/EduReveal'

const badges = ['Beginner', 'Intermediate', 'Advanced']

export function HomeWhoFor() {
  return (
    <section className="border-b border-border bg-secondary/40 py-20 lg:py-28">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <EduReveal>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Who it&apos;s for.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Store owners and media buyers — whether you&apos;re launching your
            first campaign or already spending daily and want a sharper,
            repeatable system. Set a Beginner, Intermediate, or Advanced badge
            inside the community so advice meets you at your level. It&apos;s
            just an identity tag — everyone gets the same full access.
          </p>
        </EduReveal>

        <EduReveal delay={120} className="flex flex-wrap gap-4 lg:justify-end">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground"
            >
              {badge}
            </span>
          ))}
        </EduReveal>
      </div>
    </section>
  )
}
