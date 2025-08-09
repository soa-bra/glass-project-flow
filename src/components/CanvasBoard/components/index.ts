export { default as DefaultView } from './DefaultView';
export { default as MainToolbar } from './MainToolbar';
export { CollabBar } from '../collaboration/CollabBar';

export { default as Inspector } from './Inspector';
export { Canvas } from './Canvas/Canvas';
export { CanvasWrapper } from './CanvasWrapper';
export { CanvasPanelLayout } from './CanvasPanelLayout';
export { CleanCanvasPanelLayout } from './CleanCanvasPanelLayout';
export { useCanvasUIActions } from './CanvasEventHandlers';

// Refactored Canvas components
export { CanvasGrid } from './CanvasGrid';
export { ElementRenderer } from './ElementRenderer';
export { ElementResizeHandles } from './ElementResizeHandles';
export { CanvasDrawingPreview } from './Canvas/CanvasDrawingPreview';
export { CanvasElement } from './Canvas/CanvasElement';
export { CanvasStatusBar } from './CanvasStatusBar';

// Refactored Panel Layout components
export { CanvasTopSection } from './CanvasTopSection';
export { CanvasCollaborationSection } from './CanvasCollaborationSection';
export { CanvasInspectorSection } from './CanvasInspectorSection';
export { CanvasAISection } from './CanvasAISection';
// Removed unused CanvasToolsSection
export { CanvasBottomSection } from './CanvasBottomSection';
export { FloatingPanelLayout } from './FloatingPanelLayout';

// Types
export type { CanvasPanelLayoutProps, Layer } from './CanvasPanelTypes';