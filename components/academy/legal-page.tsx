// components/academy/legal-page.tsx
import type { ReactNode } from "react"
import { Container } from "@/components/academy/container"

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <section className="py-20 sm:py-28">
      <Container size="narrow">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--omni-brand)]">Legal</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--omni-ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--omni-ink-soft)]">Last updated {updated}</p>
        <div className="mt-10 [&_a]:text-[var(--omni-brand)] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--omni-ink)] [&_li]:mb-1.5 [&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-[var(--omni-ink-soft)] [&_strong]:text-[var(--omni-ink)] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:text-[var(--omni-ink-soft)]">
          {children}
        </div>
      </Container>
    </section>
  )
}
