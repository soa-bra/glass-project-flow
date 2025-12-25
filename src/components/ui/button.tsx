import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--ds-radius-chip)] text-[14px] font-[var(--ds-font-weight-medium)] transition-[var(--ds-transition-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ds-color-ink))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 font-arabic",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--ds-color-ink))] text-[hsl(var(--ds-color-white))] hover:bg-[hsl(var(--ds-color-ink-80))]",
        destructive:
          "bg-[hsl(var(--ds-color-accent-red))] text-[hsl(var(--ds-color-white))] hover:bg-[hsl(var(--ds-color-accent-red))]/90",
        outline:
          "border border-[hsl(var(--ds-color-border))] bg-transparent text-[hsl(var(--ds-color-ink))] hover:bg-[hsl(var(--ds-color-panel))]",
        secondary:
          "bg-[hsl(var(--ds-color-panel))] text-[hsl(var(--ds-color-ink))] hover:bg-[hsl(var(--ds-color-panel))]/80",
        ghost: "text-[hsl(var(--ds-color-ink))] hover:bg-[hsl(var(--ds-color-panel))]",
        link: "text-[hsl(var(--ds-color-accent-blue))] underline-offset-4 hover:underline",
        success: "bg-[hsl(var(--ds-color-accent-green))] text-[hsl(var(--ds-color-white))] hover:bg-[hsl(var(--ds-color-accent-green))]/90",
        warning: "bg-[hsl(var(--ds-color-accent-yellow))] text-[hsl(var(--ds-color-ink))] hover:bg-[hsl(var(--ds-color-accent-yellow))]/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[var(--ds-radius-chip)] px-3",
        lg: "h-11 rounded-[var(--ds-radius-chip)] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }