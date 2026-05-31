/**
 * ElementLockIndicator Component - Sprint 8
 * مؤشر قفل العنصر عند تحريره من مستخدم آخر
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface ElementLockIndicatorProps {
  lockedBy: string;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  viewport: {
    zoom: number;
    pan: { x: number; y: number };
  };
}

export const ElementLockIndicator: React.FC<ElementLockIndicatorProps> = ({
  lockedBy,
  color,
  position,
  size,
  viewport,
}) => {
  // تحويل الإحداثيات
  const screenX = position.x * viewport.zoom + viewport.pan.x;
  const screenY = position.y * viewport.zoom + viewport.pan.y;
  const screenWidth = size.width * viewport.zoom;
  const screenHeight = size.height * viewport.zoom;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute"
      style={{
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
        zIndex: 1000,
      }}
    >
      {/* إطار القفل */}
      <div
        className="absolute inset-0 rounded-lg border-2 border-dashed"
        style={{ borderColor: color }}
      />

      {/* شارة القفل */}
      <div
        className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        <Lock className="h-3 w-3" />
        <span className="max-w-20 truncate">{lockedBy}</span>
      </div>

      {/* تأثير الخلفية */}
      <div
        className="absolute inset-0 rounded-lg opacity-10"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};
