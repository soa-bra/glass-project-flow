/**
 * Integration Tests - History Operations Integration
 * Tests the undo/redo system integration with all canvas operations
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Canvas element type for tests
interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerId: string;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  };
  locked: boolean;
  visible: boolean;
}

// History entry type
interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  data: {
    before: CanvasElement[];
    after: CanvasElement[];
  };
  description?: string;
}

// History manager
class HistoryManager {
  private history: HistoryEntry[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 100;
  private batchId: string | null = null;
  private batchEntries: HistoryEntry[] = [];
  
  // Current canvas state
  private elements: CanvasElement[] = [];
  
  getElements(): CanvasElement[] {
    return [...this.elements];
  }
  
  setElements(elements: CanvasElement[]): void {
    this.elements = elements;
  }
  
  recordAction(action: string, before: CanvasElement[], after: CanvasElement[], description?: string): void {
    const entry: HistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      data: { before: [...before], after: [...after] },
      description,
    };
    
    if (this.batchId) {
      this.batchEntries.push(entry);
      return;
    }
    
    this.pushEntry(entry);
  }
  
  private pushEntry(entry: HistoryEntry): void {
    // Remove any entries after current index (clear redo stack)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new entry
    this.history.push(entry);
    this.currentIndex = this.history.length - 1;
    
    // Enforce max history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
    
    // Update current state
    this.elements = [...entry.data.after];
  }
  
  startBatch(batchId: string): void {
    this.batchId = batchId;
    this.batchEntries = [];
  }
  
  commitBatch(): void {
    if (!this.batchId || this.batchEntries.length === 0) {
      this.batchId = null;
      this.batchEntries = [];
      return;
    }
    
    // Combine batch entries into single entry
    const combinedEntry: HistoryEntry = {
      id: this.batchId,
      timestamp: Date.now(),
      action: 'batch',
      data: {
        before: this.batchEntries[0].data.before,
        after: this.batchEntries[this.batchEntries.length - 1].data.after,
      },
      description: `Batch: ${this.batchEntries.length} operations`,
    };
    
    this.pushEntry(combinedEntry);
    
    this.batchId = null;
    this.batchEntries = [];
  }
  
  cancelBatch(): void {
    this.batchId = null;
    this.batchEntries = [];
  }
  
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }
  
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
  
  undo(): CanvasElement[] | null {
    if (!this.canUndo()) return null;
    
    const entry = this.history[this.currentIndex];
    this.currentIndex--;
    this.elements = [...entry.data.before];
    
    return this.elements;
  }
  
  redo(): CanvasElement[] | null {
    if (!this.canRedo()) return null;
    
    this.currentIndex++;
    const entry = this.history[this.currentIndex];
    this.elements = [...entry.data.after];
    
    return this.elements;
  }
  
  getHistoryLength(): number {
    return this.history.length;
  }
  
  getCurrentIndex(): number {
    return this.currentIndex;
  }
  
  getEntry(index: number): HistoryEntry | undefined {
    return this.history[index];
  }
  
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.elements = [];
    this.batchId = null;
    this.batchEntries = [];
  }
}

// Helper to create test elements
const createTestElement = (overrides: Partial<CanvasElement> = {}): CanvasElement => ({
  id: `el-${Math.random().toString(36).substr(2, 9)}`,
  type: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  rotation: 0,
  layerId: 'default',
  style: {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
    opacity: 1,
  },
  locked: false,
  visible: true,
  ...overrides,
});

describe('History Operations Integration Tests', () => {
  let historyManager: HistoryManager;
  
  beforeEach(() => {
    historyManager = new HistoryManager();
  });

  describe('Basic History Operations', () => {
    it('should record add element action', () => {
      const element = createTestElement({ id: 'el-1' });
      
      historyManager.recordAction('add', [], [element]);
      
      expect(historyManager.getHistoryLength()).toBe(1);
      expect(historyManager.getElements()).toHaveLength(1);
    });

    it('should record update element action', () => {
      const original = createTestElement({ id: 'el-1', x: 100 });
      const updated = { ...original, x: 200 };
      
      historyManager.recordAction('add', [], [original]);
      historyManager.recordAction('update', [original], [updated]);
      
      expect(historyManager.getHistoryLength()).toBe(2);
      expect(historyManager.getElements()[0].x).toBe(200);
    });

    it('should record delete element action', () => {
      const element = createTestElement({ id: 'el-1' });
      
      historyManager.recordAction('add', [], [element]);
      historyManager.recordAction('delete', [element], []);
      
      expect(historyManager.getHistoryLength()).toBe(2);
      expect(historyManager.getElements()).toHaveLength(0);
    });
  });

  describe('Undo Operations', () => {
    it('should undo add element', () => {
      const element = createTestElement({ id: 'el-1' });
      
      historyManager.recordAction('add', [], [element]);
      
      expect(historyManager.canUndo()).toBe(true);
      
      const result = historyManager.undo();
      
      expect(result).toHaveLength(0);
      expect(historyManager.getElements()).toHaveLength(0);
    });

    it('should undo update element', () => {
      const original = createTestElement({ id: 'el-1', x: 100 });
      const updated = { ...original, x: 200 };
      
      historyManager.recordAction('add', [], [original]);
      historyManager.recordAction('update', [original], [updated]);
      
      historyManager.undo();
      
      expect(historyManager.getElements()[0].x).toBe(100);
    });

    it('should undo delete element', () => {
      const element = createTestElement({ id: 'el-1' });
      
      historyManager.recordAction('add', [], [element]);
      historyManager.recordAction('delete', [element], []);
      
      historyManager.undo();
      
      expect(historyManager.getElements()).toHaveLength(1);
    });

    it('should undo multiple actions', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-2' })]);
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-3' })]);
      
      expect(historyManager.getElements()).toHaveLength(3);
      
      historyManager.undo();
      expect(historyManager.getElements()).toHaveLength(2);
      
      historyManager.undo();
      expect(historyManager.getElements()).toHaveLength(1);
      
      historyManager.undo();
      expect(historyManager.getElements()).toHaveLength(0);
    });

    it('should not undo when history is empty', () => {
      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.undo()).toBeNull();
    });
  });

  describe('Redo Operations', () => {
    it('should redo after undo', () => {
      const element = createTestElement({ id: 'el-1' });
      
      historyManager.recordAction('add', [], [element]);
      historyManager.undo();
      
      expect(historyManager.canRedo()).toBe(true);
      
      const result = historyManager.redo();
      
      expect(result).toHaveLength(1);
      expect(historyManager.getElements()).toHaveLength(1);
    });

    it('should redo multiple times', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-2' })]);
      
      historyManager.undo();
      historyManager.undo();
      
      historyManager.redo();
      expect(historyManager.getElements()).toHaveLength(1);
      
      historyManager.redo();
      expect(historyManager.getElements()).toHaveLength(2);
    });

    it('should not redo when at latest state', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      
      expect(historyManager.canRedo()).toBe(false);
      expect(historyManager.redo()).toBeNull();
    });

    it('should clear redo stack on new action', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-2' })]);
      
      historyManager.undo();
      
      expect(historyManager.canRedo()).toBe(true);
      
      // New action clears redo stack
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-3' })]);
      
      expect(historyManager.canRedo()).toBe(false);
    });
  });

  describe('Batch Operations', () => {
    it('should batch multiple operations', () => {
      const before = historyManager.getElements();
      
      historyManager.startBatch('batch-1');
      
      const el1 = createTestElement({ id: 'el-1' });
      const el2 = createTestElement({ id: 'el-2' });
      const el3 = createTestElement({ id: 'el-3' });
      
      historyManager.recordAction('add', before, [el1]);
      historyManager.recordAction('add', [el1], [el1, el2]);
      historyManager.recordAction('add', [el1, el2], [el1, el2, el3]);
      
      historyManager.commitBatch();
      
      // Should be single history entry
      expect(historyManager.getHistoryLength()).toBe(1);
      expect(historyManager.getElements()).toHaveLength(3);
    });

    it('should undo entire batch at once', () => {
      historyManager.startBatch('batch-1');
      
      const el1 = createTestElement({ id: 'el-1' });
      const el2 = createTestElement({ id: 'el-2' });
      
      historyManager.recordAction('add', [], [el1]);
      historyManager.recordAction('add', [el1], [el1, el2]);
      
      historyManager.commitBatch();
      
      historyManager.undo();
      
      // All batch operations should be undone
      expect(historyManager.getElements()).toHaveLength(0);
    });

    it('should cancel batch without recording', () => {
      historyManager.startBatch('batch-1');
      
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-2' })]);
      
      historyManager.cancelBatch();
      
      expect(historyManager.getHistoryLength()).toBe(0);
    });

    it('should handle empty batch', () => {
      historyManager.startBatch('batch-1');
      historyManager.commitBatch();
      
      expect(historyManager.getHistoryLength()).toBe(0);
    });
  });

  describe('History Size Limit', () => {
    it('should respect max history size', () => {
      // Record more than max history size
      for (let i = 0; i < 150; i++) {
        historyManager.recordAction(
          'add',
          historyManager.getElements(),
          [...historyManager.getElements(), createTestElement({ id: `el-${i}` })]
        );
      }
      
      expect(historyManager.getHistoryLength()).toBeLessThanOrEqual(100);
    });
  });

  describe('Complex Workflows', () => {
    it('should handle mixed operations workflow', () => {
      // Add elements
      const el1 = createTestElement({ id: 'el-1', x: 0 });
      historyManager.recordAction('add', [], [el1]);
      
      const el2 = createTestElement({ id: 'el-2', x: 100 });
      historyManager.recordAction('add', [el1], [el1, el2]);
      
      // Update element
      const el1Updated = { ...el1, x: 50 };
      historyManager.recordAction('update', [el1, el2], [el1Updated, el2]);
      
      // Delete element
      historyManager.recordAction('delete', [el1Updated, el2], [el1Updated]);
      
      expect(historyManager.getElements()).toHaveLength(1);
      expect(historyManager.getHistoryLength()).toBe(4);
      
      // Undo all
      historyManager.undo(); // Undo delete
      expect(historyManager.getElements()).toHaveLength(2);
      
      historyManager.undo(); // Undo update
      expect(historyManager.getElements()[0].x).toBe(0);
      
      historyManager.undo(); // Undo add el2
      expect(historyManager.getElements()).toHaveLength(1);
      
      historyManager.undo(); // Undo add el1
      expect(historyManager.getElements()).toHaveLength(0);
    });

    it('should handle interleaved undo/redo', () => {
      const el1 = createTestElement({ id: 'el-1' });
      const el2 = createTestElement({ id: 'el-2' });
      const el3 = createTestElement({ id: 'el-3' });
      
      historyManager.recordAction('add', [], [el1]);
      historyManager.recordAction('add', [el1], [el1, el2]);
      historyManager.recordAction('add', [el1, el2], [el1, el2, el3]);
      
      historyManager.undo(); // Remove el3
      historyManager.undo(); // Remove el2
      historyManager.redo(); // Restore el2
      
      expect(historyManager.getElements()).toHaveLength(2);
      expect(historyManager.getElements().map(e => e.id)).toContain('el-1');
      expect(historyManager.getElements().map(e => e.id)).toContain('el-2');
    });

    it('should preserve element properties through undo/redo', () => {
      const original = createTestElement({
        id: 'el-1',
        x: 100,
        y: 200,
        rotation: 45,
        style: { fill: '#ff0000', stroke: '#000000', strokeWidth: 2, opacity: 0.8 },
      });
      
      historyManager.recordAction('add', [], [original]);
      
      historyManager.undo();
      historyManager.redo();
      
      const restored = historyManager.getElements()[0];
      expect(restored.x).toBe(100);
      expect(restored.y).toBe(200);
      expect(restored.rotation).toBe(45);
      expect(restored.style?.fill).toBe('#ff0000');
      expect(restored.style?.strokeWidth).toBe(2);
    });
  });

  describe('History Performance', () => {
    it('should record 100 actions in under 50ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        historyManager.recordAction(
          'add',
          historyManager.getElements(),
          [...historyManager.getElements(), createTestElement({ id: `el-${i}` })]
        );
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it('should undo 100 actions in under 50ms', () => {
      for (let i = 0; i < 100; i++) {
        historyManager.recordAction(
          'add',
          historyManager.getElements(),
          [...historyManager.getElements(), createTestElement({ id: `el-${i}` })]
        );
      }
      
      const start = performance.now();
      
      while (historyManager.canUndo()) {
        historyManager.undo();
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it('should handle batch of 50 operations efficiently', () => {
      const start = performance.now();
      
      historyManager.startBatch('large-batch');
      
      for (let i = 0; i < 50; i++) {
        historyManager.recordAction(
          'add',
          historyManager.getElements(),
          [...historyManager.getElements(), createTestElement({ id: `el-${i}` })]
        );
      }
      
      historyManager.commitBatch();
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(30);
      expect(historyManager.getHistoryLength()).toBe(1);
    });
  });

  describe('History Entry Details', () => {
    it('should store action description', () => {
      historyManager.recordAction(
        'add',
        [],
        [createTestElement({ id: 'el-1' })],
        'Added rectangle element'
      );
      
      const entry = historyManager.getEntry(0);
      expect(entry?.description).toBe('Added rectangle element');
    });

    it('should store timestamp', () => {
      const before = Date.now();
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      const after = Date.now();
      
      const entry = historyManager.getEntry(0);
      expect(entry?.timestamp).toBeGreaterThanOrEqual(before);
      expect(entry?.timestamp).toBeLessThanOrEqual(after);
    });

    it('should generate unique entry IDs', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.recordAction('add', historyManager.getElements(), [...historyManager.getElements(), createTestElement({ id: 'el-2' })]);
      
      const entry1 = historyManager.getEntry(0);
      const entry2 = historyManager.getEntry(1);
      
      expect(entry1?.id).not.toBe(entry2?.id);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undo after clear', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.clear();
      
      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.undo()).toBeNull();
    });

    it('should handle elements with same IDs', () => {
      const el1 = createTestElement({ id: 'el-1', x: 100 });
      historyManager.recordAction('add', [], [el1]);
      
      const el1Updated = { ...el1, x: 200 };
      historyManager.recordAction('update', [el1], [el1Updated]);
      
      historyManager.undo();
      
      expect(historyManager.getElements()[0].x).toBe(100);
    });

    it('should handle empty before/after states', () => {
      historyManager.recordAction('add', [], [createTestElement({ id: 'el-1' })]);
      historyManager.recordAction('delete', historyManager.getElements(), []);
      
      expect(historyManager.getElements()).toHaveLength(0);
      
      historyManager.undo();
      expect(historyManager.getElements()).toHaveLength(1);
    });
  });
});
