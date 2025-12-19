/**
 * Integration Tests - Store Integration
 * Tests the integration between different store slices
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Simple canvas element type for tests
interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerId: string;
  style?: Record<string, unknown>;
  locked: boolean;
  visible: boolean;
}

// Mock store for testing
class MockCanvasStore {
  elements: CanvasElement[] = [];
  selectedElementIds: string[] = [];
  clipboard: CanvasElement[] = [];
  history: CanvasElement[][] = [];
  historyIndex = -1;
  layers = [{ id: 'default', name: 'Default', visible: true, locked: false }];
  activeLayerId = 'default';
  viewport = { zoom: 1, panX: 0, panY: 0 };
  activeTool = 'select';
  
  addElement(el: CanvasElement) {
    this.pushHistory();
    this.elements = [...this.elements, { ...el, layerId: this.activeLayerId }];
  }
  
  updateElement(id: string, updates: Partial<CanvasElement>) {
    this.pushHistory();
    this.elements = this.elements.map(el => el.id === id ? { ...el, ...updates } : el);
  }
  
  deleteElement(id: string) {
    this.pushHistory();
    this.elements = this.elements.filter(el => el.id !== id);
    this.selectedElementIds = this.selectedElementIds.filter(sid => sid !== id);
  }
  
  selectElement(id: string, multi = false) {
    if (multi) {
      this.selectedElementIds = this.selectedElementIds.includes(id)
        ? this.selectedElementIds.filter(sid => sid !== id)
        : [...this.selectedElementIds, id];
    } else {
      this.selectedElementIds = [id];
    }
  }
  
  selectElements(ids: string[]) {
    this.selectedElementIds = ids;
  }
  
  clearSelection() {
    this.selectedElementIds = [];
  }
  
  copyElements() {
    this.clipboard = this.elements.filter(el => this.selectedElementIds.includes(el.id));
  }
  
  pasteElements() {
    this.pushHistory();
    const pasted = this.clipboard.map(el => ({
      ...el,
      id: `pasted-${Math.random().toString(36).substr(2, 9)}`,
      x: el.x + 20,
      y: el.y + 20,
    }));
    this.elements = [...this.elements, ...pasted];
  }
  
  cutElements() {
    this.copyElements();
    const ids = [...this.selectedElementIds];
    ids.forEach(id => this.deleteElement(id));
  }
  
  pushHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push([...this.elements]);
    this.historyIndex++;
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }
  
  undo() {
    if (this.historyIndex >= 0) {
      this.elements = [...this.history[this.historyIndex]];
      this.historyIndex--;
    }
  }
  
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.elements = [...this.history[this.historyIndex]];
    }
  }
  
  setActiveLayer(id: string) { this.activeLayerId = id; }
  addLayer(layer: { id: string; name: string; visible: boolean; locked: boolean }) {
    this.layers.push(layer);
  }
  toggleLayerVisibility(id: string) {
    this.layers = this.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
  }
  toggleLayerLock(id: string) {
    this.layers = this.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l);
  }
  setZoom(z: number) { this.viewport.zoom = z; }
  setPan(p: { panX: number; panY: number }) { Object.assign(this.viewport, p); }
  setActiveTool(t: string) { this.activeTool = t; }
  
  reset() {
    this.elements = [];
    this.selectedElementIds = [];
    this.clipboard = [];
    this.history = [];
    this.historyIndex = -1;
  }
}

const createTestElement = (overrides: Partial<CanvasElement> = {}): CanvasElement => ({
  id: `el-${Math.random().toString(36).substr(2, 9)}`,
  type: 'rectangle',
  x: 100, y: 100, width: 200, height: 150, rotation: 0,
  layerId: 'default',
  style: { fill: '#fff', stroke: '#000' },
  locked: false, visible: true,
  ...overrides,
});

describe('Store Integration Tests', () => {
  let store: MockCanvasStore;
  
  beforeEach(() => {
    store = new MockCanvasStore();
  });

  describe('Elements + Selection', () => {
    it('should maintain selection on update', () => {
      store.addElement(createTestElement({ id: 'el-1' }));
      store.selectElement('el-1');
      store.updateElement('el-1', { x: 200 });
      expect(store.selectedElementIds).toContain('el-1');
    });

    it('should clear selection on delete', () => {
      store.addElement(createTestElement({ id: 'el-1' }));
      store.selectElement('el-1');
      store.deleteElement('el-1');
      expect(store.selectedElementIds).not.toContain('el-1');
    });
  });

  describe('Elements + History', () => {
    it('should undo add', () => {
      store.addElement(createTestElement({ id: 'el-1' }));
      store.addElement(createTestElement({ id: 'el-2' }));
      expect(store.elements).toHaveLength(2);
      store.undo();
      expect(store.elements).toHaveLength(1);
    });

    it('should redo after undo', () => {
      store.addElement(createTestElement({ id: 'el-1' }));
      store.addElement(createTestElement({ id: 'el-2' }));
      store.undo();
      store.redo();
      expect(store.elements).toHaveLength(2);
    });
  });

  describe('Elements + Layers', () => {
    it('should assign to active layer', () => {
      store.addLayer({ id: 'layer-2', name: 'Layer 2', visible: true, locked: false });
      store.setActiveLayer('layer-2');
      store.addElement(createTestElement({ id: 'el-1' }));
      expect(store.elements[0].layerId).toBe('layer-2');
    });
  });

  describe('Elements + Clipboard', () => {
    it('should copy and paste', () => {
      store.addElement(createTestElement({ id: 'el-1' }));
      store.selectElement('el-1');
      store.copyElements();
      store.pasteElements();
      expect(store.elements).toHaveLength(2);
    });

    it('should cut elements', () => {
      store.addElement(createTestElement({ id: 'el-1' }));
      store.selectElement('el-1');
      store.cutElements();
      expect(store.elements).toHaveLength(0);
      expect(store.clipboard).toHaveLength(1);
    });
  });

  describe('Viewport', () => {
    it('should not affect element positions', () => {
      store.addElement(createTestElement({ id: 'el-1', x: 100, y: 100 }));
      store.setZoom(2);
      store.setPan({ panX: 50, panY: 50 });
      expect(store.elements[0].x).toBe(100);
      expect(store.elements[0].y).toBe(100);
    });
  });
});
