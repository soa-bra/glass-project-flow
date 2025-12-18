import React from 'react';
import { createBezierPath } from '@/types/mindmap-canvas';

interface MindMapConnectionLineProps {
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  startAnchor: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
}

/**
 * خط التوصيل المؤقت أثناء السحب
 */
const MindMapConnectionLine: React.FC<MindMapConnectionLineProps> = ({
  startPosition,
  endPosition,
  startAnchor,
  color = '#3DA8F5'
}) => {
  // حساب حدود SVG
  const padding = 50;
  const minX = Math.min(startPosition.x, endPosition.x) - padding;
  const minY = Math.min(startPosition.y, endPosition.y) - padding;
  const maxX = Math.max(startPosition.x, endPosition.x) + padding;
  const maxY = Math.max(startPosition.y, endPosition.y) + padding;
  
  // تحديد نقطة الربط المفترضة للنهاية بناءً على الاتجاه
  const dx = endPosition.x - startPosition.x;
  const dy = endPosition.y - startPosition.y;
  let endAnchor: 'top' | 'bottom' | 'left' | 'right' = 'left';
  
  if (Math.abs(dx) > Math.abs(dy)) {
    endAnchor = dx > 0 ? 'left' : 'right';
  } else {
    endAnchor = dy > 0 ? 'top' : 'bottom';
  }
  
  const path = createBezierPath(startPosition, endPosition, startAnchor, endAnchor);
  
  return (
    <svg
      className="fixed pointer-events-none"
      style={{
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        overflow: 'visible',
        zIndex: 1000
      }}
    >
      {/* خط منقط أثناء السحب */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="8 4"
        strokeLinecap="round"
        className="animate-pulse"
        style={{
          transform: `translate(${-minX}px, ${-minY}px)`
        }}
      />
      
      {/* نقطة النهاية */}
      <circle
        cx={endPosition.x - minX}
        cy={endPosition.y - minY}
        r={6}
        fill={color}
        className="animate-pulse"
      />
    </svg>
  );
};

export default MindMapConnectionLine;
