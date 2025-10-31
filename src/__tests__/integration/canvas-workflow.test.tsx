import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvasStore';

describe('Canvas Integration Tests - Complete Workflows', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      elements: [],
      selectedElementIds: [],
      clipboard: [],
      history: { past: [], future: [] },
      activeTool: 'selection_tool'
    });
  });

  describe('Complete Design Workflow', () => {
    it('should complete a full text creation and editing workflow', () => {
      const store = useCanvasStore.getState();
      
      // 1. Activate text tool
      store.setActiveTool('text_tool');
      expect(useCanvasStore.getState().activeTool).toBe('text_tool');
      
      // 2. Create text element
      store.addElement({
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'مرحباً بك',
        layerId: 'default',
        visible: true
      });
      
      let elements = useCanvasStore.getState().elements;
      expect(elements).toHaveLength(1);
      expect(elements[0].type).toBe('text');
      
      // 3. Select and modify text
      store.selectElement(elements[0].id);
      store.updateElement(elements[0].id, { 
        content: 'نص محدّث',
        style: { ...elements[0].style, fontSize: 24 }
      });
      
      elements = useCanvasStore.getState().elements;
      expect(elements[0].content).toBe('نص محدّث');
      expect(elements[0].style?.fontSize).toBe(24);
      
      // 4. Duplicate the text
      store.duplicateElement(elements[0].id);
      elements = useCanvasStore.getState().elements;
      expect(elements).toHaveLength(2);
      
      // 5. Undo and verify
      store.undo();
      expect(useCanvasStore.getState().elements).toHaveLength(1);
    });

    it('should complete a shape drawing and alignment workflow', () => {
      const store = useCanvasStore.getState();
      
      // 1. Activate shapes tool
      store.setActiveTool('shapes_tool');
      
      // 2. Draw multiple shapes
      store.addElement({
        type: 'shape',
        position: { x: 50, y: 100 },
        size: { width: 100, height: 100 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      
      store.addElement({
        type: 'shape',
        position: { x: 200, y: 150 },
        size: { width: 80, height: 80 },
        shapeType: 'circle',
        layerId: 'default',
        visible: true
      });
      
      store.addElement({
        type: 'shape',
        position: { x: 350, y: 120 },
        size: { width: 90, height: 90 },
        shapeType: 'triangle',
        layerId: 'default',
        visible: true
      });
      
      let elements = useCanvasStore.getState().elements;
      expect(elements).toHaveLength(3);
      
      // 3. Select all shapes
      const elementIds = elements.map(el => el.id);
      store.selectElements(elementIds);
      expect(useCanvasStore.getState().selectedElementIds).toHaveLength(3);
      
      // 4. Align to top
      store.alignElements(elementIds, 'top');
      elements = useCanvasStore.getState().elements;
      
      const topY = elements[0].position.y;
      elements.forEach(el => {
        expect(el.position.y).toBe(topY);
      });
      
      // 5. Group elements
      store.groupElements(elementIds);
      elements = useCanvasStore.getState().elements;
      const groupId = elements[0].metadata?.groupId;
      
      expect(groupId).toBeDefined();
      elements.forEach(el => {
        expect(el.metadata?.groupId).toBe(groupId);
      });
    });

    it('should complete a multi-element copy/paste/delete workflow', () => {
      const store = useCanvasStore.getState();
      
      // 1. Create multiple elements
      for (let i = 0; i < 5; i++) {
        store.addElement({
          type: 'shape',
          position: { x: i * 80, y: 100 },
          size: { width: 60, height: 60 },
          shapeType: i % 2 === 0 ? 'rectangle' : 'circle',
          layerId: 'default',
          visible: true
        });
      }
      
      expect(useCanvasStore.getState().elements).toHaveLength(5);
      
      // 2. Select first 3 elements
      const elementIds = useCanvasStore.getState().elements.slice(0, 3).map(el => el.id);
      store.selectElements(elementIds);
      
      // 3. Copy selected elements
      store.copyElements(elementIds);
      
      // 4. Paste (should create duplicates)
      store.pasteElements();
      expect(useCanvasStore.getState().elements).toHaveLength(8);
      
      // 5. Delete original selected elements
      store.deleteElements(elementIds);
      expect(useCanvasStore.getState().elements).toHaveLength(5);
      
      // 6. Undo delete
      store.undo();
      expect(useCanvasStore.getState().elements).toHaveLength(8);
      
      // 7. Redo delete
      store.redo();
      expect(useCanvasStore.getState().elements).toHaveLength(5);
    });

    it('should handle layer operations with elements', () => {
      const store = useCanvasStore.getState();
      
      // 1. Add a new layer
      store.addLayer('طبقة التصميم');
      const layers = useCanvasStore.getState().layers;
      expect(layers).toHaveLength(2);
      
      const designLayerId = layers[1].id;
      
      // 2. Set active layer
      store.setActiveLayer(designLayerId);
      expect(useCanvasStore.getState().activeLayerId).toBe(designLayerId);
      
      // 3. Add elements to new layer
      store.addElement({
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'عنصر في الطبقة الجديدة',
        layerId: designLayerId,
        visible: true
      });
      
      store.addElement({
        type: 'shape',
        position: { x: 150, y: 200 },
        size: { width: 100, height: 100 },
        shapeType: 'rectangle',
        layerId: designLayerId,
        visible: true
      });
      
      const elements = useCanvasStore.getState().elements;
      expect(elements.filter(el => el.layerId === designLayerId)).toHaveLength(2);
      
      // 4. Toggle layer visibility
      store.toggleLayerVisibility(designLayerId);
      expect(useCanvasStore.getState().layers.find(l => l.id === designLayerId)?.visible).toBe(false);
      
      // 5. Toggle layer lock
      store.toggleLayerLock(designLayerId);
      expect(useCanvasStore.getState().layers.find(l => l.id === designLayerId)?.locked).toBe(true);
    });

    it('should handle smart element workflow', () => {
      const store = useCanvasStore.getState();
      
      // 1. Activate smart element tool
      store.setActiveTool('smart_element_tool');
      
      // 2. Select a smart element type
      store.setSelectedSmartElement('kanban_board');
      expect(useCanvasStore.getState().selectedSmartElement).toBe('kanban_board');
      
      // 3. Add smart element to canvas
      store.addElement({
        type: 'smart_element',
        position: { x: 200, y: 200 },
        size: { width: 600, height: 400 },
        smartType: 'kanban_board',
        layerId: 'default',
        visible: true
      });
      
      const elements = useCanvasStore.getState().elements;
      expect(elements).toHaveLength(1);
      expect(elements[0].type).toBe('smart_element');
      expect(elements[0].smartType).toBe('kanban_board');
    });

    it('should handle file upload workflow', () => {
      const store = useCanvasStore.getState();
      
      // 1. Activate file uploader
      store.setActiveTool('file_uploader');
      
      // 2. Simulate image upload
      store.addElement({
        type: 'image',
        position: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
        src: 'data:image/png;base64,test',
        alt: 'test-image.png',
        layerId: 'default',
        visible: true
      });
      
      // 3. Simulate file upload
      store.addElement({
        type: 'file',
        position: { x: 450, y: 100 },
        size: { width: 250, height: 120 },
        fileName: 'document.pdf',
        fileType: 'application/pdf',
        fileSize: 1024000,
        fileUrl: 'blob:test',
        layerId: 'default',
        visible: true
      });
      
      const elements = useCanvasStore.getState().elements;
      expect(elements).toHaveLength(2);
      expect(elements[0].type).toBe('image');
      expect(elements[1].type).toBe('file');
    });

    it('should handle complex undo/redo scenario', () => {
      const store = useCanvasStore.getState();
      
      // 1. Add element
      store.addElement({
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 100, height: 100 },
        shapeType: 'rectangle',
        layerId: 'default',
        visible: true
      });
      
      // 2. Update element
      const elementId = useCanvasStore.getState().elements[0].id;
      store.updateElement(elementId, { 
        position: { x: 200, y: 200 },
        size: { width: 150, height: 150 }
      });
      
      // 3. Duplicate element
      store.duplicateElement(elementId);
      
      // 4. Add another element
      store.addElement({
        type: 'text',
        position: { x: 400, y: 100 },
        size: { width: 200, height: 50 },
        content: 'نص تجريبي',
        layerId: 'default',
        visible: true
      });
      
      expect(useCanvasStore.getState().elements).toHaveLength(3);
      
      // 5. Undo last action (remove text)
      store.undo();
      expect(useCanvasStore.getState().elements).toHaveLength(2);
      
      // 6. Undo (remove duplicate)
      store.undo();
      expect(useCanvasStore.getState().elements).toHaveLength(1);
      
      // 7. Redo (add duplicate back)
      store.redo();
      expect(useCanvasStore.getState().elements).toHaveLength(2);
      
      // 8. Redo (add text back)
      store.redo();
      expect(useCanvasStore.getState().elements).toHaveLength(3);
    });
  });
});
