import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--ds-radius-sm)] bg-[hsl(var(--ds-color-ink-30)/.15)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
