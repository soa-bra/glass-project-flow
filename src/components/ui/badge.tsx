
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-none px-2.5 py-0.5 text-xs font-medium text-black transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#bdeed3] text-black",
        secondary:
          "bg-[#a4e2f6] text-black",
        destructive:
          "bg-[#f1b5b9] text-black",
        outline: "border border-black bg-transparent text-black",
        success: "bg-[#bdeed3] text-black",
        warning: "bg-[#fbe2aa] text-black",
        purple: "bg-[#d9d2fd] text-black",
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
