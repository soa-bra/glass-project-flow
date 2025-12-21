/**
 * Canvas Store - التوافق الخلفي
 * يُعاد تصدير كل شيء من البنية الجديدة
 */

// إعادة تصدير كل شيء من البنية الجديدة
export * from './canvas';
export { useCanvasStore } from './canvas';

// تصدير الأنواع للتوافقية
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
