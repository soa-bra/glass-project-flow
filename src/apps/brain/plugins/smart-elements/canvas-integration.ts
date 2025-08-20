// Integration between Smart Elements and Canvas System
import { CanvasState } from '../../../../lib/canvas/canvas-state';
import { InfiniteCanvasEngine } from '../../../../lib/canvas/canvas-engine';
import { smartElementsRegistry } from './smart-elements-registry';
import { CanvasNode } from '../../../../lib/canvas/types';

export class SmartElementCanvasIntegration {
  private canvasState: CanvasState;
  private canvasEngine: InfiniteCanvasEngine;

  constructor(canvasState: CanvasState, canvasEngine: InfiniteCanvasEngine) {
    this.canvasState = canvasState;
    this.canvasEngine = canvasEngine;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Listen to canvas engine events for smart element lifecycle
    this.canvasEngine.on('nodeAdded', (node: CanvasNode) => {
      this.handleSmartElementAdded(node);
    });

    this.canvasEngine.on('nodeUpdated', (node: CanvasNode) => {
      this.handleSmartElementUpdated(node);
    });

    this.canvasEngine.on('nodeRemoved', (nodeId: string) => {
      this.handleSmartElementRemoved(nodeId);
    });
  }

  /**
   * Create and add a smart element to the canvas
   */
  addSmartElement(
    elementType: string,
    position: { x: number; y: number },
    size?: { width: number; height: number },
    customSettings?: Record<string, any>
  ): string | null {
    const node = smartElementsRegistry.createSmartElementNode(
      elementType, 
      position, 
      customSettings
    );
    
    if (!node) {
      console.error('Failed to create smart element node:', elementType);
      return null;
    }

    // Apply custom size if provided
    if (size) {
      node.size = size;
    }

    // Add to canvas
    const nodeId = this.canvasEngine.addNode(node);
    console.log(`Added smart element ${elementType} with ID: ${nodeId}`);
    
    return nodeId;
  }

  /**
   * Update smart element settings
   */
  updateSmartElementSettings(
    nodeId: string,
    newSettings: Record<string, any>
  ): boolean {
    const node = this.canvasEngine.getNode(nodeId);
    if (!node || !node.metadata?.smartElementType) {
      console.error('Node not found or not a smart element:', nodeId);
      return false;
    }

    const updatedNode = smartElementsRegistry.updateSmartElementSettings(
      node,
      newSettings
    );

    this.canvasEngine.updateNode(nodeId, updatedNode);
    return true;
  }

  /**
   * Get smart element settings
   */
  getSmartElementSettings(nodeId: string): Record<string, any> | null {
    const node = this.canvasEngine.getNode(nodeId);
    if (!node || !node.metadata?.smartElementType) {
      return null;
    }

    const { smartElementType, createdAt, lastModified, ...settings } = node.metadata;
    return settings;
  }

  /**
   * Handle smart element behaviors on resize
   */
  handleSmartElementResize(
    nodeId: string, 
    newSize: { width: number; height: number }
  ): void {
    const node = this.canvasEngine.getNode(nodeId);
    if (!node?.metadata?.smartElementType) return;

    const definition = smartElementsRegistry.getSmartElement(
      node.metadata.smartElementType
    );

    if (definition?.behaviors?.onResize) {
      const updatedNode = definition.behaviors.onResize(node, newSize);
      this.canvasEngine.updateNode(nodeId, updatedNode);
    } else {
      // Default resize behavior
      this.canvasEngine.updateNode(nodeId, { size: newSize });
    }
  }

  /**
   * Get all smart elements on the canvas
   */
  getAllSmartElements(): CanvasNode[] {
    return this.canvasEngine.getNodes().filter(node => 
      node.metadata?.smartElementType
    );
  }

  /**
   * Get smart elements by type
   */
  getSmartElementsByType(elementType: string): CanvasNode[] {
    return this.canvasEngine.getNodes().filter(node => 
      node.metadata?.smartElementType === elementType
    );
  }

  private handleSmartElementAdded(node: CanvasNode) {
    if (!node.metadata?.smartElementType) return;
    
    console.log(`Smart element added: ${node.metadata.smartElementType} (${node.id})`);
    
    // Auto-save snapshot after smart element changes
    setTimeout(() => {
      this.canvasState.createSnapshot();
    }, 1000);
  }

  private handleSmartElementUpdated(node: CanvasNode) {
    if (!node.metadata?.smartElementType) return;
    
    console.log(`Smart element updated: ${node.metadata.smartElementType} (${node.id})`);
    
    // Auto-save snapshot after smart element changes
    setTimeout(() => {
      this.canvasState.createSnapshot();
    }, 1000);
  }

  private handleSmartElementRemoved(nodeId: string) {
    console.log(`Smart element removed: ${nodeId}`);
    
    // Auto-save snapshot after smart element changes
    setTimeout(() => {
      this.canvasState.createSnapshot();
    }, 1000);
  }

  /**
   * Export smart elements data for backup/migration
   */
  exportSmartElementsData(): {
    elements: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      settings: Record<string, any>;
      createdAt: number;
      lastModified?: number;
    }>;
    version: string;
    exportedAt: number;
  } {
    const smartElements = this.getAllSmartElements();
    
    return {
      elements: smartElements.map(node => ({
        id: node.id,
        type: node.metadata!.smartElementType,
        position: node.transform.position,
        size: node.size,
        settings: this.getSmartElementSettings(node.id) || {},
        createdAt: node.metadata!.createdAt || Date.now(),
        lastModified: node.metadata!.lastModified
      })),
      version: '1.0.0',
      exportedAt: Date.now()
    };
  }

  /**
   * Import smart elements data from backup/migration
   */
  importSmartElementsData(data: {
    elements: Array<{
      id?: string;
      type: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      settings: Record<string, any>;
    }>;
  }): boolean {
    try {
      data.elements.forEach(elementData => {
        this.addSmartElement(
          elementData.type,
          elementData.position,
          elementData.size,
          elementData.settings
        );
      });
      
      console.log(`Imported ${data.elements.length} smart elements`);
      return true;
    } catch (error) {
      console.error('Failed to import smart elements:', error);
      return false;
    }
  }
}