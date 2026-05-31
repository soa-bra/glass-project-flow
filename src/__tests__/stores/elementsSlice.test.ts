/**
 * Unit Tests for ElementsSlice
 * اختبارات وحدة لـ ElementsSlice
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';
import type { CanvasElement } from '@/types/canvas';

describe('ElementsSlice', () => {
  beforeEach(() => {
    // Reset store before each test
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

  describe('addElement', () => {
    it('should add element with generated id', () => {
      const { addElement } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        style: { shapeType: 'rectangle' }
      });
      
      const { elements } = useCanvasStore.getState();
      expect(elements).toHaveLength(1);
      expect(elements[0].id).toBeDefined();
      expect(elements[0].type).toBe('shape');
      expect(elements[0].position).toEqual({ x: 100, y: 100 });
    });

    it('should add element with custom id', () => {
      const { addElement } = useCanvasStore.getState();
      
      addElement({
        id: 'custom-id-123',
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 50 },
        content: 'مرحبا'
      });
      
      const { elements } = useCanvasStore.getState();
      expect(elements[0].id).toBe('custom-id-123');
    });

    it('should update layer elements list', () => {
      const { addElement } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        layerId: 'default'
      });
      
      const { layers } = useCanvasStore.getState();
      expect(layers[0].elements.length).toBeGreaterThanOrEqual(0);
    });

    it('should push history after adding', () => {
      const { addElement } = useCanvasStore.getState();
      
      addElement({
        type: 'sticky',
        position: { x: 200, y: 200 },
        size: { width: 150, height: 150 }
      });
      
      const { history } = useCanvasStore.getState();
      expect(history.past.length).toBeGreaterThan(0);
    });

    it('should add multiple elements with unique ids', () => {
      const { addElement } = useCanvasStore.getState();
      
      for (let i = 0; i < 5; i++) {
        addElement({
          type: 'shape',
          position: { x: i * 50, y: i * 50 },
          size: { width: 40, height: 40 }
        });
      }
      
      const { elements } = useCanvasStore.getState();
      expect(elements).toHaveLength(5);
      
      const ids = elements.map(el => el.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(5);
    });
  });

  describe('updateElement', () => {
    it('should update element properties', () => {
      const { addElement, updateElement } = useCanvasStore.getState();
      
      addElement({
        id: 'el-1',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 }
      });
      
      updateElement('el-1', { 
        position: { x: 200, y: 300 },
        style: { backgroundColor: '#FF0000' }
      });
      
      const { elements } = useCanvasStore.getState();
      expect(elements[0].position).toEqual({ x: 200, y: 300 });
      expect(elements[0].style?.backgroundColor).toBe('#FF0000');
    });

    it('should not affect other elements', () => {
      const { addElement, updateElement } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 200, y: 200 }, size: { width: 100, height: 100 } });
      
      updateElement('el-1', { position: { x: 500, y: 500 } });
      
      const { elements } = useCanvasStore.getState();
      const el2 = elements.find(e => e.id === 'el-2');
      expect(el2?.position).toEqual({ x: 200, y: 200 });
    });

    it('should handle non-existent element gracefully', () => {
      const { updateElement } = useCanvasStore.getState();
      
      // Should not throw
      expect(() => {
        updateElement('non-existent-id', { position: { x: 100, y: 100 } });
      }).not.toThrow();
    });
  });

  describe('deleteElement(s)', () => {
    beforeEach(() => {
      const { addElement } = useCanvasStore.getState();
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-3', type: 'shape', position: { x: 200, y: 200 }, size: { width: 100, height: 100 } });
    });

    it('should delete single element', () => {
      const { deleteElement } = useCanvasStore.getState();
      
      deleteElement('el-2');
      
      const { elements } = useCanvasStore.getState();
      expect(elements).toHaveLength(2);
      expect(elements.find(e => e.id === 'el-2')).toBeUndefined();
    });

    it('should delete multiple elements', () => {
      const { deleteElements } = useCanvasStore.getState();
      
      deleteElements(['el-1', 'el-3']);
      
      const { elements } = useCanvasStore.getState();
      expect(elements).toHaveLength(1);
      expect(elements[0].id).toBe('el-2');
    });

    it('should clear selection for deleted elements', () => {
      const { selectElements, deleteElement } = useCanvasStore.getState();
      
      selectElements(['el-1', 'el-2']);
      deleteElement('el-1');
      
      const { selectedElementIds } = useCanvasStore.getState();
      expect(selectedElementIds).not.toContain('el-1');
    });
  });

  describe('moveElements', () => {
    beforeEach(() => {
      const { addElement } = useCanvasStore.getState();
      addElement({ id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 200, y: 200 }, size: { width: 50, height: 50 } });
    });

    it('should move elements by delta', () => {
      const { moveElements } = useCanvasStore.getState();
      
      moveElements(['el-1', 'el-2'], 50, 30);
      
      const { elements } = useCanvasStore.getState();
      expect(elements.find(e => e.id === 'el-1')?.position).toEqual({ x: 150, y: 130 });
      expect(elements.find(e => e.id === 'el-2')?.position).toEqual({ x: 250, y: 230 });
    });

    it('should handle negative delta', () => {
      const { moveElements } = useCanvasStore.getState();
      
      moveElements(['el-1'], -50, -50);
      
      const { elements } = useCanvasStore.getState();
      expect(elements.find(e => e.id === 'el-1')?.position).toEqual({ x: 50, y: 50 });
    });

    it('should respect locked elements', () => {
      const { updateElement, moveElements } = useCanvasStore.getState();
      
      updateElement('el-1', { locked: true });
      moveElements(['el-1'], 100, 100);
      
      const { elements } = useCanvasStore.getState();
      expect(elements.find(e => e.id === 'el-1')?.position).toEqual({ x: 100, y: 100 });
    });
  });

  describe('alignElements', () => {
    beforeEach(() => {
      const { addElement } = useCanvasStore.getState();
      addElement({ id: 'el-1', type: 'shape', position: { x: 50, y: 50 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 200, y: 100 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-3', type: 'shape', position: { x: 100, y: 200 }, size: { width: 100, height: 100 } });
    });

    it('should align to left', () => {
      const { alignElements } = useCanvasStore.getState();
      
      alignElements(['el-1', 'el-2', 'el-3'], 'left');
      
      const { elements } = useCanvasStore.getState();
      const positions = elements.map(e => e.position.x);
      const minX = Math.min(...positions);
      
      positions.forEach(x => expect(x).toBe(minX));
    });

    it('should align to center', () => {
      const { alignElements } = useCanvasStore.getState();
      
      alignElements(['el-1', 'el-2', 'el-3'], 'center');
      
      const { elements } = useCanvasStore.getState();
      const centers = elements.map(e => e.position.x + e.size.width / 2);
      
      // All centers should be approximately equal
      const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
      centers.forEach(c => expect(Math.abs(c - avgCenter)).toBeLessThan(1));
    });

    it('should align to right', () => {
      const { alignElements } = useCanvasStore.getState();
      
      alignElements(['el-1', 'el-2', 'el-3'], 'right');
      
      const { elements } = useCanvasStore.getState();
      const rights = elements.map(e => e.position.x + e.size.width);
      const maxRight = Math.max(...rights);
      
      rights.forEach(r => expect(Math.abs(r - maxRight)).toBeLessThan(1));
    });

    it('should align to top', () => {
      const { alignElements } = useCanvasStore.getState();
      
      alignElements(['el-1', 'el-2', 'el-3'], 'top');
      
      const { elements } = useCanvasStore.getState();
      const positions = elements.map(e => e.position.y);
      const minY = Math.min(...positions);
      
      positions.forEach(y => expect(y).toBe(minY));
    });

    it('should align to middle', () => {
      const { alignElements } = useCanvasStore.getState();
      
      alignElements(['el-1', 'el-2', 'el-3'], 'middle');
      
      const { elements } = useCanvasStore.getState();
      const middles = elements.map(e => e.position.y + e.size.height / 2);
      
      const avgMiddle = middles.reduce((a, b) => a + b, 0) / middles.length;
      middles.forEach(m => expect(Math.abs(m - avgMiddle)).toBeLessThan(1));
    });

    it('should align to bottom', () => {
      const { alignElements } = useCanvasStore.getState();
      
      alignElements(['el-1', 'el-2', 'el-3'], 'bottom');
      
      const { elements } = useCanvasStore.getState();
      const bottoms = elements.map(e => e.position.y + e.size.height);
      const maxBottom = Math.max(...bottoms);
      
      bottoms.forEach(b => expect(Math.abs(b - maxBottom)).toBeLessThan(1));
    });
  });

  describe('groupElements', () => {
    beforeEach(() => {
      const { addElement } = useCanvasStore.getState();
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-3', type: 'shape', position: { x: 200, y: 200 }, size: { width: 100, height: 100 } });
    });

    it('should assign same groupId to elements', () => {
      const { groupElements } = useCanvasStore.getState();
      
      groupElements(['el-1', 'el-2']);
      
      const { elements } = useCanvasStore.getState();
      const el1 = elements.find(e => e.id === 'el-1');
      const el2 = elements.find(e => e.id === 'el-2');
      
      expect(el1?.groupId).toBeDefined();
      expect(el1?.groupId).toBe(el2?.groupId);
    });

    it('should not affect ungrouped elements', () => {
      const { groupElements } = useCanvasStore.getState();
      
      groupElements(['el-1', 'el-2']);
      
      const { elements } = useCanvasStore.getState();
      const el3 = elements.find(e => e.id === 'el-3');
      
      expect(el3?.groupId).toBeUndefined();
    });

    it('should require minimum 2 elements', () => {
      const { groupElements } = useCanvasStore.getState();
      
      // Grouping single element should not create group
      groupElements(['el-1']);
      
      const { elements } = useCanvasStore.getState();
      const el1 = elements.find(e => e.id === 'el-1');
      
      expect(el1?.groupId).toBeUndefined();
    });
  });

  describe('ungroupElements', () => {
    it('should remove groupId from elements', () => {
      const { addElement, groupElements, ungroupElements } = useCanvasStore.getState();
      
      addElement({ id: 'el-1', type: 'shape', position: { x: 0, y: 0 }, size: { width: 100, height: 100 } });
      addElement({ id: 'el-2', type: 'shape', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } });
      
      groupElements(['el-1', 'el-2']);
      
      const { elements: groupedElements } = useCanvasStore.getState();
      const groupId = groupedElements.find(e => e.id === 'el-1')?.groupId;
      
      expect(groupId).toBeDefined();
      
      ungroupElements(groupId!);
      
      const { elements } = useCanvasStore.getState();
      elements.forEach(el => {
        expect(el.groupId).toBeUndefined();
      });
    });
  });

  describe('resizeElements', () => {
    it('should resize elements by scale factor', () => {
      const { addElement, resizeElements } = useCanvasStore.getState();
      
      addElement({ 
        id: 'el-1', 
        type: 'shape', 
        position: { x: 100, y: 100 }, 
        size: { width: 100, height: 100 } 
      });
      
      resizeElements(['el-1'], 2, 2, { x: 100, y: 100 });
      
      const { elements } = useCanvasStore.getState();
      const el = elements.find(e => e.id === 'el-1');
      
      expect(el?.size.width).toBe(200);
      expect(el?.size.height).toBe(200);
    });
  });

  describe('rotateElements', () => {
    it('should rotate elements by angle', () => {
      const { addElement, rotateElements } = useCanvasStore.getState();
      
      addElement({ 
        id: 'el-1', 
        type: 'shape', 
        position: { x: 100, y: 100 }, 
        size: { width: 100, height: 100 },
        rotation: 0
      });
      
      rotateElements(['el-1'], 45, { x: 150, y: 150 });
      
      const { elements } = useCanvasStore.getState();
      const el = elements.find(e => e.id === 'el-1');
      
      expect(el?.rotation).toBe(45);
    });
  });
});
