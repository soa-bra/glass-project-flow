export { default as DefaultView } from './DefaultView';
export { default as MainToolbar } from './MainToolbar';
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
// Removed unused CanvasToolsSection
export { CanvasBottomSection } from './CanvasBottomSection';
export { FloatingPanelLayout } from './FloatingPanelLayout';

// Enhanced Components
export { TopFloatingPanel } from './TopFloatingPanel';
export { EnhancedCanvas } from './EnhancedCanvas';
export { MiniMap } from './MiniMap';
export { SimpleCollaborativeWhiteboard } from './SimpleCollaborativeWhiteboard';

// Types
export type { CanvasPanelLayoutProps, Layer } from './CanvasPanelTypes';