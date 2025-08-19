import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '@/types/canvas';

export interface ElementCreationController {
  createTextElement: (x: number, y: number, snapEnabled: boolean) => void;
  createShapeElement: (x: number, y: number, snapEnabled: boolean) => void;
  createStickyElement: (x: number, y: number, snapEnabled: boolean) => void;
  createSmartElement: (x: number, y: number, type: string, snapEnabled: boolean) => void;
}

export const useElementCreationTool = (
  addElement: (element: any) => void,
  selectedSmartElement?: string
): ElementCreationController => {
  
  const snapToGrid = (value: number, snapEnabled: boolean) => {
    return snapEnabled ? Math.round(value / 20) * 20 : value;
  };

  const createTextElement = useCallback((x: number, y: number, snapEnabled: boolean) => {
    const element = {
      id: uuidv4(),
      type: 'text' as const,
      position: { x: snapToGrid(x, snapEnabled), y: snapToGrid(y, snapEnabled) },
      size: { width: 200, height: 40 },
      content: 'نص جديد',
      style: { 
        fontSize: 16, 
        color: '#000000',
        fontFamily: 'Arial'
      }
    };
    addElement(element);
  }, [addElement]);

  const createShapeElement = useCallback((x: number, y: number, snapEnabled: boolean) => {
    const element = {
      id: uuidv4(),
      type: 'shape' as const,
      position: { x: snapToGrid(x, snapEnabled), y: snapToGrid(y, snapEnabled) },
      size: { width: 100, height: 100 },
      style: { 
        fill: '#3b82f6', 
        stroke: '#1e40af', 
        strokeWidth: 2,
        shape: 'rectangle'
      }
    };
    addElement(element);
  }, [addElement]);

  const createStickyElement = useCallback((x: number, y: number, snapEnabled: boolean) => {
    const element = {
      id: uuidv4(),
      type: 'sticky' as const,
      position: { x: snapToGrid(x, snapEnabled), y: snapToGrid(y, snapEnabled) },
      size: { width: 200, height: 150 },
      content: 'ملاحظة جديدة',
      style: { 
        backgroundColor: '#fef08a', 
        color: '#854d0e',
        padding: '12px',
        borderRadius: '8px'
      }
    };
    addElement(element);
  }, [addElement]);

  const createSmartElement = useCallback((x: number, y: number, type: string, snapEnabled: boolean) => {
    const element = {
      id: uuidv4(),
      type: 'smart-element' as const,
      position: { x: snapToGrid(x, snapEnabled), y: snapToGrid(y, snapEnabled) },
      size: { width: 300, height: 200 },
      data: {
        smartElementType: type || selectedSmartElement || 'think_board'
      },
      style: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: '12px'
      }
    };
    addElement(element);
  }, [addElement, selectedSmartElement]);

  return {
    createTextElement,
    createShapeElement,
    createStickyElement,
    createSmartElement
  };
};