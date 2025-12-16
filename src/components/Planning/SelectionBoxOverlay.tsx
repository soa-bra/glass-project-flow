import React from 'react';

interface SelectionBoxOverlayProps {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isVisible: boolean;
}

/**
 * مكون لعرض صندوق التحديد المتعدد كطبقة فوق الكانفاس
 */
export default function SelectionBoxOverlay({ 
  startX, 
  startY, 
  currentX, 
  currentY,
  isVisible 
}: SelectionBoxOverlayProps) {
  if (!isVisible) return null;

  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  
  return (
    <div
      className="absolute pointer-events-none border border-[hsl(var(--ink)/0.25)] bg-[hsl(var(--ink)/0.03)] rounded"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 9999
      }}
    />
  );
}
