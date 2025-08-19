import { SelectionState, CanvasNode, Point, Bounds } from '../types';
import { SceneGraph } from '../utils/scene-graph';

export interface SelectionEvent {
  type: 'selection-changed';
  selectedIds: string[];
  previousIds: string[];
}

export class SelectionManager {
  private selection: SelectionState;
  private sceneGraph: SceneGraph;
  private listeners: ((event: SelectionEvent) => void)[] = [];

  constructor(sceneGraph: SceneGraph) {
    this.selection = {
      selectedIds: [],
      isMultiSelect: false
    };
    this.sceneGraph = sceneGraph;
  }

  // Get current selection state
  getSelection(): SelectionState {
    return { ...this.selection };
  }

  // Select a single node
  selectNode(nodeId: string, multiSelect: boolean = false): void {
    const previousIds = [...this.selection.selectedIds];
    
    if (multiSelect) {
      if (this.selection.selectedIds.includes(nodeId)) {
        // Deselect if already selected
        this.selection.selectedIds = this.selection.selectedIds.filter(id => id !== nodeId);
      } else {
        // Add to selection
        this.selection.selectedIds.push(nodeId);
      }
    } else {
      // Single selection
      this.selection.selectedIds = [nodeId];
    }
    
    this.selection.isMultiSelect = this.selection.selectedIds.length > 1;
    this.notifySelectionChanged(previousIds);
  }

  // Select multiple nodes
  selectNodes(nodeIds: string[], multiSelect: boolean = false): void {
    const previousIds = [...this.selection.selectedIds];
    
    if (multiSelect) {
      // Add to existing selection, avoiding duplicates
      const newIds = nodeIds.filter(id => !this.selection.selectedIds.includes(id));
      this.selection.selectedIds.push(...newIds);
    } else {
      // Replace selection
      this.selection.selectedIds = [...nodeIds];
    }
    
    this.selection.isMultiSelect = this.selection.selectedIds.length > 1;
    this.notifySelectionChanged(previousIds);
  }

  // Deselect a node
  deselectNode(nodeId: string): void {
    const previousIds = [...this.selection.selectedIds];
    this.selection.selectedIds = this.selection.selectedIds.filter(id => id !== nodeId);
    this.selection.isMultiSelect = this.selection.selectedIds.length > 1;
    this.notifySelectionChanged(previousIds);
  }

  // Clear all selections
  clearSelection(): void {
    const previousIds = [...this.selection.selectedIds];
    this.selection.selectedIds = [];
    this.selection.isMultiSelect = false;
    this.selection.hoveredId = undefined;
    this.notifySelectionChanged(previousIds);
  }

  // Set hovered node
  setHoveredNode(nodeId?: string): void {
    this.selection.hoveredId = nodeId;
  }

  // Check if node is selected
  isSelected(nodeId: string): boolean {
    return this.selection.selectedIds.includes(nodeId);
  }

  // Check if node is hovered
  isHovered(nodeId: string): boolean {
    return this.selection.hoveredId === nodeId;
  }

  // Get selected nodes
  getSelectedNodes(): CanvasNode[] {
    return this.selection.selectedIds
      .map(id => this.sceneGraph.getNode(id))
      .filter((node): node is CanvasNode => node !== undefined);
  }

  // Select nodes in a rectangular area
  selectInArea(bounds: Bounds, multiSelect: boolean = false): void {
    const nodesInBounds = this.sceneGraph.getNodesInBounds(bounds);
    const nodeIds = nodesInBounds.map(node => node.id);
    
    if (nodeIds.length > 0) {
      this.selectNodes(nodeIds, multiSelect);
    } else if (!multiSelect) {
      this.clearSelection();
    }
  }

  // Hit test and select node at point
  selectAtPoint(point: Point, multiSelect: boolean = false): boolean {
    const hitNodes = this.sceneGraph.hitTest(point);
    
    if (hitNodes.length > 0) {
      // Select the topmost node
      const topNode = hitNodes[0];
      this.selectNode(topNode.id, multiSelect);
      return true;
    } else if (!multiSelect) {
      this.clearSelection();
    }
    
    return false;
  }

  // Select all nodes
  selectAll(): void {
    const allNodes = this.sceneGraph.getAllNodes();
    const nodeIds = allNodes.map(node => node.id);
    this.selectNodes(nodeIds, false);
  }

  // Get selection bounds (bounding box of all selected nodes)
  getSelectionBounds(): Bounds | null {
    const selectedNodes = this.getSelectedNodes();
    
    if (selectedNodes.length === 0) return null;
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    selectedNodes.forEach(node => {
      const bounds = this.sceneGraph.getNodeBounds(node);
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    });
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  // Move selected nodes by delta
  moveSelection(delta: Point): void {
    const selectedNodes = this.getSelectedNodes();
    
    selectedNodes.forEach(node => {
      const newPosition = {
        x: node.transform.position.x + delta.x,
        y: node.transform.position.y + delta.y
      };
      
      this.sceneGraph.updateNode(node.id, {
        transform: {
          ...node.transform,
          position: newPosition
        }
      });
    });
  }

  // Add selection event listener
  addEventListener(listener: (event: SelectionEvent) => void): void {
    this.listeners.push(listener);
  }

  // Remove selection event listener
  removeEventListener(listener: (event: SelectionEvent) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify listeners of selection change
  private notifySelectionChanged(previousIds: string[]): void {
    const event: SelectionEvent = {
      type: 'selection-changed',
      selectedIds: [...this.selection.selectedIds],
      previousIds
    };
    
    this.listeners.forEach(listener => listener(event));
  }
}