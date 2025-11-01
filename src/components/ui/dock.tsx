"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  }[]
}

export default function Dock({ items, className }: DockProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "flex items-end gap-4 px-4 py-3 rounded-full",
          "border border-[hsl(var(--border))] bg-background/70 backdrop-blur-2xl shadow-lg"
        )}
        style={{
          transform: "perspective(600px) rotateX(10deg)",
        }}
      >
        <TooltipProvider delayDuration={100}>
          {items.map((item, i) => {
            const isActive = item.isActive
            const isHovered = hovered === i

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? -5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative flex flex-col items-center"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-full relative",
                        "transition-colors",
                        isHovered && !isActive && "bg-[hsl(var(--ink-30))]",
                        isActive && "bg-[hsl(var(--ink))]"
                      )}
                      onClick={() => {
                        item.onClick?.()
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 transition-colors",
                          isActive ? "text-white" : "text-[hsl(var(--ink-60))]"
                        )}
                      />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs bg-[hsl(var(--ink))] text-white border-[hsl(var(--ink))]">
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
