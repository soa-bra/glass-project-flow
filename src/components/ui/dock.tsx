"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
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
        {items.map((item, i) => {
          const isActive = item.isActive
          const isHovered = hovered === i

          return (
            <button
              key={item.label}
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
          )
        })}
      </motion.div>
    </div>
  )
}
