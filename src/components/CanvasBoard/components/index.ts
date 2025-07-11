export { default as DefaultView } from './DefaultView';
export { default as MainToolbar } from './NewMainToolbar';
export { default as CollabBar } from './CollabBar';

export { default as Inspector } from './Inspector';
export { default as Canvas } from './Canvas';
export { CanvasWrapper } from './CanvasWrapper';
export { CanvasPanelLayout } from './CanvasPanelLayout';
export { CleanCanvasPanelLayout } from './CleanCanvasPanelLayout';
export { useCanvasEventHandlers } from './CanvasEventHandlers';

// Refactored Canvas components
export { CanvasGrid } from './CanvasGrid';
export { ElementRenderer } from './ElementRenderer';
export { ElementResizeHandles } from './ElementResizeHandles';
export { CanvasDrawingPreview } from './CanvasDrawingPreview';
export { CanvasElement } from './CanvasElement';
export { CanvasStatusBar } from './CanvasStatusBar';

// Refactored Panel Layout components
export { CanvasTopSection } from './CanvasTopSection';
export { CanvasCollaborationSection } from './CanvasCollaborationSection';
export { CanvasInspectorSection } from './CanvasInspectorSection';
export { CanvasAISection } from './CanvasAISection';
export { CanvasToolsSection } from './CanvasToolsSection';
export { CanvasBottomSection } from './CanvasBottomSection';
export { FloatingPanelLayout } from './FloatingPanelLayout';

// Types
export type { CanvasPanelLayoutProps, Layer } from './CanvasPanelTypes';