/**
 * Text Elements - Barrel Export
 * @module features/planning/elements/text
 */

// المكونات الأساسية - Core Components
export { TextEditor } from './TextEditor';
export { TextRenderer } from './TextRenderer';
export { StickyNoteEditor } from './StickyNoteEditor';
export { TextLayer } from './TextLayer';

// كائن النص - Text Element Class
export { TextElement, DEFAULT_TEXT_ELEMENT } from './TextElement';
export type { TextElementData, TextType, TextAlign, TextDirection, VerticalAlign } from './TextElement';

// Hooks
export { useTextCreation, useTextDrag, useTextResize } from './hooks';
export type { ResizeHandle } from './hooks';

// Utils
export * from './utils';
