"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface DockProps {
  className?: string
  items: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick?: () => void
    isActive?: boolean
    disabled?: boolean
    ariaLabel?: string
    ariaKeyshortcuts?: string
  }[]
}

export default function Dock({ items, className }: DockProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <motion.div
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "flex items-end gap-2 px-3 py-2 rounded-full",
          "border border-[hsl(var(--border))] bg-background/70 backdrop-blur-2xl shadow-lg"
        )}
        style={{
          transform: "perspective(600px) rotateX(6deg)",
        }}
      >
        <TooltipProvider delayDuration={100}>
          {items.map((item, i) => {
            const isDisabled = Boolean(item.disabled)
            const isActive = item.isActive && !isDisabled
            const isHovered = hovered === i && !isDisabled

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={item.ariaLabel ?? item.label}
                    aria-keyshortcuts={item.ariaKeyshortcuts}
                    aria-disabled={isDisabled || undefined}
                    disabled={isDisabled}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (isDisabled) return
                      item.onClick?.()
                    }}
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.2s ease-out, background-color 0.2s'
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                      isDisabled && "cursor-not-allowed opacity-45",
                      isActive && "bg-[hsl(var(--ink))]",
                      isHovered && !isActive && "bg-[hsl(var(--ink-30))]",
                      !isActive && !isHovered && "bg-transparent"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isDisabled ? "text-[hsl(var(--ink-30))]" : isActive ? "text-white" : "text-[hsl(var(--ink-60))]"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={12}
                  className="text-xs bg-[hsl(var(--ink))] text-white border-0 rounded-[10px] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.24)] [&>svg]:hidden"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </motion.div>
    </div>
  )
}
