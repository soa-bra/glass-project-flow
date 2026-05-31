/**
 * Unit Tests for HistorySlice
 * اختبارات وحدة لـ HistorySlice
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';

describe('HistorySlice', () => {
  beforeEach(() => {
    // Reset store state
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      history: { past: [], future: [] },
      layers: [{
        id: 'default',
        name: 'الطبقة الافتراضية',
        visible: true,
        locked: false,
        elements: [],
        zIndex: 0
      }]
    });
  });

  describe('undo', () => {
    it('should restore previous state', () => {
      const { addElement, undo } = useCanvasStore.getState();
      
      // Add elements to create history
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      const afterAdd = useCanvasStore.getState().elements.length;
      
      undo();
      
      const afterUndo = useCanvasStore.getState().elements.length;
      expect(afterUndo).toBeLessThan(afterAdd);
    });

    it('should move current to future', () => {
      const { addElement, undo } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      const { history: beforeUndo } = useCanvasStore.getState();
      const pastLength = beforeUndo.past.length;
      
      undo();
      
      const { history: afterUndo } = useCanvasStore.getState();
      expect(afterUndo.future.length).toBeGreaterThan(0);
      expect(afterUndo.past.length).toBe(pastLength - 1);
    });

    it('should do nothing when past is empty', () => {
      const { undo } = useCanvasStore.getState();
      
      const before = useCanvasStore.getState();
      undo();
      const after = useCanvasStore.getState();
      
      expect(after.elements).toEqual(before.elements);
    });

    it('should support multiple undos', () => {
      const { addElement, undo } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-3', type: 'shape', position: { x: 200, y: 0 }, size: { width: 100, height: 100 } });
      
      undo(); // Remove el-3
      undo(); // Remove el-2
      
      const { elements } = useCanvasStore.getState();
      expect(elements.length).toBeLessThanOrEqual(1);
    });
  });

  describe('redo', () => {
    it('should restore next state', () => {
      const { addElement, undo, redo } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      const beforeUndo = useCanvasStore.getState().elements.length;
      
      undo();
      redo();
      
      const afterRedo = useCanvasStore.getState().elements.length;
      expect(afterRedo).toBe(beforeUndo);
    });

    it('should move current to past', () => {
      const { addElement, undo, redo } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      undo();
      
      const { history: beforeRedo } = useCanvasStore.getState();
      const futureLength = beforeRedo.future.length;
      
      redo();
      
      const { history: afterRedo } = useCanvasStore.getState();
      expect(afterRedo.future.length).toBe(futureLength - 1);
    });

    it('should do nothing when future is empty', () => {
      const { redo } = useCanvasStore.getState();
      
      const before = useCanvasStore.getState();
      redo();
      const after = useCanvasStore.getState();
      
      expect(after.elements).toEqual(before.elements);
    });

    it('should support multiple redos', () => {
      const { addElement, undo, redo } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 0 }, size: { width: 100, height: 100 } });
      
      undo();
      undo();
      
      const afterUndos = useCanvasStore.getState().elements.length;
      
      redo();
      redo();
      
      const afterRedos = useCanvasStore.getState().elements.length;
      expect(afterRedos).toBeGreaterThan(afterUndos);
    });
  });

  describe('pushHistory', () => {
    it('should add current state to past', () => {
      const { pushHistory } = useCanvasStore.getState();
      
      // Set some elements first
      useCanvasStore.setState({ elements: [{ id: 'test', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } }] as any });
      
      pushHistory();
      
      const { history } = useCanvasStore.getState();
      expect(history.past.length).toBeGreaterThan(0);
    });

    it('should clear future', () => {
      const { addElement, undo, pushHistory } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      undo();
      
      // Verify we have future
      expect(useCanvasStore.getState().history.future.length).toBeGreaterThan(0);
      
      // New action should clear future
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 0 }, size: { width: 100, height: 100 } });
      
      expect(useCanvasStore.getState().history.future.length).toBe(0);
    });

    it('should limit history to 20 entries', () => {
      const { pushHistory } = useCanvasStore.getState();
      
      // Push more than 20 entries
      for (let i = 0; i < 25; i++) {
        useCanvasStore.setState({ 
          elements: [{ id: `test-${i}`, type: 'shape', position: { x: i, y: 0 }, size: { width: 100, height: 100 } }] as any 
        });
        pushHistory();
      }
      
      const { history } = useCanvasStore.getState();
      expect(history.past.length).toBeLessThanOrEqual(21); // Including current + 20 history
    });
  });

  describe('clearHistory', () => {
    it('should clear past and future', () => {
      const { addElement, undo, clearHistory } = useCanvasStore.getState();
      
      // Create some history
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 0 }, size: { width: 100, height: 100 } });
      undo();
      
      // Verify we have both past and future
      const beforeClear = useCanvasStore.getState().history;
      expect(beforeClear.past.length).toBeGreaterThan(0);
      expect(beforeClear.future.length).toBeGreaterThan(0);
      
      clearHistory();
      
      const { history } = useCanvasStore.getState();
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    it('should not affect current elements', () => {
      const { addElement, clearHistory } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      
      const beforeClear = useCanvasStore.getState().elements.length;
      
      clearHistory();
      
      const afterClear = useCanvasStore.getState().elements.length;
      expect(afterClear).toBe(beforeClear);
    });
  });

  describe('undo/redo interaction', () => {
    it('should handle undo then new action correctly', () => {
      const { addElement, undo } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 0 }, size: { width: 100, height: 100 } });
      
      undo(); // Back to 1 element
      
      addElement({ id: 'el-3', type: 'shape', position: { x: 200, y: 0 }, size: { width: 100, height: 100 } });
      
      // Future should be cleared
      const { history, elements } = useCanvasStore.getState();
      expect(history.future.length).toBe(0);
      expect(elements.length).toBe(2); // el-1 and el-3
    });

    it('should preserve element properties through undo/redo', () => {
      const { addElement, updateElement, undo, redo } = useCanvasStore.getState();
      
      addElement({ 
        id: 'el-1', 
        type: 'shape', 
        position: { x: 0, y: 0 }, 
        size: { width: 100, height: 100 },
        style: { backgroundColor: '#FF0000' }
      });
      
      updateElement('el-1', { style: { backgroundColor: '#00FF00' } });
      
      undo();
      
      const afterUndo = useCanvasStore.getState().elements.find(e => e.id === 'el-1');
      
      redo();
      
      const afterRedo = useCanvasStore.getState().elements.find(e => e.id === 'el-1');
      expect(afterRedo?.style?.backgroundColor).toBe('#00FF00');
    });
  });
});
