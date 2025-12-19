/**
 * Unit Tests for ViewportSlice
 * اختبارات وحدة لـ ViewportSlice
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/stores/canvas';

describe('ViewportSlice', () => {
  beforeEach(() => {
    // Reset viewport state
    useCanvasStore.setState({
      viewport: { zoom: 1, pan: { x: 0, y: 0 } },
      settings: {
        zoom: 1,
        pan: { x: 0, y: 0 },
        gridEnabled: true,
        snapToGrid: false,
        gridSize: 20,
        gridType: 'grid',
        snapToEdges: true,
        snapToCenter: true,
        snapToDistribution: false,
        background: '#FFFFFF',
        theme: 'light'
      },
      isPanMode: false,
      isFullscreen: false,
      showMinimap: false,
      elements: []
    });
  });

  describe('setZoom', () => {
    it('should set zoom to specified value', () => {
      const { setZoom } = useCanvasStore.getState();
      
      setZoom(1.5);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(1.5);
    });

    it('should clamp zoom to minimum 0.1', () => {
      const { setZoom } = useCanvasStore.getState();
      
      setZoom(0.05);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(0.1);
    });

    it('should clamp zoom to maximum 5', () => {
      const { setZoom } = useCanvasStore.getState();
      
      setZoom(10);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(5);
    });

    it('should update both viewport and settings', () => {
      const { setZoom } = useCanvasStore.getState();
      
      setZoom(2);
      
      const { viewport, settings } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(2);
      expect(settings.zoom).toBe(2);
    });
  });

  describe('setPan', () => {
    it('should update pan position', () => {
      const { setPan } = useCanvasStore.getState();
      
      setPan(100, 200);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.pan).toEqual({ x: 100, y: 200 });
    });

    it('should allow negative pan values', () => {
      const { setPan } = useCanvasStore.getState();
      
      setPan(-500, -300);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.pan).toEqual({ x: -500, y: -300 });
    });

    it('should update both viewport and settings', () => {
      const { setPan } = useCanvasStore.getState();
      
      setPan(150, 250);
      
      const { viewport, settings } = useCanvasStore.getState();
      expect(viewport.pan).toEqual({ x: 150, y: 250 });
      expect(settings.pan).toEqual({ x: 150, y: 250 });
    });
  });

  describe('resetViewport', () => {
    it('should reset zoom and pan to defaults', () => {
      const { setZoom, setPan, resetViewport } = useCanvasStore.getState();
      
      setZoom(3);
      setPan(500, 500);
      resetViewport();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(1);
      expect(viewport.pan).toEqual({ x: 0, y: 0 });
    });
  });

  describe('zoomIn', () => {
    it('should increase zoom by 1.2x', () => {
      const { zoomIn } = useCanvasStore.getState();
      
      zoomIn();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBeCloseTo(1.2, 1);
    });

    it('should not exceed maximum zoom', () => {
      const { setZoom, zoomIn } = useCanvasStore.getState();
      
      setZoom(4.5);
      zoomIn();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBeLessThanOrEqual(5);
    });

    it('should compound correctly', () => {
      const { zoomIn } = useCanvasStore.getState();
      
      zoomIn();
      zoomIn();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBeCloseTo(1.44, 1);
    });
  });

  describe('zoomOut', () => {
    it('should decrease zoom by 1.2x', () => {
      const { zoomOut } = useCanvasStore.getState();
      
      zoomOut();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBeCloseTo(0.833, 2);
    });

    it('should not go below minimum zoom', () => {
      const { setZoom, zoomOut } = useCanvasStore.getState();
      
      setZoom(0.15);
      zoomOut();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('zoomToFit', () => {
    it('should reset viewport when no elements', () => {
      const { setPan, setZoom, zoomToFit } = useCanvasStore.getState();
      
      setPan(500, 500);
      setZoom(3);
      zoomToFit();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(1);
      expect(viewport.pan).toEqual({ x: 0, y: 0 });
    });

    it('should fit elements in view', () => {
      const { addElement, zoomToFit } = useCanvasStore.getState();
      
      // Add elements spread across the canvas
      addElement({ 
        type: 'shape', 
        position: { x: 0, y: 0 }, 
        size: { width: 100, height: 100 } 
      });
      addElement({ 
        type: 'shape', 
        position: { x: 500, y: 500 }, 
        size: { width: 100, height: 100 } 
      });
      
      zoomToFit();
      
      const { viewport } = useCanvasStore.getState();
      // Zoom should be adjusted
      expect(viewport.zoom).toBeLessThanOrEqual(1);
      expect(viewport.zoom).toBeGreaterThan(0);
    });

    it('should not exceed 100% zoom', () => {
      const { addElement, zoomToFit } = useCanvasStore.getState();
      
      // Add a small element
      addElement({ 
        type: 'shape', 
        position: { x: 100, y: 100 }, 
        size: { width: 50, height: 50 } 
      });
      
      zoomToFit();
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBeLessThanOrEqual(1);
    });
  });

  describe('setZoomPercentage', () => {
    it('should convert percentage to zoom value', () => {
      const { setZoomPercentage } = useCanvasStore.getState();
      
      setZoomPercentage(150);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(1.5);
    });

    it('should handle 50% zoom', () => {
      const { setZoomPercentage } = useCanvasStore.getState();
      
      setZoomPercentage(50);
      
      const { viewport } = useCanvasStore.getState();
      expect(viewport.zoom).toBe(0.5);
    });
  });

  describe('updateSettings', () => {
    it('should update partial settings', () => {
      const { updateSettings } = useCanvasStore.getState();
      
      updateSettings({ gridSize: 40, background: '#F0F0F0' });
      
      const { settings } = useCanvasStore.getState();
      expect(settings.gridSize).toBe(40);
      expect(settings.background).toBe('#F0F0F0');
      expect(settings.gridEnabled).toBe(true); // Unchanged
    });
  });

  describe('toggleGrid', () => {
    it('should toggle grid visibility', () => {
      const { toggleGrid } = useCanvasStore.getState();
      
      expect(useCanvasStore.getState().settings.gridEnabled).toBe(true);
      
      toggleGrid();
      expect(useCanvasStore.getState().settings.gridEnabled).toBe(false);
      
      toggleGrid();
      expect(useCanvasStore.getState().settings.gridEnabled).toBe(true);
    });
  });

  describe('toggleSnapToGrid', () => {
    it('should toggle snap setting', () => {
      const { toggleSnapToGrid } = useCanvasStore.getState();
      
      expect(useCanvasStore.getState().settings.snapToGrid).toBe(false);
      
      toggleSnapToGrid();
      expect(useCanvasStore.getState().settings.snapToGrid).toBe(true);
      
      toggleSnapToGrid();
      expect(useCanvasStore.getState().settings.snapToGrid).toBe(false);
    });
  });

  describe('togglePanMode', () => {
    it('should toggle pan mode', () => {
      const { togglePanMode } = useCanvasStore.getState();
      
      expect(useCanvasStore.getState().isPanMode).toBe(false);
      
      togglePanMode();
      expect(useCanvasStore.getState().isPanMode).toBe(true);
      
      togglePanMode();
      expect(useCanvasStore.getState().isPanMode).toBe(false);
    });
  });

  describe('toggleMinimap', () => {
    it('should toggle minimap visibility', () => {
      const { toggleMinimap } = useCanvasStore.getState();
      
      expect(useCanvasStore.getState().showMinimap).toBe(false);
      
      toggleMinimap();
      expect(useCanvasStore.getState().showMinimap).toBe(true);
      
      toggleMinimap();
      expect(useCanvasStore.getState().showMinimap).toBe(false);
    });
  });
});
