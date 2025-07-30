// Enhanced Panel Components (Primary)
export { default as EnhancedLayersPanel } from './EnhancedLayersPanel';
export { default as EnhancedCollaborationPanel } from './EnhancedCollaborationPanel';
export { default as AppearancePanel } from './AppearancePanel';
export { ElementStylePanel } from './ElementStylePanel';
export { ToolCustomizationPanel } from './ToolCustomizationPanel';

// Legacy Panel Components (Deprecated - use enhanced versions)
export { AIAssistantPanel } from './AIAssistantPanel';
export { LayersPanel } from './LayersPanel';
export { CollaborationPanel } from './CollaborationPanel';

// Enhanced Tool Panel Components (Phase 2)
export { 
  EnhancedFileUploadPanel,
  EnhancedSmartElementsPanel,
  EnhancedSelectionPanel,
  EnhancedTextPanel,
  EnhancedShapesPanel,
  EnhancedCommentPanel
} from './tools';

// Tool-specific Panel Components (Legacy - kept for compatibility)
export { SelectionToolPanel } from './tools/SelectionToolPanel';
export { SmartPenToolPanel } from './tools/SmartPenToolPanel';
export { ZoomToolPanel } from './tools/ZoomToolPanel';
export { HandToolPanel } from './tools/HandToolPanel';
export { UploadToolPanel } from './tools/UploadToolPanel';
export { InteractiveCommentsToolPanel } from './tools/InteractiveCommentsToolPanel';
export { TextToolPanel } from './tools/TextToolPanel';
export { ShapesToolPanel } from './tools/ShapesToolPanel';
export { SmartElementsToolPanel } from './tools/SmartElementsToolPanel';