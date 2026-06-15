// components/academy/home/hero.tsx
"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ShieldCheck, Search } from "lucide-react"
import { Button } from "@/components/academy/ui/button"
import { Container } from "@/components/academy/container"
import { CommunityPreview } from "@/components/academy/home/previews"

const TRUST = ["30-day money-back", "Cancel anytime", "Instant access", "Secure via Whop", "Not affiliated with Google"]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -3])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,87,231,0.16),transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(255,167,0,0.12),transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,14,26,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,14,26,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <Container className="relative pb-10 pt-20 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.5, 0.26, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--omni-line)] bg-white/70 px-3 py-1.5 font-mono text-xs font-medium text-[var(--omni-ink-soft)] backdrop-blur">
            <Search className="h-3.5 w-3.5 text-[var(--omni-brand)]" aria-hidden />
            mastering google ads
            <span className="omni-caret">▍</span>
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--omni-ink)] sm:text-6xl">
            Run Google Ads with{" "}
            <span className="bg-[linear-gradient(120deg,var(--omni-brand),var(--omni-brand-2))] bg-clip-text text-transparent">
              intention
            </span>
            <br className="hidden sm:block" /> — not guesswork.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--omni-ink-soft)]">
            One membership: the full ebook plus a private community that keeps you current as Google changes. Everyone
            gets everything.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <Link href="/pricing">
                Get access <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#inside">See what&apos;s inside</Link>
            </Button>
          </div>
          <ul className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--omni-ink-soft)]">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--omni-brand)]" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div style={{ y, scale, rotate, opacity }} className="relative mx-auto mt-14 max-w-3xl [perspective:1200px]">
          <CommunityPreview />
        </motion.div>
      </Container>
    </section>
  )
}
