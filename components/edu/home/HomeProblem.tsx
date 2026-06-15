import { EduReveal } from '@/components/edu/EduReveal'
import { problemPoints } from '@/lib/edu/home-content'

export function HomeProblem() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <EduReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Most advertisers are guessing.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            You change a setting, hope it works, and check the numbers tomorrow.
            Costs creep up. A winning ad dies for no clear reason. Half the
            advice online contradicts the other half — and Meta changes the
            rules again before you&apos;ve figured out the last set. It
            isn&apos;t a knowledge problem. It&apos;s the lack of a system.
          </p>
        </EduReveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {problemPoints.map((point, i) => (
            <EduReveal
              key={point.title}
              delay={i * 80}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <h3 className="font-display text-xl font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.body}
              </p>
            </EduReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
