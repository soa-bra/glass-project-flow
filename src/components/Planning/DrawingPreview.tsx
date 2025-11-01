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

      case 'frame':
        return (
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.style?.backgroundColor || '#d9e7ed',
              opacity: element.style?.opacity || 0.3,
              border: element.style?.border || '2px dashed hsl(var(--accent-blue))',
              borderRadius: element.style?.borderRadius || 8,
              pointerEvents: 'none',
              position: 'relative'
            }}
          >
            {/* عنوان الإطار */}
            {(element as any).title && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 rounded text-[11px] font-medium text-[hsl(var(--ink))]">
                {(element as any).title}
              </div>
            )}
            
            {/* أيقونة الإطار */}
            <div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--ink-30))] text-[11px]">
              إطار جديد
            </div>
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
