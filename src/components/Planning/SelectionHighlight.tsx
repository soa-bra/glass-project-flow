/**
 * SelectionHighlight - تأثيرات بصرية للعناصر المحددة
 * يوفر animations سلسة عند التحديد/إلغاء التحديد
 */

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/stores/canvasStore';

interface SelectionHighlightProps {
  elementId: string;
  isSelected: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export const SelectionHighlight = memo(function SelectionHighlight({
  elementId,
  isSelected,
  bounds,
  viewport,
}: SelectionHighlightProps) {
  // تحويل الإحداثيات للشاشة
  const screenBounds = useMemo(() => ({
    x: (bounds.x - viewport.x) * viewport.zoom,
    y: (bounds.y - viewport.y) * viewport.zoom,
    width: bounds.width * viewport.zoom,
    height: bounds.height * viewport.zoom,
  }), [bounds, viewport]);

  const padding = 4;

  return (
    <AnimatePresence>
      {isSelected && (
        <motion.div
          key={`highlight-${elementId}`}
          className="pointer-events-none absolute"
          style={{
            left: screenBounds.x - padding,
            top: screenBounds.y - padding,
            width: screenBounds.width + padding * 2,
            height: screenBounds.height + padding * 2,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            duration: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* الحدود المتحركة */}
          <motion.div
            className="absolute inset-0 rounded-sm border-2 border-accent-blue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
          
          {/* توهج خفيف */}
          <motion.div
            className="absolute inset-0 rounded-sm"
            style={{
              boxShadow: '0 0 0 1px rgba(61, 168, 245, 0.3), 0 0 12px rgba(61, 168, 245, 0.15)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          />

          {/* نقاط التحكم في الزوايا */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, index) => (
            <motion.div
              key={corner}
              className="absolute h-2 w-2 rounded-full border-2 border-accent-blue bg-white"
              style={{
                ...(corner.includes('top') ? { top: -4 } : { bottom: -4 }),
                ...(corner.includes('left') ? { left: -4 } : { right: -4 }),
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.15,
                delay: 0.03 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}

          {/* نقاط التحكم في المنتصف */}
          {['top', 'bottom', 'left', 'right'].map((side, index) => (
            <motion.div
              key={side}
              className="absolute h-1.5 w-1.5 rounded-full border border-accent-blue bg-white"
              style={{
                ...(side === 'top' && { top: -3, left: '50%', transform: 'translateX(-50%)' }),
                ...(side === 'bottom' && { bottom: -3, left: '50%', transform: 'translateX(-50%)' }),
                ...(side === 'left' && { left: -3, top: '50%', transform: 'translateY(-50%)' }),
                ...(side === 'right' && { right: -3, top: '50%', transform: 'translateY(-50%)' }),
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.12,
                delay: 0.08 + 0.02 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/**
 * Multi-Selection Highlight - تأثير للتحديد المتعدد
 */
interface MultiSelectionHighlightProps {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  count: number;
}

export const MultiSelectionHighlight = memo(function MultiSelectionHighlight({
  bounds,
  viewport,
  count,
}: MultiSelectionHighlightProps) {
  const screenBounds = useMemo(() => ({
    x: (bounds.x - viewport.x) * viewport.zoom,
    y: (bounds.y - viewport.y) * viewport.zoom,
    width: bounds.width * viewport.zoom,
    height: bounds.height * viewport.zoom,
  }), [bounds, viewport]);

  const padding = 8;

  if (count < 2) return null;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: screenBounds.x - padding,
        top: screenBounds.y - padding,
        width: screenBounds.width + padding * 2,
        height: screenBounds.height + padding * 2,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* حدود متقطعة للتحديد المتعدد */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ overflow: 'visible' }}
      >
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="hsl(var(--accent-blue))"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          rx="4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
});
