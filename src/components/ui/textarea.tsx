
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
          "flex min-h-[180px] w-full rounded-[24px] border border-black/20 bg-white px-4 py-3 text-right text-base font-normal text-black font-arabic placeholder:font-normal placeholder:text-[#8A8A8A] transition-colors outline-none ring-0 focus:border-black focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )}
)
Textarea.displayName = "Textarea"

export { Textarea }
