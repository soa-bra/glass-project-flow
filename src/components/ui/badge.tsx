import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--ds-radius-chip)] px-2.5 py-0.5 text-[12px] font-[var(--ds-font-weight-medium)] transition-[var(--ds-transition-smooth)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ds-color-ink))] focus:ring-offset-2 font-arabic",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--ds-color-ink))] text-[hsl(var(--ds-color-white))]",
        secondary:
          "border-transparent bg-[hsl(var(--ds-color-panel))] text-[hsl(var(--ds-color-ink))]",
        destructive:
          "border-transparent bg-[hsl(var(--ds-color-accent-red))] text-[hsl(var(--ds-color-white))]",
        outline:
          "border border-[hsl(var(--ds-color-border))] text-[hsl(var(--ds-color-ink))] bg-transparent",
        success:
          "border-transparent bg-[hsl(var(--ds-color-accent-green))] text-[hsl(var(--ds-color-white))]",
        warning:
          "border-transparent bg-[hsl(var(--ds-color-accent-yellow))] text-[hsl(var(--ds-color-ink))]",
        info:
          "border-transparent bg-[hsl(var(--ds-color-accent-blue))] text-[hsl(var(--ds-color-white))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }