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
          "flex h-11 w-full rounded-[18px] border border-sb-border bg-sb-white px-4 py-2 text-sm font-arabic font-normal text-sb-ink placeholder:text-sb-ink/40 transition-all duration-200 ease-sb-out outline-none focus-visible:border-sb-border focus-visible:ring-2 focus-visible:ring-sb-ink focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70 file:border-0 file:bg-transparent file:text-sm file:font-medium",
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
