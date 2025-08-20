// Smart Elements System - Main Export
export { SmartElementsRegistry, smartElementsRegistry } from './smart-elements-registry';
export { registerBuiltInSmartElements } from './built-in-elements';
export { registerAdvancedSmartElements } from './advanced-elements';
export { SmartElementCanvasIntegration } from './canvas-integration';

export type {
  SmartElementDefinition,
  RenderContext,
  SmartElementBehaviors
} from './smart-elements-registry';

// Initialize all elements when module is imported
import { registerBuiltInSmartElements } from './built-in-elements';
import { registerAdvancedSmartElements } from './advanced-elements';

// Auto-register all smart elements
registerBuiltInSmartElements();
registerAdvancedSmartElements();

console.log('🧠 Smart Elements System initialized with advanced elements');