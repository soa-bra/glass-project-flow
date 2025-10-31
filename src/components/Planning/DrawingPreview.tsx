import React from 'react';
import type { CanvasElement } from '@/types/canvas';

interface DrawingPreviewProps {
  element: CanvasElement | null;
}

/**
 * مكون معاينة الرسم المؤقت
 * يعرض العنصر الذي يتم رسمه حالياً قبل تثبيته
 */
const DrawingPreview: React.FC<DrawingPreviewProps> = ({ element }) => {
  if (!element) return null;

  const renderPreviewContent = () => {
    switch (element.type) {
      case 'shape':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.style?.backgroundColor || '#f28e2a',
              border: `${(element as any).strokeWidth || 1}px solid ${(element as any).strokeColor || '#000'}`,
              borderRadius: element.style?.borderRadius || 8,
              opacity: 0.7,
              pointerEvents: 'none'
            }}
          />
        );

      case 'text':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: element.style?.fontSize || 16,
              color: element.style?.color || '#111827',
              fontFamily: element.style?.fontFamily,
              fontWeight: element.style?.fontWeight,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px dashed #3DBE8B',
              borderRadius: 8,
              padding: 8,
              opacity: 0.8,
              pointerEvents: 'none'
            }}
          >
            {element.content || 'اكتب هنا...'}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      data-drawing-preview
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      {renderPreviewContent()}
    </div>
  );
};

export default DrawingPreview;
