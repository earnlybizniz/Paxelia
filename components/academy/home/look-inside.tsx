// components/academy/home/look-inside.tsx
import { Container } from "@/components/academy/container"
import { Reveal } from "@/components/academy/ui/reveal"
import { SectionHeading } from "@/components/academy/ui/section-heading"
import { BookPreview, CommunityPreview } from "@/components/academy/home/previews"

export function LookInside() {
  return (
    <section id="inside" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="look inside"
            title="See exactly what you're getting."
            description="No mystery box. A real look at the ebook and the community before you decide."
          />
        </Reveal>
        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-[var(--omni-line)] bg-[var(--omni-surface)] p-8">
              <div className="flex flex-1 items-center justify-center">
                <BookPreview />
              </div>
              <p className="mt-6 text-center text-sm text-[var(--omni-ink-soft)]">
                The ebook — a method, a worked example, and a this-week action in every chapter.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-[var(--omni-line)] bg-[var(--omni-surface)] p-8">
              <div className="flex flex-1 items-center">
                <CommunityPreview />
              </div>
              <p className="mt-6 text-center text-sm text-[var(--omni-ink-soft)]">
                Inside the community — a weekly action, policy updates, and the template vault.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
