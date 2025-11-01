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
  // تحويل نقطة من إحداثيات الكانفاس إلى إحداثيات الشاشة
  const toScreen = (p: PenPoint) => ({
    x: p.x * viewport.zoom + viewport.pan.x,
    y: p.y * viewport.zoom + viewport.pan.y
  });
  
  // تحويل مسار إلى SVG path
  const pointsToPath = (points: PenPoint[]): string => {
    if (points.length === 0) return '';
    
    const screenPoints = points.map(toScreen);
    const commands = screenPoints.map((p, i) => 
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
        const scaledWidth = stroke.width * viewport.zoom;
        
        return (
          <g key={stroke.id}>
            {/* خط مزدوج: رسم خط عريض خلفي أولاً */}
            {stroke.style === 'double' && (
              <path
                d={d}
                stroke={stroke.color}
                strokeWidth={scaledWidth * 1.8}
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
              strokeWidth={scaledWidth}
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
