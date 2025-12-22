// Unified Utils Export
// Phase 4: Index Files Organization

// Canvas Utils
export { toNumber, toString, sanitizeStyleForCSS } from './canvasUtils';
export { colorToClassName, generateColorClass, createStyleObject } from './colorMapper';
export * from './toolPanelHelpers';

// Arrow Routing System
export * from './arrow-routing';

// Type Utilities
export { cn } from '../lib/utils';

// Type Utilities
export type { CanvasElement, ElementStyle } from '../types/canvas';
export type { 
  EnhancedStylePreset as StylePreset, 
  EnhancedTextStyle as TextStyle, 
  EnhancedBorderStyle as BorderStyle,
  EnhancedPoint as Point,
  EnhancedSelectedElement as SelectedElement 
} from '../types/enhanced-canvas';
