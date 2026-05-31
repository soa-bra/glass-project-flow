/**
 * Canvas Store Helpers - دوال مساعدة مشتركة بين الـ slices
 */

import type { ArrowConnection } from '@/types/arrow-connections';

/**
 * حساب موقع نقطة الارتكاز على عنصر
 */
export const getAnchorPositionForElement = (
  element: { position: { x: number; y: number }; size: { width: number; height: number } },
  anchor: ArrowConnection['anchorPoint']
): { x: number; y: number } => {
  const { x, y } = element.position;
  const { width, height } = element.size;
  
  switch (anchor) {
    case 'center':
      return { x: x + width / 2, y: y + height / 2 };
    case 'top':
      return { x: x + width / 2, y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'top-left':
      return { x, y };
    case 'top-right':
      return { x: x + width, y };
    case 'bottom-left':
      return { x, y: y + height };
    case 'bottom-right':
      return { x: x + width, y: y + height };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
};

/**
 * نسخ عميق لـ arrowData مع segments و controlPoints
 */
export const deepCloneArrowData = (arrowData: any): any => {
  return {
    ...arrowData,
    segments:
      arrowData.segments?.map((s: any) => ({
        ...s,
        startPoint: { ...s.startPoint },
        endPoint: { ...s.endPoint }
      })) || [],
    controlPoints:
      arrowData.controlPoints?.map((cp: any) => ({
        ...cp,
        position: { ...cp.position }
      })) || []
  };
};

/**
 * تحريك نقطة نهاية مع الضلع كاملاً للحفاظ على الزوايا القائمة
 */
export const moveEndpointWithSegment = (
  data: any,
  endpoint: 'start' | 'end',
  newPosition: { x: number; y: number }
): any => {
  const newData = deepCloneArrowData(data);
  const isStraight = newData.arrowType === 'straight' || newData.segments.length <= 1;

  if (isStraight) {
    if (endpoint === 'start') {
      newData.startPoint = newPosition;
      if (newData.segments.length > 0) {
        newData.segments[0] = { ...newData.segments[0], startPoint: { ...newPosition } };
      }
    } else {
      newData.endPoint = newPosition;
      if (newData.segments.length > 0) {
        const lastIdx = newData.segments.length - 1;
        newData.segments[lastIdx] = { ...newData.segments[lastIdx], endPoint: { ...newPosition } };
      }
    }
  } else {
    if (endpoint === 'start') {
      const oldStartPoint = data.startPoint;
      newData.startPoint = newPosition;

      const deltaX = newPosition.x - oldStartPoint.x;
      const deltaY = newPosition.y - oldStartPoint.y;

      const firstSegment = data.segments[0];
      const dx = Math.abs(firstSegment.endPoint.x - firstSegment.startPoint.x);
      const dy = Math.abs(firstSegment.endPoint.y - firstSegment.startPoint.y);
      const isFirstVertical = dy >= dx;

      if (isFirstVertical) {
        newData.segments[0] = {
          ...firstSegment,
          startPoint: { ...newPosition },
          endPoint: {
            x: firstSegment.endPoint.x + deltaX,
            y: firstSegment.endPoint.y
          }
        };
      } else {
        newData.segments[0] = {
          ...firstSegment,
          startPoint: { ...newPosition },
          endPoint: {
            x: firstSegment.endPoint.x,
            y: firstSegment.endPoint.y + deltaY
          }
        };
      }

      if (data.segments.length > 1) {
        newData.segments[1] = {
          ...newData.segments[1],
          startPoint: { ...newData.segments[0].endPoint }
        };
      }
    } else {
      const oldEndPoint = data.endPoint;
      newData.endPoint = newPosition;

      const deltaX = newPosition.x - oldEndPoint.x;
      const deltaY = newPosition.y - oldEndPoint.y;

      const lastIdx = data.segments.length - 1;
      const lastSegment = data.segments[lastIdx];
      const dx = Math.abs(lastSegment.endPoint.x - lastSegment.startPoint.x);
      const dy = Math.abs(lastSegment.endPoint.y - lastSegment.startPoint.y);
      const isLastVertical = dy >= dx;

      if (isLastVertical) {
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: {
            x: lastSegment.startPoint.x + deltaX,
            y: lastSegment.startPoint.y
          },
          endPoint: { ...newPosition }
        };
      } else {
        newData.segments[lastIdx] = {
          ...lastSegment,
          startPoint: {
            x: lastSegment.startPoint.x,
            y: lastSegment.startPoint.y + deltaY
          },
          endPoint: { ...newPosition }
        };
      }

      if (data.segments.length > 1) {
        newData.segments[lastIdx - 1] = {
          ...newData.segments[lastIdx - 1],
          endPoint: { ...newData.segments[lastIdx].startPoint }
        };
      }
    }
  }

  // تحديث نقاط التحكم
  newData.controlPoints = (newData.controlPoints || []).map((cp: any, idx: number) => {
    if (cp.type === 'midpoint' && cp.segmentId) {
      const segment = newData.segments.find((s: any) => s.id === cp.segmentId);
      if (segment) {
        return {
          ...cp,
          position: {
            x: (segment.startPoint.x + segment.endPoint.x) / 2,
            y: (segment.startPoint.y + segment.endPoint.y) / 2
          }
        };
      }
    }

    if (cp.type === 'endpoint') {
      if (idx === 0) {
        return { ...cp, position: { ...newData.startPoint } };
      }
      if (idx === newData.controlPoints.length - 1) {
        return { ...cp, position: { ...newData.endPoint } };
      }
    }

    return cp;
  });

  return newData;
};

/**
 * حساب حدود مجموعة من العناصر
 */
export const calculateElementsBounds = (elements: Array<{ position: { x: number; y: number }; size: { width: number; height: number } }>) => {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }

  const bounds = elements.reduce((acc, el) => ({
    minX: Math.min(acc.minX, el.position.x),
    minY: Math.min(acc.minY, el.position.y),
    maxX: Math.max(acc.maxX, el.position.x + el.size.width),
    maxY: Math.max(acc.maxY, el.position.y + el.size.height)
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

  return {
    ...bounds,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    centerX: bounds.minX + (bounds.maxX - bounds.minX) / 2,
    centerY: bounds.minY + (bounds.maxY - bounds.minY) / 2
  };
};
