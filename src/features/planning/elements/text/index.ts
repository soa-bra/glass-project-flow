/**
 * Text Elements - Barrel Export
 * @module features/planning/elements/text
 */

// ============================================
// Types - الأنواع الموحدة
// ============================================
export type { 
  TextType, 
  TextAlign, 
  TextDirection, 
  VerticalAlign,
  TextElementStyle,
  TextElementData,
  TextEditorAPI 
} from './types';

export { 
  DEFAULT_TEXT_STYLE, 
  DEFAULT_TEXT_DATA, 
  DEFAULT_TEXT_SIZE 
} from './types';

// ============================================
// Context - سياق المحرر
// ============================================
export { 
  TextEditorProvider,
  useTextEditorContext,
  useActiveTextEditor,
  useTextEditorRegistration
} from './TextEditorContext';

// ============================================
// المكونات الأساسية - Core Components
// ============================================
export { TextEditor } from './TextEditor';
export { TextRenderer } from './TextRenderer';
export { StickyNoteEditor } from './StickyNoteEditor';
export { TextLayer } from './TextLayer';

export { ResizeHandles, calculateResizeDelta } from './ResizeHandles';
export type { HandlePosition } from './ResizeHandles';

// كائن النص - Text Element Class (تصدير باسم مختلف لتجنب التضارب)
export { TextElement as TextElementClass, DEFAULT_TEXT_ELEMENT } from './TextElement';

// Hooks
export { useTextCreation, useTextDrag, useTextResize } from './hooks';
export type { ResizeHandle } from './hooks';

// Utils - Text Metrics
export { 
  measureText, 
  calculateTextWidth, 
  calculateTextHeight,
  calculateLineCount,
  isTextOverflowing,
  getCursorPosition
} from './utils/textMetrics';

// Utils - Hit Testing
export { 
  isPointInBounds,
  hitTestElement,
  findElementAtPoint,
  findAllElementsAtPoint,
  hitTestResizeHandle,
  screenToCanvas,
  canvasToScreen,
  getElementScreenBounds,
  doRectsOverlap,
  getElementsInSelection
} from './utils/hitTesting';
