// طبقة عرض المسارات على الكانفاس

import React from 'react';
import type { PenStroke } from '@/lib/smart/recognize';
import type { PenPoint } from '@/lib/geometry/simplify';

interface StrokesLayerProps {
  strokes: PenStroke[];
  viewport: {
    zoom: number;
    pan: { x: number; y: number };
  };
}

const StrokesLayer: React.FC<StrokesLayerProps> = ({ strokes, viewport }) => {
  // تحويل مسار إلى SVG path
  // ملاحظة: لا نحتاج لتحويل الإحداثيات لأن الـ container الأب يقوم بذلك عبر transform
  const pointsToPath = (points: PenPoint[]): string => {
    if (points.length === 0) return '';
    
    const commands = points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    );
    
    return commands.join(' ');
  };
  
  // تحديد نمط الخط (stroke-dasharray)
  const getStrokeDashArray = (style: string): string | undefined => {
    switch (style) {
      case 'dashed':
        return '8 6';
      case 'dotted':
        return '2 6';
      default:
        return undefined;
    }
  };
  
  return (
    <svg 
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        overflow: 'visible'
      }}
    >
      {strokes.map(stroke => {
        const d = pointsToPath(stroke.points);
        const dashArray = getStrokeDashArray(stroke.style);
        // العرض الأصلي بدون ضرب في zoom لأن الـ transform يتولى ذلك
        const strokeWidth = stroke.width;
        
        return (
          <g key={stroke.id}>
            {/* خط مزدوج: رسم خط عريض خلفي أولاً */}
            {stroke.style === 'double' && (
              <path
                d={d}
                stroke={stroke.color}
                strokeWidth={strokeWidth * 1.8}
                fill="none"
                opacity={0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            
            {/* الخط الرئيسي */}
            <path
              d={d}
              stroke={stroke.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={dashArray}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.95}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default StrokesLayer;
