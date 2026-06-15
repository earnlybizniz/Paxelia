// components/academy/ui/marquee.tsx
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Marquee({
  children,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode
  className?: string
  pauseOnHover?: boolean
}) {
  return (
    <div className={cn("group relative flex w-full overflow-hidden", className)}>
      <div
        className={cn(
          "omni-marquee flex shrink-0 items-center gap-3 pr-3",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "omni-marquee flex shrink-0 items-center gap-3 pr-3",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
    </div>
  )
}
