/**
 * @fileoverview Smart element creation and management hook
 * @author AI Assistant
 * @version 1.0.0
 */

import { useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';

export const useSmartElements = (
  addElement: (element: CanvasElement) => void,
  selectedLayerId: string | null,
  layers: any[]
) => {
  const handleAddSmartElement = useCallback((type: string, config: any) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: 'smart-element' as const,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      rotation: 0,
      layerId: selectedLayerId || layers[0]?.id || 'default',
      style: {
        fillColor: '#f0f0f0',
        borderColor: '#000000',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        opacity: 1
      },
      locked: false,
      visible: true,
      data: config
    };
    
    addElement(newElement);
  }, [addElement, selectedLayerId, layers]);

  return {
    handleAddSmartElement
  };
};