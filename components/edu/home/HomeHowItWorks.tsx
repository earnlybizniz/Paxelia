import { EduReveal } from '@/components/edu/EduReveal'
import { steps } from '@/lib/edu/home-content'

export function HomeHowItWorks() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How it works.
          </h2>
        </EduReveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <EduReveal
              key={step.n}
              as="li"
              delay={i * 80}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <span className="font-display text-3xl font-semibold text-[var(--edu-gold-deep)]">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </EduReveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
