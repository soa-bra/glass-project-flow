
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[180px] w-full font-arabic outline-none",
          "rounded-[var(--sb-field-radius-lg)]",
          "border border-[color:var(--sb-field-border)] bg-[color:var(--sb-field-bg)]",
          "px-[var(--sb-field-padding-x)] py-3",
          "text-[length:var(--sb-field-font-size)] text-[color:var(--sb-field-text)]",
          "placeholder:text-[color:var(--sb-field-placeholder)] placeholder:font-normal",
          "transition-[color,background-color,border-color,box-shadow] duration-200 ease-sb-out",
          "focus-visible:border-[color:var(--sb-field-border-focus)] focus-visible:shadow-[var(--sb-field-focus-ring)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )}
)
Textarea.displayName = "Textarea"

export { Textarea }
