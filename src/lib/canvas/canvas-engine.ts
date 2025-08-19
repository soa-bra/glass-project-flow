import { CanvasAPI, CanvasState, CanvasNode, CanvasSnapshot } from './types';
import { SceneGraph } from './utils/scene-graph';
import { CameraController } from './controllers/camera-controller';
import { SelectionManager } from './controllers/selection-manager';
import { SnapManager } from './controllers/snap-manager';
import { InputController } from './controllers/input-controller';
import { NodeFactory } from './nodes/node-factory';
import { nanoid } from 'nanoid';

export class InfiniteCanvasEngine implements CanvasAPI {
  private sceneGraph: SceneGraph;
  private camera: CameraController;
  private selection: SelectionManager;
  private snap: SnapManager;
  private input: InputController;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    this.sceneGraph = new SceneGraph();
    this.camera = new CameraController(
      { position: { x: 0, y: 0 }, zoom: 1, minZoom: 0.1, maxZoom: 8 },
      { size: { width: canvas.width, height: canvas.height }, bounds: { x: 0, y: 0, width: canvas.width, height: canvas.height } }
    );
    this.selection = new SelectionManager(this.sceneGraph);
    this.snap = new SnapManager(this.sceneGraph);
    this.input = new InputController(canvas, this.camera);

    this.setupEventHandlers();
    this.startRenderLoop();
  }

  addNode(node: Partial<CanvasNode>): string {
    const fullNode = NodeFactory.createNode(
      node.type || 'rect',
      { position: node.transform?.position || { x: 0, y: 0 } },
      node
    );
    this.sceneGraph.addNode(fullNode);
    return fullNode.id;
  }

  updateNode(id: string, patch: Partial<CanvasNode>): void {
    this.sceneGraph.updateNode(id, patch);
  }

  removeNode(id: string): void {
    this.sceneGraph.removeNode(id);
  }

  getNode(id: string): CanvasNode | undefined {
    return this.sceneGraph.getNode(id);
  }

  getNodes(): CanvasNode[] {
    return this.sceneGraph.getAllNodes();
  }

  selectNode(id: string, multiSelect = false): void {
    this.selection.selectNode(id, multiSelect);
  }

  clearSelection(): void {
    this.selection.clearSelection();
  }

  zoomToFit(): void {
    const bounds = this.sceneGraph.getSceneBounds();
    this.camera.zoomToBounds(bounds);
  }

  zoomToNodes(nodeIds: string[]): void {
    // Implementation for zooming to specific nodes
  }

  toSnapshot(): CanvasSnapshot {
    return {
      version: '1.0.0',
      timestamp: Date.now(),
      nodes: this.sceneGraph.getAllNodes(),
      camera: this.camera.getCamera(),
      metadata: {}
    };
  }

  fromSnapshot(snapshot: CanvasSnapshot): void {
    this.sceneGraph.clear();
    snapshot.nodes.forEach(node => this.sceneGraph.addNode(node));
    this.camera.setPosition(snapshot.camera.position);
    this.camera.setZoom(snapshot.camera.zoom);
  }

  private setupEventHandlers(): void {
    this.input.addEventListener((event) => {
      switch (event.type) {
        case 'wheel':
          if (event.deltaY) {
            this.camera.zoomAt(event.screenPoint, -event.deltaY * 0.001);
          }
          break;
        case 'pointer-down':
          this.selection.selectAtPoint(event.point, event.modifiers.shift);
          break;
      }
    });
  }

  private startRenderLoop(): void {
    const render = () => {
      this.render();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const visibleBounds = this.camera.getVisibleBounds();
    const visibleNodes = this.sceneGraph.getVisibleNodes(visibleBounds);
    
    // Render nodes (basic implementation)
    visibleNodes.forEach(node => {
      // Basic rendering - would be enhanced with proper node renderers
      const bounds = this.sceneGraph.getNodeBounds(node);
      const screenPos = this.camera.worldToScreen(bounds);
      
      this.ctx.fillStyle = node.style.fill || '#ffffff';
      this.ctx.fillRect(screenPos.x, screenPos.y, bounds.width, bounds.height);
    });
  }
}