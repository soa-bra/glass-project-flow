/**
 * Unit Tests for SelectionSlice
 * اختبارات وحدة لـ SelectionSlice
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';

describe('SelectionSlice', () => {
  beforeEach(() => {
    // Reset store state
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      clipboard: [],
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

    // Add test elements
    const { addElement } = useCanvasStore.getState();
    addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
    addElement({ id: 'el-2', type: 'shape', position: { x: 150, y: 0 }, size: { width: 100, height: 100 } });
    addElement({ id: 'el-3', type: 'shape', position: { x: 300, y: 0 }, size: { width: 100, height: 100 } });
  });

  describe('selectElement', () => {
    it('should select single element', () => {
      const { selectElement } = useCanvasStore.getState();
      
      selectElement('el-1');
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).toEqual(['el-1']);
    });

    it('should replace selection without multiSelect', () => {
      const { selectElement } = useCanvasStore.getState();
      
      selectElement('el-1');
      selectElement('el-2');
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).toEqual(['el-2']);
    });

    it('should add to selection with multiSelect', () => {
      const { selectElement } = useCanvasStore.getState();
      
      selectElement('el-1');
      selectElement('el-2', true);
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).toContain('el-1');
      expect(selectedElementIds).toContain('el-2');
    });

    it('should toggle selection with multiSelect', () => {
      const { selectElement } = useCanvasStore.getState();
      
      selectElement('el-1');
      selectElement('el-2', true);
      selectElement('el-1', true); // Toggle off
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).not.toContain('el-1');
      expect(selectedElementIds).toContain('el-2');
    });

    it('should not duplicate elements in selection', () => {
      const { selectElement, selectElements } = useCanvasStore.getState();
      
      selectElements(['el-1', 'el-2']);
      selectElement('el-1', true);
      selectElement('el-1', true);
      
      const { selectedElementIds } = useCanvasStore.getState();
      const el1Count = selectedElementIds.filter(id => id === 'el-1').length;
      expect(el1Count).toBeLessThanOrEqual(1);
    });
  });

  describe('selectElements', () => {
    it('should replace selection with new array', () => {
      const { selectElement, selectElements } = useCanvasStore.getState();
      
      selectElement('el-1');
      selectElements(['el-2', 'el-3']);
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).toEqual(['el-2', 'el-3']);
    });

    it('should handle empty array', () => {
      const { selectElement, selectElements } = useCanvasStore.getState();
      
      selectElement('el-1');
      selectElements([]);
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).toEqual([]);
    });
  });

  describe('clearSelection', () => {
    it('should clear all selected ids', () => {
      const { selectElements, clearSelection } = useCanvasStore.getState();
      
      selectElements(['el-1', 'el-2', 'el-3']);
      clearSelection();
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).toEqual([]);
    });
  });

  describe('copyElements', () => {
    it('should copy elements to clipboard', () => {
      const { copyElements } = useCanvasStore.getState();
      
      copyElements(['el-1', 'el-2']);
      
      const { clipboard } = useCanvasStore.getState();
      expect(clipboard).toHaveLength(2);
    });

    it('should deep clone elements', () => {
      const { copyElements, updateElement } = useCanvasStore.getState();
      
      copyElements(['el-1']);
      
      // Modify original
      updateElement('el-1', { position: { x: 999, y: 999 } });
      
      const { clipboard } = useCanvasStore.getState();
      expect(clipboard[0].position).toEqual({ x: 0, y: 0 });
    });

    it('should copy element properties correctly', () => {
      const { copyElements } = useCanvasStore.getState();
      
      copyElements(['el-1']);
      
      const { clipboard, elements } = useCanvasStore.getState();
      const original = elements.find(e => e.id === 'el-1');
      
      expect(clipboard[0].type).toBe(original?.type);
      expect(clipboard[0].size).toEqual(original?.size);
    });
  });

  describe('pasteElements', () => {
    it('should paste with offset +20', () => {
      const { copyElements, pasteElements } = useCanvasStore.getState();
      
      copyElements(['el-1']);
      const { clipboard } = useCanvasStore.getState();
      const originalPosition = { ...clipboard[0].position };
      
      pasteElements();
      
      const { elements } = useCanvasStore.getState();
      const pasted = elements[elements.length - 1];
      
      expect(pasted.position.x).toBe(originalPosition.x + 20);
      expect(pasted.position.y).toBe(originalPosition.y + 20);
    });

    it('should generate new ids', () => {
      const { copyElements, pasteElements } = useCanvasStore.getState();
      
      copyElements(['el-1']);
      pasteElements();
      
      const { elements } = useCanvasStore.getState();
      const ids = elements.map(e => e.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(elements.length);
    });

    it('should do nothing when clipboard empty', () => {
      const { pasteElements } = useCanvasStore.getState();
      
      const beforeCount = useCanvasStore.getState().elements.length;
      pasteElements();
      const afterCount = useCanvasStore.getState().elements.length;
      
      expect(afterCount).toBe(beforeCount);
    });

    it('should allow multiple pastes from same copy', () => {
      const { copyElements, pasteElements } = useCanvasStore.getState();
      
      const beforeCount = useCanvasStore.getState().elements.length;
      
      copyElements(['el-1']);
      pasteElements();
      pasteElements();
      pasteElements();
      
      const { elements } = useCanvasStore.getState();
      expect(elements.length).toBe(beforeCount + 3);
    });
  });

  describe('cutElements', () => {
    it('should copy and then delete', () => {
      const { cutElements } = useCanvasStore.getState();
      
      cutElements(['el-1', 'el-2']);
      
      const { elements, clipboard } = useCanvasStore.getState();
      
      expect(clipboard).toHaveLength(2);
      expect(elements.find(e => e.id === 'el-1')).toBeUndefined();
      expect(elements.find(e => e.id === 'el-2')).toBeUndefined();
      expect(elements.find(e => e.id === 'el-3')).toBeDefined();
    });

    it('should allow paste after cut', () => {
      const { cutElements, pasteElements } = useCanvasStore.getState();
      
      const beforeCount = useCanvasStore.getState().elements.length;
      
      cutElements(['el-1']);
      pasteElements();
      
      const { elements } = useCanvasStore.getState();
      // Cut 1, then paste 1 = same count
      expect(elements.length).toBe(beforeCount);
    });
  });
});
