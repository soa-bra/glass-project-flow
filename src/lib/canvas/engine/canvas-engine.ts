import { CanvasNode, CanvasState, Camera, Point, Bounds, CanvasAPI, CanvasSnapshot } from '../types';
import { CameraController } from '../controllers/camera-controller';
import { SnapManager } from '../controllers/snap-manager';
import { SceneGraph } from '../utils/scene-graph';
import { nanoid } from 'nanoid';

export interface CanvasEngineOptions {
  initialState?: Partial<CanvasState>;
  maxHistorySize?: number;
  enableSnapping?: boolean;
}

export class CanvasEngine implements CanvasAPI {
  private state: CanvasState;
  private sceneGraph: SceneGraph;
  private cameraController: CameraController;
  private snapManager: SnapManager;
  private eventListeners: Map<string, ((event: any) => void)[]> = new Map();
  private maxHistorySize: number;

  constructor(options: CanvasEngineOptions = {}) {
    this.maxHistorySize = options.maxHistorySize || 100;

    // Initialize state
    this.state = {
      nodes: new Map(),
      camera: {
        position: { x: 0, y: 0 },
        zoom: 1,
        minZoom: 0.1,
        maxZoom: 10
      },
      selection: {
        selectedIds: [],
        hoveredId: undefined,
        isMultiSelect: false
      },
      snap: {
        enabled: options.enableSnapping !== false,
        threshold: 8,
        snapToGrid: true,
        snapToNodes: true,
        gridSize: 20
      },
      viewport: {
        size: { width: 1024, height: 768 },
        bounds: { x: 0, y: 0, width: 1024, height: 768 }
      },
      tool: 'select',
      history: [],
      historyIndex: -1,
      ...options.initialState
    };

    // Initialize controllers
    this.sceneGraph = new SceneGraph();
    this.cameraController = new CameraController(this.state.camera, this.state.viewport);
    this.snapManager = new SnapManager(this.sceneGraph, this.state.snap);

    // Populate scene graph with existing nodes
    if (this.state.nodes.size > 0) {
      Array.from(this.state.nodes.values()).forEach(node => {
        this.sceneGraph.addNode(node);
      });
    }
  }

  addNode(nodeData: Partial<CanvasNode>): string {
    const id = nodeData.id || nanoid();
    
    let node: CanvasNode;
    const type = nodeData.type || 'rect';
    
    const baseTransform = {
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1 },
      ...nodeData.transform
    };
    
    const baseSize = { 
      width: 100, 
      height: 100, 
      ...nodeData.size 
    };
    
    const baseStyle = {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      opacity: 1,
      ...nodeData.style
    };
    
    const baseProps = {
      id,
      transform: baseTransform,
      size: baseSize,
      style: baseStyle,
      visible: nodeData.visible !== false,
      locked: nodeData.locked || false,
      metadata: nodeData.metadata
    };
    
    switch (type) {
      case 'rect':
        node = { ...baseProps, type: 'rect', radius: (nodeData as any)?.radius || 0 } as CanvasNode;
        break;
      case 'ellipse':
        node = { ...baseProps, type: 'ellipse' } as CanvasNode;
        break;
      case 'line':
        node = { ...baseProps, type: 'line', points: (nodeData as any)?.points || [] } as CanvasNode;
        break;
      case 'arrow':
        node = { ...baseProps, type: 'arrow', start: (nodeData as any)?.start || { x: 0, y: 0 }, end: (nodeData as any)?.end || { x: 100, y: 0 }, arrowStyle: (nodeData as any)?.arrowStyle || 'simple' } as CanvasNode;
        break;
      case 'text':
        node = { ...baseProps, type: 'text', content: (nodeData as any)?.content || 'Text', fontSize: (nodeData as any)?.fontSize || 16, fontFamily: (nodeData as any)?.fontFamily || 'Arial', fontWeight: (nodeData as any)?.fontWeight || 'normal', textAlign: (nodeData as any)?.textAlign || 'center', color: (nodeData as any)?.color || '#000000' } as CanvasNode;
        break;
      case 'sticky':
        node = { ...baseProps, type: 'sticky', content: (nodeData as any)?.content || '', color: (nodeData as any)?.color || '#FFF740' } as CanvasNode;
        break;
      case 'frame':
        node = { ...baseProps, type: 'frame', title: (nodeData as any)?.title || 'Frame', children: (nodeData as any)?.children || [] } as CanvasNode;
        break;
      case 'image':
        node = { ...baseProps, type: 'image', src: (nodeData as any)?.src || '', preserveAspectRatio: (nodeData as any)?.preserveAspectRatio !== false } as CanvasNode;
        break;
      default:
        node = { ...baseProps, type: 'rect', radius: 0 } as CanvasNode;
    }

    this.state.nodes.set(node.id, node);
    this.sceneGraph.addNode(node);
    
    this.addToHistory('add', { nodeId: node.id, node });
    this.emit('nodeAdded', { node });
    
