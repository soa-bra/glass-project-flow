// Smart Elements System - Main Export
export { SmartElementsRegistry, smartElementsRegistry } from './smart-elements-registry';
export { registerBuiltInSmartElements } from './built-in-elements';
export { SmartElementCanvasIntegration } from './canvas-integration';

export type {
  SmartElementDefinition,
  RenderContext,
  SmartElementBehaviors
} from './smart-elements-registry';

// Initialize built-in elements when module is imported
import { registerBuiltInSmartElements } from './built-in-elements';

// Auto-register built-in elements
registerBuiltInSmartElements();

console.log('🧠 Smart Elements System initialized');