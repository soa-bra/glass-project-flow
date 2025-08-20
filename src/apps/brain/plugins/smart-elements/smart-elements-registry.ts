import { ReactNode } from 'react';
import { CanvasNode } from '../../../../lib/canvas/types';

// Smart Element Definition
export interface SmartElementDefinition {
  type: string;
  name: string;
  icon: ReactNode;
  category: 'basic' | 'project' | 'data' | 'social' | 'finance' | 'analytics';
  defaultState: Partial<CanvasNode>;
  settingsSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  renderer: (node: CanvasNode, context: RenderContext) => ReactNode;
  behaviors?: SmartElementBehaviors;
}

export interface RenderContext {
  isSelected: boolean;
  isHovered: boolean;
  zoom: number;
  isEditing: boolean;
}

export interface SmartElementBehaviors {
  onDoubleClick?: (node: CanvasNode) => void;
  onContextMenu?: (node: CanvasNode, event: MouseEvent) => void;
  onResize?: (node: CanvasNode, newSize: { width: number; height: number }) => CanvasNode;
  onUpdate?: (node: CanvasNode, updates: Partial<CanvasNode>) => CanvasNode;
}

// Registry Class
export class SmartElementsRegistry {
  private static instance: SmartElementsRegistry;
  private elements: Map<string, SmartElementDefinition> = new Map();

  static getInstance(): SmartElementsRegistry {
    if (!SmartElementsRegistry.instance) {
      SmartElementsRegistry.instance = new SmartElementsRegistry();
    }
    return SmartElementsRegistry.instance;
  }

  registerSmartElement(definition: SmartElementDefinition): void {
    if (this.elements.has(definition.type)) {
      console.warn(`Smart element type '${definition.type}' is already registered. Overwriting.`);
    }
    
    // Validate schema
    if (!this.validateSchema(definition.settingsSchema)) {
      throw new Error(`Invalid settings schema for smart element '${definition.type}'`);
    }

    this.elements.set(definition.type, definition);
    console.log(`Registered smart element: ${definition.type}`);
  }

  getSmartElement(type: string): SmartElementDefinition | undefined {
    return this.elements.get(type);
  }

  getAllSmartElements(): SmartElementDefinition[] {
    return Array.from(this.elements.values());
  }

  getSmartElementsByCategory(category: SmartElementDefinition['category']): SmartElementDefinition[] {
    return Array.from(this.elements.values()).filter(el => el.category === category);
  }

  createSmartElementNode(type: string, position: { x: number; y: number }, customState?: any): CanvasNode | null {
    const definition = this.getSmartElement(type);
    if (!definition) {
      console.error(`Smart element type '${type}' not found`);
      return null;
    }

    // Create base node from default state
    const node: CanvasNode = {
      ...definition.defaultState,
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      transform: {
        position,
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      size: definition.defaultState.size || { width: 200, height: 150 },
      style: definition.defaultState.style || {},
      metadata: {
        ...definition.defaultState.metadata,
        smartElementType: type,
        createdAt: Date.now(),
        ...customState
      }
    } as CanvasNode;

    return node;
  }

  updateSmartElementSettings(node: CanvasNode, newSettings: Record<string, any>): CanvasNode {
    const definition = this.getSmartElement(node.metadata?.smartElementType);
    if (!definition) {
      return node;
    }

    // Validate settings against schema
    const isValid = this.validateSettings(newSettings, definition.settingsSchema);
    if (!isValid) {
      console.warn('Invalid settings provided for smart element');
      return node;
    }

    // Apply behaviors if defined
    if (definition.behaviors?.onUpdate) {
      return definition.behaviors.onUpdate(node, { 
        metadata: { ...node.metadata, ...newSettings } 
      });
    }

    return {
      ...node,
      metadata: {
        ...node.metadata,
        ...newSettings,
        lastModified: Date.now()
      }
    };
  }

  private validateSchema(schema: any): boolean {
    return (
      schema &&
      typeof schema === 'object' &&
      schema.type === 'object' &&
      schema.properties &&
      typeof schema.properties === 'object'
    );
  }

  private validateSettings(settings: Record<string, any>, schema: any): boolean {
    // Basic validation - can be enhanced with proper JSON Schema validator
    if (!schema.properties) return true;
    
    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in settings)) {
          return false;
        }
      }
    }

    return true;
  }
}

// Export singleton instance
export const smartElementsRegistry = SmartElementsRegistry.getInstance();