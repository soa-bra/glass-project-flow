import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useCanvasManipulation = (
  selectedElements: string[],
  elements: CanvasElement[],
  updateElement: (elementId: string, updates: any) => void
) => {
  // Enhanced selection handlers
  const handleCopy = useCallback(() => {
    if (selectedElements.length > 0) {
      // TODO: Implement copy functionality
    }
  }, [selectedElements]);

  const handleCut = useCallback(() => {
    if (selectedElements.length > 0) {
      // TODO: Implement cut functionality
    }
  }, [selectedElements]);

  const handlePaste = useCallback(() => {
    // TODO: Implement paste functionality
  }, []);

  const handleDuplicate = useCallback(() => {
    if (selectedElements.length > 0) {
      // TODO: Implement duplicate functionality
    }
  }, [selectedElements]);

  const handleFlipHorizontal = useCallback(() => {
    selectedElements.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        updateElement(elementId, {
          style: { ...element.style, transform: 'scaleX(-1)' }
        });
      }
    });
  }, [selectedElements, elements, updateElement]);

  const handleFlipVertical = useCallback(() => {
    selectedElements.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        updateElement(elementId, {
          style: { ...element.style, transform: 'scaleY(-1)' }
        });
      }
    });
  }, [selectedElements, elements, updateElement]);

  const handleRotate = useCallback((angle: number) => {
    selectedElements.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        const currentRotation = parseFloat(element.style?.rotation || '0');
        updateElement(elementId, {
          style: { ...element.style, rotation: `${currentRotation + angle}deg` }
        });
      }
    });
  }, [selectedElements, elements, updateElement]);

  const handleAlign = useCallback((type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElements.length < 2) return;
    
    const selectedElementObjects = selectedElements
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean) as CanvasElement[];
    
    if (selectedElementObjects.length < 2) return;

    // Calculate alignment position
    let alignPosition = 0;
    switch (type) {
      case 'left':
        alignPosition = Math.min(...selectedElementObjects.map(el => el.position.x));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, x: alignPosition } });
        });
        break;
      case 'right':
        alignPosition = Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, x: alignPosition - el.size.width } });
        });
        break;
      case 'center':
        const centerX = (Math.min(...selectedElementObjects.map(el => el.position.x)) + 
                        Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width))) / 2;
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, x: centerX - el.size.width / 2 } });
        });
        break;
      case 'top':
        alignPosition = Math.min(...selectedElementObjects.map(el => el.position.y));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, y: alignPosition } });
        });
        break;
      case 'bottom':
        alignPosition = Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height));
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, y: alignPosition - el.size.height } });
        });
        break;
      case 'middle':
        const centerY = (Math.min(...selectedElementObjects.map(el => el.position.y)) + 
                        Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height))) / 2;
        selectedElementObjects.forEach(el => {
          updateElement(el.id, { position: { ...el.position, y: centerY - el.size.height / 2 } });
        });
        break;
    }
  }, [selectedElements, elements, updateElement]);

  const handleDistribute = useCallback((type: 'horizontal' | 'vertical') => {
    if (selectedElements.length < 3) return;
    
    const selectedElementObjects = selectedElements
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean) as CanvasElement[];
    
    if (selectedElementObjects.length < 3) return;

    if (type === 'horizontal') {
      selectedElementObjects.sort((a, b) => a.position.x - b.position.x);
      const totalWidth = Math.max(...selectedElementObjects.map(el => el.position.x + el.size.width)) - 
                        Math.min(...selectedElementObjects.map(el => el.position.x));
      const spacing = totalWidth / (selectedElementObjects.length - 1);
      
      selectedElementObjects.forEach((el, index) => {
        if (index > 0 && index < selectedElementObjects.length - 1) {
          const newX = selectedElementObjects[0].position.x + (spacing * index);
          updateElement(el.id, { position: { ...el.position, x: newX } });
        }
      });
    } else {
      selectedElementObjects.sort((a, b) => a.position.y - b.position.y);
      const totalHeight = Math.max(...selectedElementObjects.map(el => el.position.y + el.size.height)) - 
                         Math.min(...selectedElementObjects.map(el => el.position.y));
      const spacing = totalHeight / (selectedElementObjects.length - 1);
      
      selectedElementObjects.forEach((el, index) => {
        if (index > 0 && index < selectedElementObjects.length - 1) {
          const newY = selectedElementObjects[0].position.y + (spacing * index);
          updateElement(el.id, { position: { ...el.position, y: newY } });
        }
      });
    }
  }, [selectedElements, elements, updateElement]);

  return {
    handleCopy,
    handleCut,
    handlePaste,
    handleDuplicate,
    handleFlipHorizontal,
    handleFlipVertical,
    handleRotate,
    handleAlign,
    handleDistribute,
  };
};