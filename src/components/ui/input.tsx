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
          "flex w-full font-arabic outline-none",
          "h-[var(--sb-field-height)] rounded-[var(--sb-field-radius)]",
          "border border-[color:var(--sb-field-border)] bg-[color:var(--sb-field-bg)]",
          "px-[var(--sb-field-padding-x)] py-2",
          "text-[length:var(--sb-field-font-size)] text-[color:var(--sb-field-text)]",
          "placeholder:text-[color:var(--sb-field-placeholder)] placeholder:font-normal",
          "transition-[color,background-color,border-color,box-shadow] duration-200 ease-sb-out",
          "focus-visible:border-[color:var(--sb-field-border-focus)] focus-visible:shadow-[var(--sb-field-focus-ring)]",
          "disabled:cursor-not-allowed disabled:opacity-70",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
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
