/**
 * @deprecated هذا المسار قديم، استخدم @/features/planning/ui/panels بدلاً منه
 * Re-exports for backward compatibility
 */

export { 
  ElementPropertiesPanel,
  FileUploadPanel,
  FramePanel,
  SelectionPanel,
  ShapesPanel,
  SmartElementsPanel,
  SmartPenPanel,
  TextPanel
} from '@/features/planning/ui/panels';

// Default exports for compatibility
export { default as FileUploadPanelDefault } from '@/features/planning/ui/panels/FileUploadPanel';
export { default as FramePanelDefault } from '@/features/planning/ui/panels/FramePanel';
export { default as SelectionPanelDefault } from '@/features/planning/ui/panels/SelectionPanel';
export { default as ShapesPanelDefault } from '@/features/planning/ui/panels/ShapesPanel';
export { default as SmartElementsPanelDefault } from '@/features/planning/ui/panels/SmartElementsPanel';
export { default as SmartPenPanelDefault } from '@/features/planning/ui/panels/SmartPenPanel';
export { default as TextPanelDefault } from '@/features/planning/ui/panels/TextPanel';
