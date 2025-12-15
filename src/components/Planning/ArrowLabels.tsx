import React from 'react';
import type { ArrowData, ArrowControlPoint } from '@/types/arrow-connections';

interface ArrowLabelsProps {
  arrowData: ArrowData;
}

/**
 * مكون لعرض النصوص على نقاط المنتصف للأسهم
 * يُعرض دائماً حتى بعد إلغاء تحديد السهم
 */
export const ArrowLabels: React.FC<ArrowLabelsProps> = ({ arrowData }) => {
  if (!arrowData?.controlPoints) return null;
  
  // جمع النقاط التي تحتوي على نصوص
  const labelsToRender = arrowData.controlPoints
    .filter((cp: ArrowControlPoint & { label?: string }) => 
      cp.type === 'midpoint' && cp.label && cp.label.trim() !== ''
    )
    .map((cp: ArrowControlPoint & { label?: string }) => ({
      id: cp.id,
      position: cp.position,
      label: cp.label!
    }));
  
  if (labelsToRender.length === 0) return null;
  
  return (
    <>
      {labelsToRender.map(({ id, position, label }) => (
        <div
          key={id}
          className="absolute pointer-events-none"
          style={{
            left: position.x,
            top: position.y - 24,
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          <span
            style={{
              backgroundColor: 'transparent',
              color: '#000000',
              fontFamily: 'IBM Plex Sans Arabic, sans-serif',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              direction: 'rtl'
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </>
  );
};

export default ArrowLabels;
