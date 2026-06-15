// components/academy/home/final-cta.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { Button } from "@/components/academy/ui/button"

export function FinalCta() {
  return (
    <section className="pb-24 pt-4">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--omni-line)] bg-white px-8 py-16 text-center sm:px-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.18),transparent)] blur-2xl"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--omni-ink)] sm:text-4xl">
                Run Google Ads with intention.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[var(--omni-ink-soft)]">
                Get the ebook, the community, and a system that keeps you current — in one membership.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" variant="primary">
                  <Link href="/pricing">
                    Get access <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-[var(--omni-ink-soft)]">
                Educational only. No income or results guarantees. Independent and not affiliated with, endorsed by, or
                sponsored by Google.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
