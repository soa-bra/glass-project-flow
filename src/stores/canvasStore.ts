/**
 * Canvas Store - التوافق الخلفي
 * يُعاد تصدير كل شيء من البنية الجديدة
 */

// إعادة تصدير كل شيء من البنية الجديدة
export * from '@/features/planning/state';

// Backward compatibility aliases
export { usePlanningStore as useCanvasStore } from '@/features/planning/state';
export type { PlanningStore as CanvasStore } from '@/features/planning/state';

// تصدير الأنواع للتوافقية من domain/types
export type { 
  ToolId, 
  ShapeType, 
  LineStyle, 
  PenPoint, 
  PenStroke, 
  PenSettings, 
  FrameElement, 
  TextElement, 
  ToolSettings 
} from '@/features/planning/state/types';

export type { CanvasElement } from '@/types/canvas';
