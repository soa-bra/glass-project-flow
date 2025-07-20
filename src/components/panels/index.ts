/**
 * Export all panel components for easy importing
 */

export { SmartAssistantPanel } from './SmartAssistantPanel';
export { LayersPanel } from './LayersPanel';

// Type exports
export type { 
  // SmartAssistantPanel types
  ChatMessage,
  ActionState,
  SmartAssistantPanelProps
} from './SmartAssistantPanel';

export type {
  // LayersPanel types  
  Layer,
  LayersPanelProps
} from './LayersPanel';

// Re-export AI service types for convenience
export type {
  AIAssistRequest,
  AIAssistResponse,
  CanvasState
} from '../../services/aiService';

// Re-export canvas state types
export type {
  CanvasElement,
  CanvasLayer,
  CanvasViewport
} from '../../hooks/useCanvasState';