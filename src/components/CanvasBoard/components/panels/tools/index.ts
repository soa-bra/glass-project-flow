// Tool Panel Components Index
// This file exports all the tool-specific panel components for easy import

export { SelectionToolPanel } from './SelectionToolPanel';
export { SmartPenToolPanel } from './SmartPenToolPanel';
export { ZoomToolPanel } from './ZoomToolPanel';
export { HandToolPanel } from './HandToolPanel';
export { UploadToolPanel } from './UploadToolPanel';
export { InteractiveCommentsToolPanel } from './InteractiveCommentsToolPanel';
export { TextToolPanel } from './TextToolPanel';
export { ShapesToolPanel } from './ShapesToolPanel';
export { SmartElementsToolPanel } from './SmartElementsToolPanel';

// Mapping of tool IDs to their corresponding panel names
export const TOOL_PANEL_MAPPING = {
  'select': 'SelectionToolPanel',
  'smart-pen': 'SmartPenToolPanel',
  'zoom': 'ZoomToolPanel',
  'hand': 'HandToolPanel',
  'upload': 'UploadToolPanel',
  'comment': 'InteractiveCommentsToolPanel',
  'text': 'TextToolPanel',
  'shape': 'ShapesToolPanel',
  'smart-element': 'SmartElementsToolPanel',
} as const;

// Tool panel names in Arabic for UI display
export const TOOL_PANEL_NAMES = {
  'select': 'أداة التحديد',
  'smart-pen': 'القلم الذكي',
  'zoom': 'أداة الزوم', 
  'hand': 'أداة الكف',
  'upload': 'رفع المرفقات',
  'comment': 'التعليقات التفاعلية',
  'text': 'أداة النص',
  'shape': 'أداة الأشكال',
  'smart-element': 'العناصر الذكية',
} as const;