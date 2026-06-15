// components/academy/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--omni-brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--omni-brand)] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(0,87,231,0.6)]",
        accent:
          "bg-[var(--omni-pop)] text-[#1a1300] shadow-sm hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(255,167,0,0.6)]",
        outline:
          "border border-[var(--omni-line)] bg-white text-[var(--omni-ink)] hover:border-[var(--omni-brand)]/40 hover:bg-[var(--omni-surface)]",
        ghost: "text-[var(--omni-ink-soft)] hover:bg-[var(--omni-surface)] hover:text-[var(--omni-ink)]",
        link: "rounded-none px-0 text-[var(--omni-brand)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  },
)
Button.displayName = "Button"

export { buttonVariants }
