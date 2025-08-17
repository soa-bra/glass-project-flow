
import { useCallback } from 'react';
import { CanvasElement } from '../types';
import { toNumber } from '@/utils/canvasUtils';

const GRID_SIZE = 20;

interface UseCanvasElementActionsProps {
  selectedElementIds: string[];
  elements: CanvasElement[];
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  addElement: (type: string, x: number, y: number, width?: number, height?: number) => void;
}

export const useCanvasElementActions = ({
  selectedElementIds,
  elements,
  updateElement,
  deleteElement,
  addElement
}: UseCanvasElementActionsProps) => {

  const handleGroup = useCallback(() => {
    if (selectedElementIds.length < 2) return;

    const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
    if (selectedElements.length < 2) return;

    // حساب الحدود الخارجية للمجموعة
    const bounds = selectedElements.reduce(
      (acc, el) => ({
        minX: Math.min(acc.minX, el.position.x),
        minY: Math.min(acc.minY, el.position.y),
        maxX: Math.max(acc.maxX, el.position.x + el.size.width),
        maxY: Math.max(acc.maxY, el.position.y + el.size.height),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    // إنشاء مجموعة جديدة
    const groupId = `group-${Date.now()}`;
    addElement(
      'group',
      bounds.minX,
      bounds.minY,
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY
    );

    // تحديث العناصر لتصبح جزء من المجموعة
    selectedElements.forEach(el => {
      updateElement(el.id, { 
        parentId: groupId,
        position: {
          x: el.position.x - bounds.minX,
          y: el.position.y - bounds.minY
        }
      });
    });
  }, [selectedElementIds, elements, updateElement, addElement]);

  const handleUngroup = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element && element.type === 'group') {
        // العثور على العناصر التابعة للمجموعة
        const childElements = elements.filter(el => el.parentId === elementId);
        
        // إزالة المجموعة وتحرير العناصر
        childElements.forEach(child => {
          const newPosition = {
            x: element.position.x + child.position.x,
            y: element.position.y + child.position.y
          };
          updateElement(child.id, { 
            parentId: undefined,
            position: newPosition
          });
        });
        
        deleteElement(elementId);
      }
    });
  }, [selectedElementIds, elements, updateElement, deleteElement]);

  const handleLock = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      updateElement(elementId, { locked: true });
    });
  }, [selectedElementIds, updateElement]);

  const handleUnlock = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      updateElement(elementId, { locked: false });
    });
  }, [selectedElementIds, updateElement]);

  const handleAlignToGrid = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element && !element.locked) {
        const alignedPosition = {
          x: Math.round(element.position.x / GRID_SIZE) * GRID_SIZE,
          y: Math.round(element.position.y / GRID_SIZE) * GRID_SIZE
        };
        updateElement(elementId, { position: alignedPosition });
      }
    });
  }, [selectedElementIds, elements, updateElement]);

  const handleDuplicate = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        addElement(
          element.type,
          element.position.x + 20,
          element.position.y + 20,
          element.size.width,
          element.size.height
        );
      }
    });
  }, [selectedElementIds, elements, addElement]);

  const handleDelete = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      deleteElement(elementId);
    });
  }, [selectedElementIds, deleteElement]);

  const handleFlipHorizontal = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element && !element.locked) {
        updateElement(elementId, { 
          style: { 
            ...element.style, 
            transform: `scaleX(-1) ${element.style?.transform || ''}` 
          }
        });
      }
    });
  }, [selectedElementIds, elements, updateElement]);

  const handleFlipVertical = useCallback(() => {
    selectedElementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element && !element.locked) {
        updateElement(elementId, { 
          style: { 
            ...element.style, 
            transform: `scaleY(-1) ${element.style?.transform || ''}` 
          }
        });
      }
    });
  }, [selectedElementIds, elements, updateElement]);

  const handleRotate = useCallback((degrees: number) => {
    selectedElementIds.forEach(elementId => {
      const element = elements.find(el => el.id === elementId);
      if (element && !element.locked) {
        const currentRotation = element.rotation || 0;
        updateElement(elementId, { 
          rotation: (toNumber(currentRotation, 0) + degrees) % 360
        });
      }
    });
  }, [selectedElementIds, elements, updateElement]);

  return {
    handleGroup,
    handleUngroup,
    handleLock,
    handleUnlock,
    handleAlignToGrid,
    handleDuplicate,
    handleDelete,
    handleFlipHorizontal,
    handleFlipVertical,
    handleRotate: (degrees: number) => handleRotate(degrees)
  };
};
