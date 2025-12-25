import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--ds-radius-chip)] text-[14px] font-[var(--ds-font-weight-medium)] text-[hsl(var(--ds-color-ink))] ring-offset-[hsl(var(--ds-color-card-main))] transition-[var(--ds-transition-smooth)] hover:bg-[hsl(var(--ds-color-panel))] hover:text-[hsl(var(--ds-color-ink-80))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ds-color-ink))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[hsl(var(--ds-color-accent-green)/.15)] data-[state=on]:text-[hsl(var(--ds-color-accent-green))]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-[hsl(var(--ds-color-border))] bg-transparent hover:bg-[hsl(var(--ds-color-panel))] hover:text-[hsl(var(--ds-color-ink))]",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
