/**
 * ToolbarShell - الحاوية المشتركة لجميع الأشرطة السياقية
 * يتعامل مع: Portal, Positioning, Animation, Container styling
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useFloatingPosition } from "../hooks/useFloatingPosition";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";

interface ToolbarShellProps {
  children: React.ReactNode;
  activeElements: CanvasElement[];
}

export const ToolbarShell: React.FC<ToolbarShellProps> = ({ children, activeElements }) => {
  const editingTextId = useCanvasStore((s) => s.editingTextId);
  const viewport = useCanvasStore((s) => s.viewport);

  const position = useFloatingPosition({
    activeElements,
    editingTextId,
    viewport,
    hasSelection: activeElements.length > 0 || !!editingTextId,
  });

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed flex items-center gap-1 px-2 py-1.5 rounded-xl border border-[hsl(var(--ds-color-border))] bg-[hsl(var(--ds-color-card-main))] shadow-[var(--shadow-glass)] pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          zIndex: "var(--z-toolbar)",
          transform: "translateX(-50%)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ToolbarShell;
