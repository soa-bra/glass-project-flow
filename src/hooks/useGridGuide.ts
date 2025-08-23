import { useState, useEffect, useMemo } from 'react';

interface UseGridGuideProps {
  enabled: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
  gridSize?: number;
  snapThreshold?: number;
}

interface GridLine {
  position: number;
  type: 'major' | 'minor';
  orientation: 'horizontal' | 'vertical';
}

export function useGridGuide({
  enabled,
  canvasRef,
  gridSize = 20,
  snapThreshold = 10
}: UseGridGuideProps) {
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [showGuides, setShowGuides] = useState(enabled);

  // تحديث أبعاد الكانفس
  useEffect(() => {
    if (!canvasRef.current) return;

    const updateDimensions = () => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setCanvasDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [canvasRef]);

  // تحديث حالة الإظهار
  useEffect(() => {
    setShowGuides(enabled);
  }, [enabled]);

  // حساب خطوط الشبكة
  const gridLines = useMemo(() => {
    if (!showGuides || !canvasDimensions.width || !canvasDimensions.height) {
      return [];
    }

    const lines: Array<React.CSSProperties> = [];
    
    // الخطوط العمودية
    for (let x = 0; x <= canvasDimensions.width; x += gridSize) {
      const isMajor = x % (gridSize * 5) === 0;
      lines.push({
        position: 'absolute',
        left: `${x}px`,
        top: 0,
        width: '1px',
        height: '100%',
        backgroundColor: isMajor ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        pointerEvents: 'none'
      });
    }

    // الخطوط الأفقية
    for (let y = 0; y <= canvasDimensions.height; y += gridSize) {
      const isMajor = y % (gridSize * 5) === 0;
      lines.push({
        position: 'absolute',
        left: 0,
        top: `${y}px`,
        width: '100%',
        height: '1px',
        backgroundColor: isMajor ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        pointerEvents: 'none'
      });
    }

    return lines;
  }, [showGuides, canvasDimensions, gridSize]);

  // دالة السناب إلى الشبكة
  const snapToGrid = (x: number, y: number) => {
    if (!enabled) return { x, y };

    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;

    // التحقق من عتبة السناب
    const deltaX = Math.abs(x - snappedX);
    const deltaY = Math.abs(y - snappedY);

    return {
      x: deltaX <= snapThreshold ? snappedX : x,
      y: deltaY <= snapThreshold ? snappedY : y
    };
  };

  // دالة للحصول على أقرب نقطة شبكة
  const getNearestGridPoint = (x: number, y: number) => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };

  // دالة للتحقق من القرب من خطوط الشبكة
  const isNearGridLine = (x: number, y: number) => {
    const nearestX = Math.round(x / gridSize) * gridSize;
    const nearestY = Math.round(y / gridSize) * gridSize;
    
    const deltaX = Math.abs(x - nearestX);
    const deltaY = Math.abs(y - nearestY);
    
    return deltaX <= snapThreshold || deltaY <= snapThreshold;
  };

  return {
    gridLines,
    showGuides,
    snapToGrid,
    getNearestGridPoint,
    isNearGridLine,
    gridSize,
    toggleGuides: () => setShowGuides(!showGuides)
  };
}