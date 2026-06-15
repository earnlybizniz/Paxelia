// components/academy/container.tsx
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode
  className?: string
  size?: "default" | "wide" | "narrow"
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  )
}
