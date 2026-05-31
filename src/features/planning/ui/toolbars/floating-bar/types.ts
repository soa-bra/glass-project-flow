/**
 * Floating Bar Types
 * أنواع التحديد والمكونات المشتركة
 */

import type { CanvasElement } from '@/types/canvas';
import type { SmartElementType } from '@/types/smart-elements';

// أنواع التحديد المدعومة
export type SelectionType = 
  | "element" 
  | "text" 
  | "image" 
  | "multiple" 
  | "mindmap" 
  | "visual_diagram" 
  | null;

// نوع الشريط المعروض
export type ToolbarMode = 'none' | 'pen' | 'floating';

// حالة التنسيق النشطة
export interface ActiveFormats {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikeThrough?: boolean;
  insertUnorderedList?: boolean;
  insertOrderedList?: boolean;
}

// خصائص زر الشريط
export interface ToolbarButtonProps {
  icon: React.ReactNode | React.ComponentType<{ className?: string }>;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  isActive?: boolean;
  variant?: "default" | "destructive" | "ai";
  disabled?: boolean;
}

// خصائص زر اللون
export interface ColorButtonProps {
  value: string;
  onChange: (color: string) => void;
  icon: React.ReactNode;
  title: string;
}

// خيار التحويل للعناصر الذكية
export interface TransformOption {
  type: SmartElementType;
  label: string;
  icon: React.ComponentType<{ size?: number | string }>;
  description: string;
}

// معلومات عنصر الخريطة الذهنية
export interface MindMapNodeData {
  label?: string;
  color?: string;
  shape?: string;
  [key: string]: any;
}

// إعدادات التخطيط
export interface LayoutSettings {
  orientation: 'horizontal' | 'vertical';
  symmetry: 'symmetric' | 'unilateral';
  direction: 'rtl' | 'ltr';
}

// بيانات التحديد
export interface SelectionMeta {
  selectionType: SelectionType;
  selectedElements: CanvasElement[];
  firstElement: CanvasElement | null;
  selectionCount: number;
  hasSelection: boolean;
  isMindmapSelection: boolean;
  mindmapTreeElements: CanvasElement[];
  mindmapName: string;
  groupId: string | null;
  areElementsGrouped: boolean;
  areElementsLocked: boolean;
  areElementsVisible: boolean;
}
