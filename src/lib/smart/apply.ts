// تطبيق التحويلات الذكية على المسارات

import type { PenStroke } from './recognize';
import type { SmartKind } from './recognize';
import { classifyStroke, strokeIntersectsBBox } from './recognize';
import type { CanvasElement } from '@/types/canvas';

export interface SmartTransformResult {
  action: 'create_shape' | 'create_connector' | 'create_frame' | 'delete_elements' | 'none';
  elements?: Partial<CanvasElement>[];
  deleteIds?: string[];
}

/**
 * إنشاء شكل من مسار
 */
function createShapeFromStroke(
  shapeType: 'ellipse' | 'rect',
  stroke: PenStroke
): Partial<CanvasElement> {
  const bbox = stroke.bbox!;
  
  return {
    type: 'shape',
    position: { x: bbox.x, y: bbox.y },
    size: { width: bbox.w, height: bbox.h },
    style: {
      fill: 'transparent',
      stroke: stroke.color,
      strokeWidth: stroke.width,
      shapeType: shapeType
    },
    metadata: {
      createdBy: 'smart_pen',
      originalStroke: stroke.id
    }
  };
}

/**
 * إنشاء سهم من مسار
 */
function createArrowFromStroke(stroke: PenStroke): Partial<CanvasElement> {
  const first = stroke.points[0];
  const last = stroke.points[stroke.points.length - 1];
  
  return {
    type: 'arrow',
    position: { x: first.x, y: first.y },
    size: {
      width: Math.abs(last.x - first.x),
      height: Math.abs(last.y - first.y)
    },
    style: {
      stroke: stroke.color,
      strokeWidth: stroke.width,
      arrowhead: 'end'
    },
    data: {
      startX: first.x,
      startY: first.y,
      endX: last.x,
      endY: last.y
    },
    metadata: {
      createdBy: 'smart_pen',
      originalStroke: stroke.id
    }
  };
}

/**
 * إنشاء موصل بين عنصرين
 */
function createConnector(
  element1: CanvasElement,
  element2: CanvasElement,
  stroke: PenStroke
): Partial<CanvasElement> {
  return {
    type: 'connector',
    position: { 
      x: element1.position.x + element1.size.width / 2,
      y: element1.position.y + element1.size.height / 2
    },
    size: { width: 100, height: 2 },
    style: {
      stroke: stroke.color,
      strokeWidth: stroke.width,
      strokeStyle: stroke.style
    },
    data: {
      sourceId: element1.id,
      targetId: element2.id
    },
    metadata: {
      createdBy: 'smart_pen',
      originalStroke: stroke.id
    }
  };
}

/**
 * إنشاء إطار يحتوي عناصر متعددة
 */
function createFrame(
  containedElements: CanvasElement[],
  stroke: PenStroke
): Partial<CanvasElement> {
  const bbox = stroke.bbox!;
  const padding = 20;
  
  return {
    type: 'frame',
    position: { x: bbox.x - padding, y: bbox.y - padding },
    size: { 
      width: bbox.w + padding * 2, 
      height: bbox.h + padding * 2 
    },
    style: {
      backgroundColor: 'rgba(217, 231, 237, 0.3)',
      borderColor: stroke.color,
      borderWidth: stroke.width,
      borderRadius: 12
    },
    data: {
      containedElementIds: containedElements.map(el => el.id)
    },
    metadata: {
      createdBy: 'smart_pen',
      originalStroke: stroke.id,
      title: 'إطار جديد'
    }
  };
}

/**
 * تطبيق التحويل الذكي على المسار
 */
export function applySmart(
  stroke: PenStroke,
  elements: CanvasElement[]
): SmartTransformResult {
  const kind = classifyStroke(stroke);
  
  switch (kind) {
    case 'circle':
      return {
        action: 'create_shape',
        elements: [createShapeFromStroke('ellipse', stroke)]
      };
      
    case 'rect': {
      // فحص إذا كان يحتوي عناصر → frame، وإلا → مستطيل
      const containedElements = elements.filter(el => 
        strokeIntersectsBBox(stroke, {
          x: el.position.x,
          y: el.position.y,
          w: el.size.width,
          h: el.size.height
        })
      );
      
      if (containedElements.length > 1) {
        return {
          action: 'create_frame',
          elements: [createFrame(containedElements, stroke)]
        };
      } else {
        return {
          action: 'create_shape',
          elements: [createShapeFromStroke('rect', stroke)]
        };
      }
    }
      
    case 'arrow': {
      // فحص إذا كان يلامس عنصرين → connector
      const first = stroke.points[0];
      const last = stroke.points[stroke.points.length - 1];
      
      const elementAtStart = elements.find(el =>
        first.x >= el.position.x && 
        first.x <= el.position.x + el.size.width &&
        first.y >= el.position.y && 
        first.y <= el.position.y + el.size.height
      );
      
      const elementAtEnd = elements.find(el =>
        last.x >= el.position.x && 
        last.x <= el.position.x + el.size.width &&
        last.y >= el.position.y && 
        last.y <= el.position.y + el.size.height &&
        el.id !== elementAtStart?.id
      );
      
      if (elementAtStart && elementAtEnd) {
        return {
          action: 'create_connector',
          elements: [createConnector(elementAtStart, elementAtEnd, stroke)]
        };
      }
      
      return {
        action: 'create_shape',
        elements: [createArrowFromStroke(stroke)]
      };
    }
      
    case 'connector': {
      // خط بسيط يلامس عنصرين
      const first = stroke.points[0];
      const last = stroke.points[stroke.points.length - 1];
      
      const elementAtStart = elements.find(el =>
        first.x >= el.position.x - 10 && 
        first.x <= el.position.x + el.size.width + 10 &&
        first.y >= el.position.y - 10 && 
        first.y <= el.position.y + el.size.height + 10
      );
      
      const elementAtEnd = elements.find(el =>
        last.x >= el.position.x - 10 && 
        last.x <= el.position.x + el.size.width + 10 &&
        last.y >= el.position.y - 10 && 
        last.y <= el.position.y + el.size.height + 10 &&
        el.id !== elementAtStart?.id
      );
      
      if (elementAtStart && elementAtEnd) {
        return {
          action: 'create_connector',
          elements: [createConnector(elementAtStart, elementAtEnd, stroke)]
        };
      }
      
      return { action: 'none' };
    }
      
    case 'scribble': {
      // حذف العناصر التي يتقاطع معها المسار
      const elementsToDelete = elements.filter(el => {
        if (el.locked) return false;
        return strokeIntersectsBBox(stroke, {
          x: el.position.x,
          y: el.position.y,
          w: el.size.width,
          h: el.size.height
        });
      });
      
      if (elementsToDelete.length > 0) {
        return {
          action: 'delete_elements',
          deleteIds: elementsToDelete.map(el => el.id)
        };
      }
      
      return { action: 'none' };
    }
      
    default:
      return { action: 'none' };
  }
}