    return node.id;
  }

  updateNode(id: string, patch: Partial<CanvasNode>): void {
    const existingNode = this.state.nodes.get(id);
    if (!existingNode) return;

    const updatedNode = { ...existingNode, ...patch } as CanvasNode;
    this.state.nodes.set(id, updatedNode);
    this.sceneGraph.updateNode(id, patch);
    
    this.addToHistory('update', { nodeId: id, patch, previous: existingNode });
    this.emit('nodeUpdated', { nodeId: id, node: updatedNode, patch });
  }

  removeNode(id: string): void {
    const node = this.state.nodes.get(id);
    if (!node) return;

    this.state.nodes.delete(id);
    this.sceneGraph.removeNode(id);
    
    // Remove from selection if selected
    this.state.selection.selectedIds = this.state.selection.selectedIds.filter(selectedId => selectedId !== id);
    
    this.addToHistory('delete', { nodeId: id, node });
    this.emit('nodeRemoved', { nodeId: id, node });
  }

  getNode(id: string): CanvasNode | undefined {
    return this.state.nodes.get(id);
  }

  getNodes(): CanvasNode[] {
    return Array.from(this.state.nodes.values());
  }

  // Selection management
  selectNode(id: string, multiSelect: boolean = false): void {
    if (!this.state.nodes.has(id)) return;

    if (multiSelect) {
      if (this.state.selection.selectedIds.includes(id)) {
        this.state.selection.selectedIds = this.state.selection.selectedIds.filter(selectedId => selectedId !== id);
      } else {
        this.state.selection.selectedIds.push(id);
      }
    } else {
      this.state.selection.selectedIds = [id];
    }

    this.state.selection.isMultiSelect = multiSelect;
    this.emit('selectionChanged', { selectedIds: this.state.selection.selectedIds });
  }

  clearSelection(): void {
    this.state.selection.selectedIds = [];
    this.state.selection.isMultiSelect = false;
    this.emit('selectionChanged', { selectedIds: [] });
  }

  // Camera operations
  zoomToFit(): void {
    const nodes = this.getNodes();
    if (nodes.length > 0) {
      // Calculate bounds of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      nodes.forEach(node => {
        const bounds = this.sceneGraph.getNodeBounds(node);
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      });
      
      const bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      this.cameraController.zoomToBounds(bounds);
      this.state.camera = this.cameraController.getCamera();
      this.emit('cameraChanged', { camera: this.state.camera });
    }
  }

  zoomToNodes(nodeIds: string[]): void {
    const nodes = nodeIds.map(id => this.getNode(id)).filter(node => node !== undefined) as CanvasNode[];
    if (nodes.length > 0) {
      // Calculate bounds of selected nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      nodes.forEach(node => {
        const bounds = this.sceneGraph.getNodeBounds(node);
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      });
      
      const bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      this.cameraController.zoomToBounds(bounds);
      this.state.camera = this.cameraController.getCamera();
      this.emit('cameraChanged', { camera: this.state.camera });
    }
  }

  // Snapshot management
  toSnapshot(): CanvasSnapshot {
    return {
      version: '1.0.0',
      timestamp: Date.now(),
      nodes: this.getNodes(),
      camera: { ...this.state.camera },
      metadata: {
        selection: { ...this.state.selection },
        snap: { ...this.state.snap },
        tool: this.state.tool
      }
    };
  }

  fromSnapshot(snapshot: CanvasSnapshot): void {
    // Clear current state
    this.state.nodes.clear();
    this.sceneGraph.clear();

    // Load nodes
    snapshot.nodes.forEach(node => {
      this.state.nodes.set(node.id, node);
      this.sceneGraph.addNode(node);
    });

    // Load camera
    this.state.camera = { ...snapshot.camera };
    this.cameraController.setPosition(snapshot.camera.position);
    this.cameraController.setZoom(snapshot.camera.zoom);

    // Load metadata if available
    if (snapshot.metadata) {
      if (snapshot.metadata.selection) {
        this.state.selection = { ...snapshot.metadata.selection };
      }
      if (snapshot.metadata.snap) {
        this.state.snap = { ...snapshot.metadata.snap };
        this.snapManager.updateSnapState(this.state.snap);
      }
      if (snapshot.metadata.tool) {
        this.state.tool = snapshot.metadata.tool;
      }
    }

    this.emit('snapshotLoaded', { snapshot });
  }

  // Viewport management
  setViewport(size: { width: number; height: number }): void {
    this.state.viewport.size = size;
    this.state.viewport.bounds = { x: 0, y: 0, ...size };
    this.cameraController.updateViewport(this.state.viewport);
  }

  // Transform coordinates
  screenToWorld(screenPoint: Point): Point {
    return this.cameraController.screenToWorld(screenPoint);
  }

  worldToScreen(worldPoint: Point): Point {
    return this.cameraController.worldToScreen(worldPoint);
  }

  // Camera controls
  pan(delta: Point): void {
    this.cameraController.pan(delta);
    this.state.camera = this.cameraController.getCamera();
    this.emit('cameraChanged', { camera: this.state.camera });
  }

  zoom(delta: number, screenPoint?: Point): void {
    if (screenPoint) {
      this.cameraController.zoomAt(screenPoint, delta);
    } else {
      const center = { 
        x: this.state.viewport.size.width / 2, 
        y: this.state.viewport.size.height / 2 
      };
      this.cameraController.zoomAt(center, delta);
    }
    this.state.camera = this.cameraController.getCamera();
    this.emit('cameraChanged', { camera: this.state.camera });
  }

  // History management
  private addToHistory(action: string, data: any): void {
    const entry = {
      id: nanoid(),
      timestamp: Date.now(),
      action: action as any,
      data
    };

    // Remove any history after current index
    this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    
    // Add new entry
    this.state.history.push(entry);
    this.state.historyIndex++;

    // Trim history if too large
    if (this.state.history.length > this.maxHistorySize) {
      this.state.history.shift();
      this.state.historyIndex--;
    }
  }

  // Event system
  on(event: string, listener: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  // Get current state (read-only)
  getState(): Readonly<CanvasState> {
    return this.state;
  }

  // Get controllers
  getCameraController(): CameraController {
    return this.cameraController;
  }

  getSnapManager(): SnapManager {
    return this.snapManager;
  }

  getSceneGraph(): SceneGraph {
    return this.sceneGraph;
  }

  // Cleanup
  destroy(): void {
    this.eventListeners.clear();
    // CameraController doesn't need explicit cleanup in this version
  }
}