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
          "flex h-11 w-full rounded-[24px] border border-black/20 bg-white px-4 py-3 text-right text-sm text-black font-arabic placeholder:text-black/50 transition-colors outline-none ring-0 focus:border-black focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70 file:border-0 file:bg-transparent file:text-sm file:font-medium",
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
