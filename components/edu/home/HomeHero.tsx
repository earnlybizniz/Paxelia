import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { trustItems } from '@/lib/edu/home-content'

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        {/* Copy */}
        <div className="reveal-in max-w-xl">
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            The Meta ads membership
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Run Meta ads with intention — not guesswork.
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            One membership: the complete field guide plus a live community that
            keeps you current as Meta changes. Everyone gets everything.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get access
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#look-inside"
              className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              See what&apos;s inside
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="reveal-in relative">
          <div className="absolute -inset-4 rounded-3xl bg-secondary/60" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Image
              src="/images/edu/home/hero-guide-community.png"
              alt="Signal & Scale field guide and the Omnirise community."
              width={1024}
              height={1024}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-border bg-secondary/50">
        <div className="container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-center text-sm text-muted-foreground">
          {trustItems.map((item, i) => (
            <span key={item} className="flex items-center gap-6">
              {i > 0 && (
                <span className="hidden text-border sm:inline" aria-hidden="true">
                  ·
                </span>
              )}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
