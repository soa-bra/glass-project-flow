/**
 * AnchorHandles - نقاط الربط المرئية
 * Sprint 3: Connector Tool 2.0
 */

import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnchorPoint, AnchorPosition } from '@/core/connectors/anchors';

// =============================================================================
// Types
// =============================================================================

export interface AnchorHandlesProps {
  anchors: AnchorPoint[];
  visible: boolean;
  activeAnchor?: AnchorPosition;
  highlightedAnchor?: AnchorPosition;
  size?: number;
  color?: string;
  onAnchorHover?: (anchor: AnchorPoint | null) => void;
  onAnchorClick?: (anchor: AnchorPoint) => void;
  onDragStart?: (anchor: AnchorPoint, event: React.MouseEvent) => void;
}

// =============================================================================
// Single Anchor Handle
// =============================================================================

interface AnchorHandleProps {
  anchor: AnchorPoint;
  size: number;
  color: string;
  isActive: boolean;
  isHighlighted: boolean;
  onHover: (anchor: AnchorPoint | null) => void;
  onClick: (anchor: AnchorPoint) => void;
  onDragStart: (anchor: AnchorPoint, event: React.MouseEvent) => void;
}

const AnchorHandle: React.FC<AnchorHandleProps> = memo(({
  anchor,
  size,
  color,
  isActive,
  isHighlighted,
  onHover,
  onClick,
  onDragStart
}) => {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDragStart(anchor, e);
  }, [anchor, onDragStart]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(anchor);
  }, [anchor, onClick]);

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isHighlighted ? 1.3 : 1, 
        opacity: 1 
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{ cursor: 'crosshair' }}
      onMouseEnter={() => onHover(anchor)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* الحلقة الخارجية */}
      <circle
        cx={anchor.point.x}
        cy={anchor.point.y}
        r={size + 4}
        fill="transparent"
        className="pointer-events-auto"
      />

      {/* الحلقة الوسطى (glow) */}
      {(isActive || isHighlighted) && (
        <motion.circle
          cx={anchor.point.x}
          cy={anchor.point.y}
          r={size + 2}
          fill={color}
          opacity={0.3}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
        />
      )}

      {/* النقطة الرئيسية */}
      <circle
        cx={anchor.point.x}
        cy={anchor.point.y}
        r={size}
        fill={isActive ? color : 'white'}
        stroke={color}
        strokeWidth={2}
        className="transition-colors duration-150"
      />

      {/* النقطة الداخلية */}
      {isHighlighted && (
        <circle
          cx={anchor.point.x}
          cy={anchor.point.y}
          r={size / 2}
          fill={color}
        />
      )}
    </motion.g>
  );
});

AnchorHandle.displayName = 'AnchorHandle';

// =============================================================================
// Anchor Handles Component
// =============================================================================

export const AnchorHandles: React.FC<AnchorHandlesProps> = memo(({
  anchors,
  visible,
  activeAnchor,
  highlightedAnchor,
  size = 6,
  color = 'hsl(var(--accent-blue))',
  onAnchorHover,
  onAnchorClick,
  onDragStart
}) => {
  const handleHover = useCallback((anchor: AnchorPoint | null) => {
    onAnchorHover?.(anchor);
  }, [onAnchorHover]);

  const handleClick = useCallback((anchor: AnchorPoint) => {
    onAnchorClick?.(anchor);
  }, [onAnchorClick]);

  const handleDragStart = useCallback((anchor: AnchorPoint, event: React.MouseEvent) => {
    onDragStart?.(anchor, event);
  }, [onDragStart]);

  return (
    <AnimatePresence>
      {visible && (
        <g className="anchor-handles">
          {anchors.map(anchor => (
            <AnchorHandle
              key={anchor.id}
              anchor={anchor}
              size={size}
              color={color}
              isActive={activeAnchor === anchor.position}
              isHighlighted={highlightedAnchor === anchor.position}
              onHover={handleHover}
              onClick={handleClick}
              onDragStart={handleDragStart}
            />
          ))}
        </g>
      )}
    </AnimatePresence>
  );
});

AnchorHandles.displayName = 'AnchorHandles';
