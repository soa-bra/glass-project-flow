
import { useCallback } from 'react';
import { CanvasElement } from '../types';

export const useSimpleClipboard = (
  selectedElements: CanvasElement[],
  onAddElement: (x: number, y: number, type: string, smartElement?: string, width?: number, height?: number) => void,
  onDeleteElements: (elementIds: string[]) => void
) => {
  let clipboard: CanvasElement[] = [];

  const copy = useCallback(() => {
    clipboard = [...selectedElements];
  }, [selectedElements]);

  const cut = useCallback(() => {
    clipboard = [...selectedElements];
    onDeleteElements(selectedElements.map(el => el.id));
  }, [selectedElements, onDeleteElements]);

  const paste = useCallback(() => {
    clipboard.forEach((element, index) => {
      const offsetX = index * 20;
      const offsetY = index * 20;
      
      onAddElement(
        element.position.x + 20 + offsetX,
        element.position.y + 20 + offsetY,
        element.type,
        '',
        element.size.width,
        element.size.height
      );
    });
  }, [onAddElement]);

  return { copy, cut, paste };
};
