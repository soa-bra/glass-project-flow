/**
 * SnapGuides - مكون عرض خطوط المحاذاة الذكية
 * 
 * يعرض خطوط الإرشاد عند تحريك العناصر للمحاذاة
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import type { SnapLine } from '@/engine/canvas/interaction/snapEngine';

interface SnapGuidesProps {
  guides: SnapLine[];
  containerRef: React.RefObject<HTMLElement>;
}

export const SnapGuides: React.FC<SnapGuidesProps> = ({ guides, containerRef }) => {
  const viewport = useCanvasStore(state => state.viewport);

  if (guides.length === 0) return null;

  const containerRect = containerRef.current?.getBoundingClientRect();
  if (!containerRect) return null;

  // اختيار اللون حسب نوع المحاذاة
  const getGuideColor = (snapType: string) => {
    switch (snapType) {
      case 'center':
        return '#3DA8F5'; // أزرق للمركز
      case 'edge':
        return '#3DBE8B'; // أخضر للحواف
      case 'distribution':
        return '#F6C445'; // أصفر للتوزيع
      case 'grid':
        return '#E5564D'; // أحمر للشبكة
      default:
        return '#3DBE8B';
    }
  };

  const renderGuide = (guide: SnapLine, index: number) => {
    // تحويل إحداثيات World Space إلى Screen Space
    // نمرر null بدلاً من containerRect لأن الـ SVG موقعه محدد مسبقاً
    const startScreen = canvasKernel.worldToScreen(
      guide.start.x,
      guide.start.y,
      viewport,
      null
    );
    const endScreen = canvasKernel.worldToScreen(
      guide.end.x,
      guide.end.y,
      viewport,
      null
    );

    const color = getGuideColor(guide.snapType);

    return (
      <g key={`guide-${index}`}>
        {/* خط التوهج (Glow) */}
        <line
          x1={startScreen.x}
          y1={startScreen.y}
          x2={endScreen.x}
          y2={endScreen.y}
          stroke={color}
          strokeWidth={4}
          strokeOpacity={0.3}
          strokeLinecap="round"
          style={{ pointerEvents: 'none' }}
        />
        {/* الخط الرئيسي */}
        <line
          x1={startScreen.x}
          y1={startScreen.y}
          x2={endScreen.x}
          y2={endScreen.y}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="6 3"
          strokeLinecap="round"
          style={{ pointerEvents: 'none' }}
        />
      </g>
    );
  };

  // عرض نقاط المحاذاة مع تأثير نبضي
  const renderSnapPoints = () => {
    const points: { x: number; y: number; color: string }[] = [];

    guides.forEach(guide => {
      const color = getGuideColor(guide.snapType);
      
      if (guide.type === 'vertical') {
        const screen = canvasKernel.worldToScreen(
          guide.position,
          (guide.start.y + guide.end.y) / 2,
          viewport,
          null
        );
        points.push({ ...screen, color });
      } else {
        const screen = canvasKernel.worldToScreen(
          (guide.start.x + guide.end.x) / 2,
          guide.position,
          viewport,
          null
        );
        points.push({ ...screen, color });
      }
    });

    return points.map((point, index) => (
      <g key={`snap-point-${index}`}>
        {/* حلقة خارجية نبضية */}
        <circle
          cx={point.x}
          cy={point.y}
          r={8}
          fill="none"
          stroke={point.color}
          strokeWidth={1.5}
          strokeOpacity={0.5}
          style={{ 
            pointerEvents: 'none',
            animation: 'snap-pulse 0.8s ease-out infinite'
          }}
        />
        {/* النقطة الداخلية */}
        <circle
          cx={point.x}
          cy={point.y}
          r={4}
          fill={point.color}
          style={{ pointerEvents: 'none' }}
        />
        {/* النقطة المركزية البيضاء */}
        <circle
          cx={point.x}
          cy={point.y}
          r={1.5}
          fill="white"
          style={{ pointerEvents: 'none' }}
        />
      </g>
    ));
  };

  return createPortal(
    <svg
      style={{
        position: 'fixed',
        top: containerRect.top,
        left: containerRect.left,
        width: containerRect.width,
        height: containerRect.height,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'visible'
      }}
    >
      <defs>
        <style>
          {`
            @keyframes snap-pulse {
              0% {
                r: 4;
                opacity: 1;
              }
              100% {
                r: 12;
                opacity: 0;
              }
            }
          `}
        </style>
      </defs>
      {guides.map(renderGuide)}
      {renderSnapPoints()}
    </svg>,
    document.body
  );
};

export default SnapGuides;
