// components/academy/ui/section-heading.tsx
import type { ReactNode } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Signature element: eyebrows read like a typed search query — mono type with a
// search glyph — tying every section back to what Google Ads actually is.
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-[var(--omni-line)] bg-[var(--omni-surface)] px-3 py-1.5 font-mono text-[11px] font-medium tracking-tight text-[var(--omni-ink-soft)]",
        className,
      )}
    >
      <Search className="h-3.5 w-3.5 text-[var(--omni-brand)]" aria-hidden />
      {children}
    </span>
  )
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[var(--omni-pop)] px-3 py-1 text-xs font-semibold text-[#1a1300]",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "font-display text-3xl font-extrabold tracking-tight text-[var(--omni-ink)] sm:text-4xl",
          eyebrow && "mt-4",
        )}
      >
        {title}
      </h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-[var(--omni-ink-soft)]">{description}</p> : null}
    </div>
  )
}
