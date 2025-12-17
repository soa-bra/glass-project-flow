import { useMemo } from 'react';
import { useCanvasStore, type LineStyle, type PenStroke } from '@/stores/canvasStore';

export default function StrokesLayer() {
  const { strokes } = useCanvasStore();
  
  const getStrokeDashArray = (style: LineStyle, width: number) => {
    switch (style) {
      case 'dashed': 
        return `${width * 3} ${width * 2}`;
      case 'dotted': 
        return `${width} ${width}`;
      case 'double': 
        return undefined; // معالجة خاصة
      default: 
        return undefined;
    }
  };
  
  const renderStroke = (stroke: PenStroke) => {
    if (stroke.points.length < 2) return null;
    
    const pathData = stroke.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
    
    // نمط الخط المزدوج - رسم خطين متداخلين
    if (stroke.style === 'double') {
      return (
        <g key={stroke.id}>
          {/* الخط الخارجي */}
          <path 
            d={pathData} 
            stroke={stroke.color} 
            strokeWidth={stroke.width * 1.5} 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* الخط الداخلي (أبيض) */}
          <path 
            d={pathData} 
            stroke="#FFFFFF" 
            strokeWidth={stroke.width * 0.5} 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    }
    
    // الأنماط الأخرى (solid/dashed/dotted)
    return (
      <path
        key={stroke.id}
        d={pathData}
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeDasharray={getStrokeDashArray(stroke.style, stroke.width)}
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
