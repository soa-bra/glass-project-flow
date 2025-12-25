/**
 * ToolbarButton - زر الشريط مع Tooltip
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ToolbarButtonProps } from "../types";

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  onClick,
  title,
  isActive = false,
  variant = "default",
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseClass =
    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative";

  const variantClasses = {
    default: isActive 
      ? "bg-[hsl(var(--ink))] text-white" 
      : "text-[hsl(var(--ink))] hover:bg-[hsl(var(--ink)/0.1)]",
    destructive: "text-[hsl(var(--ink))] hover:text-[#E5564D] hover:bg-red-50",
    ai: "bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white hover:opacity-90",
  };

  const renderIcon = () => {
    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="h-4 w-4" />;
    }
    return icon;
  };

  return (
    <div
      className="relative pointer-events-auto"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(baseClass, variantClasses[variant])}
        disabled={disabled}
      >
        {renderIcon()}
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[var(--z-tooltip)] pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolbarButton;
