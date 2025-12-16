import React, { memo } from 'react';
import { CanvasElement as CanvasElementType } from '@/types/canvas';

interface PureCanvasBoardProps {
  elements: CanvasElementType[];
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  gridSize: number;
  children?: React.ReactNode;
}

/**
 * مكون الكانفاس النقي - يعرض العناصر فقط بدون منطق التفاعل
 * يستخدم memo لتحسين الأداء وتجنب إعادة الرسم غير الضرورية
 */
const PureCanvasBoard = memo(function PureCanvasBoard({
  elements,
  zoom,
  pan,
  gridEnabled,
  gridSize,
  children
}: PureCanvasBoardProps) {
  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0'
  };

  const gridStyle = gridEnabled ? {
    backgroundImage: `
      linear-gradient(to right, hsl(var(--border)/0.3) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--border)/0.3) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
    backgroundPosition: `${pan.x}px ${pan.y}px`
  } : {};

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={gridStyle}
    >
      <div 
        className="absolute"
        style={transformStyle}
      >
        {children}
      </div>
    </div>
  );
});

export default PureCanvasBoard;
