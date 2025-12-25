import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--ds-radius-panel)] border border-[hsl(var(--ds-color-border))] bg-[hsl(var(--ds-color-card-main))] px-3 py-2 text-sm text-[hsl(var(--ds-color-ink))] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--ds-color-ink-30))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ds-color-ink))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 font-arabic",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }