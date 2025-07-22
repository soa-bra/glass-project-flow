
/**
 * @fileoverview Canvas Board exports - main module exports
 * @author AI Assistant
 * @version 1.0.0
 */

// Main Canvas Board Component
export { default as CanvasBoard } from './CanvasBoard';

// Canvas Components
export { Canvas } from './components/Canvas/Canvas';
export { CanvasErrorBoundary } from './components/CanvasErrorBoundary';
export { ToolSelector } from './components/ToolSelector';
export { PanelToggleControls } from './components/PanelToggleControls';

// Panels
export * from './panels';

// Toolbars
export { default as TopToolbar } from './toolbars/TopToolbar';

// Tools
export * from './tools';

// Hooks
export * from './hooks';

// Utilities
export * from './utils/layerUtils';

// Data
export * from './data/mockData';

// Types
export * from './types';
