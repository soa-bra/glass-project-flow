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
                  <button
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      item.onClick?.()
                    }}
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.2s ease-out, background-color 0.2s'
                    }}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                      isActive && "bg-[hsl(var(--ink))]",
                      isHovered && !isActive && "bg-[hsl(var(--ink-30))]",
                      !isActive && !isHovered && "bg-transparent"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isActive ? "text-white" : "text-[hsl(var(--ink-60))]"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={8}
                  className="text-xs bg-[hsl(var(--ink))] text-white border-none rounded-[10px] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
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
