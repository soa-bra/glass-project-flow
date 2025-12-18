/**
 * SnapGuides - مكون عرض خطوط المحاذاة الذكية
 * 
 * يعرض خطوط الإرشاد عند تحريك العناصر للمحاذاة
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel } from '@/core/canvasKernel';
import type { SnapLine } from '@/core/snapEngine';

interface SnapGuidesProps {
  guides: SnapLine[];
  containerRef: React.RefObject<HTMLElement>;
}

export const SnapGuides: React.FC<SnapGuidesProps> = ({ guides, containerRef }) => {
  const viewport = useCanvasStore(state => state.viewport);

  if (guides.length === 0) return null;

  const containerRect = containerRef.current?.getBoundingClientRect();
  if (!containerRect) return null;

  const renderGuide = (guide: SnapLine, index: number) => {
    // تحويل إحداثيات World Space إلى Screen Space
    const startScreen = canvasKernel.worldToScreen(
      guide.start.x,
      guide.start.y,
      viewport,
      containerRect
    );
    const endScreen = canvasKernel.worldToScreen(
      guide.end.x,
      guide.end.y,
      viewport,
      containerRect
    );

    // اختيار اللون حسب نوع المحاذاة
    const getGuideColor = () => {
      switch (guide.snapType) {
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

    const color = getGuideColor();

    if (guide.type === 'vertical') {
      return (
        <line
          key={`guide-${index}`}
          x1={startScreen.x}
          y1={startScreen.y}
          x2={endScreen.x}
          y2={endScreen.y}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="4 2"
          style={{ pointerEvents: 'none' }}
        />
      );
    } else {
      return (
        <line
          key={`guide-${index}`}
          x1={startScreen.x}
          y1={startScreen.y}
          x2={endScreen.x}
          y2={endScreen.y}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="4 2"
          style={{ pointerEvents: 'none' }}
        />
      );
    }
  };

  // عرض نقاط التقاطع
  const renderSnapPoints = () => {
    const points: { x: number; y: number; color: string }[] = [];

    guides.forEach(guide => {
      if (guide.type === 'vertical') {
        const screen = canvasKernel.worldToScreen(
          guide.position,
          (guide.start.y + guide.end.y) / 2,
          viewport,
          containerRect
        );
        points.push({ ...screen, color: guide.snapType === 'center' ? '#3DA8F5' : '#3DBE8B' });
      } else {
        const screen = canvasKernel.worldToScreen(
          (guide.start.x + guide.end.x) / 2,
          guide.position,
          viewport,
          containerRect
        );
        points.push({ ...screen, color: guide.snapType === 'center' ? '#3DA8F5' : '#3DBE8B' });
      }
    });

    return points.map((point, index) => (
      <circle
        key={`snap-point-${index}`}
        cx={point.x}
        cy={point.y}
        r={4}
        fill={point.color}
        style={{ pointerEvents: 'none' }}
      />
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
      {guides.map(renderGuide)}
      {renderSnapPoints()}
    </svg>,
    document.body
  );
};

export default SnapGuides;
