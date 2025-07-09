// Core canvas components
export { default as Canvas } from './Canvas';
export { CanvasWrapper } from './CanvasWrapper';
export { default as DefaultView } from './DefaultView';

// Element rendering
export { ElementRenderer } from './ElementRenderer';
export { ElementResizeHandles } from './ElementResizeHandles';

// Layout sections  
export { CanvasTopSection } from './CanvasTopSection';
export { CanvasCollaborationSection } from './CanvasCollaborationSection';
export { CanvasInspectorSection } from './CanvasInspectorSection';
export { CanvasAISection } from './CanvasAISection';
export { CanvasToolsSection } from './CanvasToolsSection';
export { CanvasBottomSection } from './CanvasBottomSection';

// Layouts
export { CanvasPanelLayout } from './CanvasPanelLayout';
export { CleanCanvasPanelLayout } from './CleanCanvasPanelLayout';

// Event handlers
export { useCanvasEventHandlers } from './CanvasEventHandlers';

// Toolbars
export { default as NewTopToolbar } from './NewTopToolbar';
export { default as NewMainToolbar } from './NewMainToolbar';

// Types
export type { CanvasPanelLayoutProps } from './CanvasPanelTypes';
export type { Layer } from '../hooks/useCanvasLayerState';