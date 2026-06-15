// components/academy/home/why.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"

export function Why() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 px-8 py-16 text-center sm:px-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.4),transparent)] blur-2xl"
            />
            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#8fb4ff]">
                why wylorise
              </span>
              <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                A clear system, taught in the open.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-300">
                Most Google Ads education sells hype or one guru&apos;s highlight reel. We do the opposite: a current
                system, no income promises, nothing hidden. We&apos;re independent — not affiliated with Google — and
                we&apos;d rather earn your renewal than oversell the join.
              </p>
              <Link
                href="/about"
                className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8fb4ff] hover:text-white"
              >
                More about Wylorise <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
