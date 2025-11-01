import React from 'react';

interface SelectionBoxProps {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * مكون لعرض صندوق التحديد المتعدد عند السحب على الكانفاس
 */
export default function SelectionBox({ startX, startY, currentX, currentY }: SelectionBoxProps) {
  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  
  return (
    <div
      className="absolute pointer-events-none border border-[hsl(var(--ink),0.25)] bg-[hsl(var(--ink),0.03)] rounded"
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
