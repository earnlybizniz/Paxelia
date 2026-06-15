import { EduReveal } from '@/components/edu/EduReveal'

export function HomeSolution() {
  return (
    <section className="border-b border-border bg-foreground py-20 text-background lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            A system you can actually run.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-background/70">
            Omnirise turns Meta ads into a repeatable process — and it&apos;s
            one complete membership, not a ladder of upsells. The moment you
            join, the full field guide and the entire community are yours. No
            tiers. No locked rooms. No &ldquo;upgrade to unlock.&rdquo;
          </p>
        </EduReveal>
      </div>
    </section>
  )
}
