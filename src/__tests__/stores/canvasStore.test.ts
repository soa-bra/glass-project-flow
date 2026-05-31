import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';

describe('Canvas Store - Basic Operations', () => {
  beforeEach(() => {
    // Reset store before each test
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      clipboard: [],
      history: { past: [], future: [] }
    });
  });

  describe('Element Operations', () => {
    it('should add a text element', () => {
      const { addElement, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'نص تجريبي',
        layerId: 'default',
        visible: true
      });

      expect(elements).toHaveLength(1);
      expect(elements[0].type).toBe('text');
      expect(elements[0].content).toBe('نص تجريبي');
    });

    it('should add multiple shapes', () => {
      const { addElement, elements } = useCanvasStore.getState();
      
      // Add rectangle
      addElement({
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      // Add circle
      addElement({
        type: 'shape',
        position: { x: 200, y: 50 },
        size: { width: 80, height: 80 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      expect(elements).toHaveLength(2);
      expect(elements[0].shapeType).toBe('rectangle');
      expect(elements[1].shapeType).toBe('circle');
    });

    it('should update element properties', () => {
      const { addElement, updateElement, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'نص أولي',
        layerId: 'default',
        visible: true
      });

      const elementId = elements[0].id;
      updateElement(elementId, { content: 'نص محدّث' });

      expect(useCanvasStore.getState().elements[0].content).toBe('نص محدّث');
    });

    it('should delete element', () => {
      const { addElement, deleteElement, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      const elementId = elements[0].id;
      deleteElement(elementId);

      expect(useCanvasStore.getState().elements).toHaveLength(0);
    });

    it('should duplicate element', () => {
      const { addElement, duplicateElement, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'نص للنسخ',
        layerId: 'default',
        visible: true
      });

      const elementId = elements[0].id;
      duplicateElement(elementId);

      const newElements = useCanvasStore.getState().elements;
      expect(newElements).toHaveLength(2);
      expect(newElements[1].content).toBe('نص للنسخ');
      expect(newElements[1].position.x).toBe(110);
      expect(newElements[1].position.y).toBe(110);
    });
  });

  describe('Selection Operations', () => {
    it('should select single element', () => {
      const { addElement, selectElement, elements, selectedElementIds } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      selectElement(elements[0].id);
      expect(useCanvasStore.getState().selectedElementIds).toHaveLength(1);
    });

    it('should select multiple elements', () => {
      const { addElement, selectElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      addElement({
        type: 'shape',
        position: { x: 100, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      selectElements([elements[0].id, elements[1].id]);
      expect(useCanvasStore.getState().selectedElementIds).toHaveLength(2);
    });

    it('should clear selection', () => {
      const { addElement, selectElement, clearSelection, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      selectElement(elements[0].id);
      clearSelection();
      
      expect(useCanvasStore.getState().selectedElementIds).toHaveLength(0);
    });
  });

  describe('Clipboard Operations', () => {
    it('should copy and paste elements', () => {
      const { addElement, selectElement, copyElements, pasteElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'نص للنسخ',
        layerId: 'default',
        visible: true
      });

      const elementId = elements[0].id;
      selectElement(elementId);
      copyElements([elementId]);
      pasteElements();

      const newElements = useCanvasStore.getState().elements;
      expect(newElements).toHaveLength(2);
      expect(newElements[1].content).toBe('نص للنسخ');
    });

    it('should cut and paste elements', () => {
      const { addElement, selectElement, cutElements, pasteElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      const elementId = elements[0].id;
      selectElement(elementId);
      cutElements([elementId]);
      
      expect(useCanvasStore.getState().elements).toHaveLength(0);
      
      pasteElements();
      expect(useCanvasStore.getState().elements).toHaveLength(1);
    });
  });

  describe('Grouping Operations', () => {
    it('should group multiple elements', () => {
      const { addElement, selectElements, groupElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      addElement({
        type: 'shape',
        position: { x: 100, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      const elementIds = [elements[0].id, elements[1].id];
      selectElements(elementIds);
      groupElements(elementIds);

      const updatedElements = useCanvasStore.getState().elements;
      expect(updatedElements[0].metadata?.groupId).toBeDefined();
      expect(updatedElements[0].metadata?.groupId).toBe(updatedElements[1].metadata?.groupId);
    });

    it('should ungroup elements', () => {
      const { addElement, selectElements, groupElements, ungroupElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      addElement({
        type: 'shape',
        position: { x: 100, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      const elementIds = [elements[0].id, elements[1].id];
      groupElements(elementIds);

      const groupId = useCanvasStore.getState().elements[0].metadata?.groupId!;
      ungroupElements(groupId);

      const updatedElements = useCanvasStore.getState().elements;
      expect(updatedElements[0].metadata?.groupId).toBeUndefined();
      expect(updatedElements[1].metadata?.groupId).toBeUndefined();
    });
  });

  describe('History Operations', () => {
    it('should undo element addition', () => {
      const { addElement, undo, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      expect(elements).toHaveLength(1);
      
      undo();
      expect(useCanvasStore.getState().elements).toHaveLength(0);
    });

    it('should redo element addition', () => {
      const { addElement, undo, redo } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      undo();
      redo();
      
      expect(useCanvasStore.getState().elements).toHaveLength(1);
    });
  });

  describe('Alignment Operations', () => {
    it('should align elements to left', () => {
      const { addElement, selectElements, alignElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 50, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      addElement({
        type: 'shape',
        position: { x: 200, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      const elementIds = [elements[0].id, elements[1].id];
      selectElements(elementIds);
      alignElements(elementIds, 'left');

      const updatedElements = useCanvasStore.getState().elements;
      expect(updatedElements[0].position.x).toBe(50);
      expect(updatedElements[1].position.x).toBe(50);
    });

    it('should align elements to top', () => {
      const { addElement, selectElements, alignElements, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 50 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      addElement({
        type: 'shape',
        position: { x: 0, y: 200 },
        size: { width: 50, height: 50 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });

      const elementIds = [elements[0].id, elements[1].id];
      selectElements(elementIds);
      alignElements(elementIds, 'top');

      const updatedElements = useCanvasStore.getState().elements;
      expect(updatedElements[0].position.y).toBe(50);
      expect(updatedElements[1].position.y).toBe(50);
    });
  });

  describe('Layer Operations', () => {
    it('should toggle layer visibility', () => {
      const { addElement, toggleLayerVisibility, elements } = useCanvasStore.getState();
      
      addElement({
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });

      toggleLayerVisibility('default');
      
      const layers = useCanvasStore.getState().layers;
      expect(layers[0].visible).toBe(false);
    });

    it('should toggle layer lock', () => {
      const { toggleLayerLock } = useCanvasStore.getState();
      
      toggleLayerLock('default');
      
      const layers = useCanvasStore.getState().layers;
      expect(layers[0].locked).toBe(true);
    });
  });
});
