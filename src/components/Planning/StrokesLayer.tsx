import { useMemo } from 'react';
import { useCanvasStore, type PenStrokeStyle, type PenStroke } from '@/stores/canvasStore';

export default function StrokesLayer() {
  const { strokes } = useCanvasStore();
  
  const getStrokeDashArray = (style: PenStrokeStyle, width: number) => {
    switch (style) {
      case 'dashed': 
        return `${width * 3} ${width * 2}`;
      case 'dotted': 
        return `${width} ${width}`;
      default: 
        return undefined;
    }
  };
  
  const renderStroke = (stroke: PenStroke) => {
    if (stroke.points.length < 2) return null;
    
    const pathData = stroke.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
    
    return (
      <path
        key={stroke.id}
        d={pathData}
        stroke={stroke.strokeColor}
        strokeWidth={stroke.strokeWidth}
        strokeDasharray={getStrokeDashArray(stroke.strokeStyle, stroke.strokeWidth)}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };
  
  // تحسين الأداء: فقط إعادة الرسم عند تغيير المسارات
  const strokeElements = useMemo(
    () => Object.values(strokes).map(renderStroke),
    [strokes]
  );
  
  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'visible'
      }}
    >
      {strokeElements}
    </svg>
  );
}
