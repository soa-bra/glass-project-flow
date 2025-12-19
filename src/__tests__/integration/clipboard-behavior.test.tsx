import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Clipboard Behavior Tests
 * Tests for copy, cut, paste, and clipboard operations
 */

// Mock clipboard data structure
interface ClipboardElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'group';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  groupId?: string;
  style?: Record<string, unknown>;
}

// Mock clipboard state
interface ClipboardState {
  elements: ClipboardElement[];
  copiedAt: number;
  sourcePosition: { x: number; y: number };
  pasteCount: number;
}

// Helper functions for clipboard operations
const createClipboardState = (): ClipboardState => ({
  elements: [],
  copiedAt: 0,
  sourcePosition: { x: 0, y: 0 },
  pasteCount: 0,
});

const copyElements = (
  clipboard: ClipboardState,
  elements: ClipboardElement[],
  sourcePosition: { x: number; y: number }
): ClipboardState => {
  return {
    elements: elements.map(el => ({ ...el })),
    copiedAt: Date.now(),
    sourcePosition,
    pasteCount: 0,
  };
};

const cutElements = (
  clipboard: ClipboardState,
  elements: ClipboardElement[],
  sourcePosition: { x: number; y: number }
): { clipboard: ClipboardState; removedIds: string[] } => {
  const newClipboard = copyElements(clipboard, elements, sourcePosition);
  return {
    clipboard: newClipboard,
    removedIds: elements.map(el => el.id),
  };
};

const pasteElements = (
  clipboard: ClipboardState,
  targetPosition: { x: number; y: number },
  generateId: () => string
): { elements: ClipboardElement[]; clipboard: ClipboardState } => {
  if (clipboard.elements.length === 0) {
    return { elements: [], clipboard };
  }

  const offset = {
    x: targetPosition.x - clipboard.sourcePosition.x,
    y: targetPosition.y - clipboard.sourcePosition.y,
  };

  // Add paste offset for subsequent pastes
  const pasteOffset = clipboard.pasteCount * 20;

  const pastedElements = clipboard.elements.map(el => ({
    ...el,
    id: generateId(),
    position: {
      x: el.position.x + offset.x + pasteOffset,
      y: el.position.y + offset.y + pasteOffset,
    },
  }));

  return {
    elements: pastedElements,
    clipboard: {
      ...clipboard,
      pasteCount: clipboard.pasteCount + 1,
    },
  };
};

const duplicateElements = (
  elements: ClipboardElement[],
  generateId: () => string,
  offset: { x: number; y: number } = { x: 20, y: 20 }
): ClipboardElement[] => {
  return elements.map(el => ({
    ...el,
    id: generateId(),
    position: {
      x: el.position.x + offset.x,
      y: el.position.y + offset.y,
    },
  }));
};

describe('Clipboard Behavior', () => {
  let clipboard: ClipboardState;
  let idCounter: number;
  const generateId = () => `element-${++idCounter}`;

  beforeEach(() => {
    clipboard = createClipboardState();
    idCounter = 0;
  });

  describe('Copy Operations', () => {
    it('should copy a single element to clipboard', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });

      expect(clipboard.elements).toHaveLength(1);
      expect(clipboard.elements[0].id).toBe('el-1');
      expect(clipboard.copiedAt).toBeGreaterThan(0);
    });

    it('should copy multiple elements to clipboard', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'el-2', type: 'text', position: { x: 200, y: 100 }, size: { width: 100, height: 30 }, content: 'Test' },
        { id: 'el-3', type: 'image', position: { x: 300, y: 100 }, size: { width: 150, height: 150 } },
      ];

      clipboard = copyElements(clipboard, elements, { x: 200, y: 100 });

      expect(clipboard.elements).toHaveLength(3);
      expect(clipboard.sourcePosition).toEqual({ x: 200, y: 100 });
    });

    it('should preserve element properties when copying', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'Hello World',
        style: { fontSize: 16, color: '#000' },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });

      expect(clipboard.elements[0].content).toBe('Hello World');
      expect(clipboard.elements[0].style).toEqual({ fontSize: 16, color: '#000' });
    });

    it('should replace previous clipboard content on new copy', () => {
      const element1: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };
      const element2: ClipboardElement = {
        id: 'el-2',
        type: 'text',
        position: { x: 200, y: 200 },
        size: { width: 100, height: 30 },
      };

      clipboard = copyElements(clipboard, [element1], { x: 100, y: 100 });
      clipboard = copyElements(clipboard, [element2], { x: 200, y: 200 });

      expect(clipboard.elements).toHaveLength(1);
      expect(clipboard.elements[0].id).toBe('el-2');
    });

    it('should reset paste count on new copy', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      clipboard.pasteCount = 5;
      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });

      expect(clipboard.pasteCount).toBe(0);
    });

    it('should deep copy elements to avoid reference issues', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      element.position.x = 500;

      expect(clipboard.elements[0].position.x).toBe(100);
    });

    it('should copy grouped elements with group relationship', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 }, groupId: 'group-1' },
        { id: 'el-2', type: 'shape', position: { x: 160, y: 100 }, size: { width: 50, height: 50 }, groupId: 'group-1' },
      ];

      clipboard = copyElements(clipboard, elements, { x: 130, y: 100 });

      expect(clipboard.elements[0].groupId).toBe('group-1');
      expect(clipboard.elements[1].groupId).toBe('group-1');
    });
  });

  describe('Cut Operations', () => {
    it('should cut element and add to clipboard', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      const result = cutElements(clipboard, [element], { x: 100, y: 100 });

      expect(result.clipboard.elements).toHaveLength(1);
      expect(result.removedIds).toContain('el-1');
    });

    it('should cut multiple elements', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'el-2', type: 'text', position: { x: 200, y: 100 }, size: { width: 100, height: 30 } },
      ];

      const result = cutElements(clipboard, elements, { x: 150, y: 100 });

      expect(result.clipboard.elements).toHaveLength(2);
      expect(result.removedIds).toEqual(['el-1', 'el-2']);
    });

    it('should return correct removed IDs for canvas update', () => {
      const elements: ClipboardElement[] = [
        { id: 'specific-id-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'specific-id-2', type: 'shape', position: { x: 200, y: 200 }, size: { width: 50, height: 50 } },
      ];

      const result = cutElements(clipboard, elements, { x: 150, y: 150 });

      expect(result.removedIds).toContain('specific-id-1');
      expect(result.removedIds).toContain('specific-id-2');
    });
  });

  describe('Paste Operations', () => {
    it('should paste element at target position', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      const result = pasteElements(clipboard, { x: 300, y: 300 }, generateId);

      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].position).toEqual({ x: 300, y: 300 });
    });

    it('should generate new IDs for pasted elements', () => {
      const element: ClipboardElement = {
        id: 'original-id',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      const result = pasteElements(clipboard, { x: 100, y: 100 }, generateId);

      expect(result.elements[0].id).not.toBe('original-id');
      expect(result.elements[0].id).toBe('element-1');
    });

    it('should maintain relative positions when pasting multiple elements', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'el-2', type: 'shape', position: { x: 200, y: 150 }, size: { width: 50, height: 50 } },
      ];

      clipboard = copyElements(clipboard, elements, { x: 150, y: 125 });
      const result = pasteElements(clipboard, { x: 350, y: 325 }, generateId);

      const relativeDistance = {
        x: result.elements[1].position.x - result.elements[0].position.x,
        y: result.elements[1].position.y - result.elements[0].position.y,
      };

      expect(relativeDistance).toEqual({ x: 100, y: 50 });
    });

    it('should offset subsequent pastes to avoid overlap', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      
      const paste1 = pasteElements(clipboard, { x: 100, y: 100 }, generateId);
      clipboard = paste1.clipboard;
      
      const paste2 = pasteElements(clipboard, { x: 100, y: 100 }, generateId);
      clipboard = paste2.clipboard;
      
      const paste3 = pasteElements(clipboard, { x: 100, y: 100 }, generateId);

      expect(paste1.elements[0].position).toEqual({ x: 100, y: 100 });
      expect(paste2.elements[0].position).toEqual({ x: 120, y: 120 });
      expect(paste3.elements[0].position).toEqual({ x: 140, y: 140 });
    });

    it('should return empty array when clipboard is empty', () => {
      const result = pasteElements(clipboard, { x: 100, y: 100 }, generateId);

      expect(result.elements).toHaveLength(0);
    });

    it('should increment paste count after each paste', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      expect(clipboard.pasteCount).toBe(0);

      const paste1 = pasteElements(clipboard, { x: 100, y: 100 }, generateId);
      expect(paste1.clipboard.pasteCount).toBe(1);

      const paste2 = pasteElements(paste1.clipboard, { x: 100, y: 100 }, generateId);
      expect(paste2.clipboard.pasteCount).toBe(2);
    });
  });

  describe('Duplicate Operations', () => {
    it('should duplicate single element with offset', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      const duplicated = duplicateElements([element], generateId);

      expect(duplicated).toHaveLength(1);
      expect(duplicated[0].position).toEqual({ x: 120, y: 120 });
      expect(duplicated[0].id).not.toBe('el-1');
    });

    it('should duplicate multiple elements maintaining relative positions', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'el-2', type: 'shape', position: { x: 200, y: 150 }, size: { width: 50, height: 50 } },
      ];

      const duplicated = duplicateElements(elements, generateId);

      expect(duplicated[0].position).toEqual({ x: 120, y: 120 });
      expect(duplicated[1].position).toEqual({ x: 220, y: 170 });
    });

    it('should use custom offset when provided', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      const duplicated = duplicateElements([element], generateId, { x: 50, y: 50 });

      expect(duplicated[0].position).toEqual({ x: 150, y: 150 });
    });

    it('should preserve all element properties except id and position', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'Test content',
        style: { fontSize: 18 },
      };

      const duplicated = duplicateElements([element], generateId);

      expect(duplicated[0].type).toBe('text');
      expect(duplicated[0].size).toEqual({ width: 200, height: 50 });
      expect(duplicated[0].content).toBe('Test content');
      expect(duplicated[0].style).toEqual({ fontSize: 18 });
    });
  });

  describe('Clipboard Persistence', () => {
    it('should store copy timestamp', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      const beforeCopy = Date.now();
      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      const afterCopy = Date.now();

      expect(clipboard.copiedAt).toBeGreaterThanOrEqual(beforeCopy);
      expect(clipboard.copiedAt).toBeLessThanOrEqual(afterCopy);
    });

    it('should check if clipboard has content', () => {
      expect(clipboard.elements.length).toBe(0);

      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      expect(clipboard.elements.length).toBeGreaterThan(0);
    });

    it('should clear clipboard', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      clipboard = createClipboardState();

      expect(clipboard.elements).toHaveLength(0);
      expect(clipboard.pasteCount).toBe(0);
    });
  });

  describe('Cross-Element Type Clipboard', () => {
    it('should copy and paste mixed element types', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
        { id: 'el-2', type: 'text', position: { x: 200, y: 100 }, size: { width: 100, height: 30 }, content: 'Test' },
        { id: 'el-3', type: 'image', position: { x: 300, y: 100 }, size: { width: 150, height: 150 } },
      ];

      clipboard = copyElements(clipboard, elements, { x: 200, y: 100 });
      const result = pasteElements(clipboard, { x: 400, y: 300 }, generateId);

      expect(result.elements).toHaveLength(3);
      expect(result.elements.map(e => e.type)).toEqual(['shape', 'text', 'image']);
    });

    it('should handle grouped elements in clipboard', () => {
      const elements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 }, groupId: 'group-1' },
        { id: 'el-2', type: 'shape', position: { x: 160, y: 100 }, size: { width: 50, height: 50 }, groupId: 'group-1' },
        { id: 'el-3', type: 'text', position: { x: 300, y: 100 }, size: { width: 100, height: 30 } },
      ];

      clipboard = copyElements(clipboard, elements, { x: 200, y: 100 });
      const result = pasteElements(clipboard, { x: 400, y: 300 }, generateId);

      const groupedElements = result.elements.filter(e => e.groupId === 'group-1');
      expect(groupedElements).toHaveLength(2);
    });
  });

  describe('Keyboard Shortcut Integration', () => {
    it('should handle Ctrl+C (copy) shortcut simulation', () => {
      const selectedElements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
      ];

      // Simulate Ctrl+C
      const ctrlCHandler = (elements: ClipboardElement[]) => {
        return copyElements(clipboard, elements, { x: 100, y: 100 });
      };

      clipboard = ctrlCHandler(selectedElements);
      expect(clipboard.elements).toHaveLength(1);
    });

    it('should handle Ctrl+X (cut) shortcut simulation', () => {
      const selectedElements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
      ];

      // Simulate Ctrl+X
      const ctrlXHandler = (elements: ClipboardElement[]) => {
        return cutElements(clipboard, elements, { x: 100, y: 100 });
      };

      const result = ctrlXHandler(selectedElements);
      expect(result.clipboard.elements).toHaveLength(1);
      expect(result.removedIds).toContain('el-1');
    });

    it('should handle Ctrl+V (paste) shortcut simulation', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });

      // Simulate Ctrl+V
      const ctrlVHandler = (targetPosition: { x: number; y: number }) => {
        return pasteElements(clipboard, targetPosition, generateId);
      };

      const result = ctrlVHandler({ x: 200, y: 200 });
      expect(result.elements).toHaveLength(1);
    });

    it('should handle Ctrl+D (duplicate) shortcut simulation', () => {
      const selectedElements: ClipboardElement[] = [
        { id: 'el-1', type: 'shape', position: { x: 100, y: 100 }, size: { width: 50, height: 50 } },
      ];

      // Simulate Ctrl+D
      const ctrlDHandler = (elements: ClipboardElement[]) => {
        return duplicateElements(elements, generateId);
      };

      const result = ctrlDHandler(selectedElements);
      expect(result).toHaveLength(1);
      expect(result[0].id).not.toBe('el-1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle copying empty selection', () => {
      clipboard = copyElements(clipboard, [], { x: 0, y: 0 });
      expect(clipboard.elements).toHaveLength(0);
    });

    it('should handle pasting with no prior copy', () => {
      const result = pasteElements(clipboard, { x: 100, y: 100 }, generateId);
      expect(result.elements).toHaveLength(0);
    });

    it('should handle negative positions', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: -100, y: -50 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: -100, y: -50 });
      const result = pasteElements(clipboard, { x: 100, y: 100 }, generateId);

      expect(result.elements[0].position).toEqual({ x: 100, y: 100 });
    });

    it('should handle very large coordinates', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 1000000, y: 1000000 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 1000000, y: 1000000 });
      const result = pasteElements(clipboard, { x: 0, y: 0 }, generateId);

      expect(result.elements[0].position.x).toBeLessThan(1000000);
    });

    it('should handle elements with zero size', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 0, height: 0 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      const result = pasteElements(clipboard, { x: 200, y: 200 }, generateId);

      expect(result.elements[0].size).toEqual({ width: 0, height: 0 });
    });

    it('should handle rapid copy-paste sequences', () => {
      const elements = Array.from({ length: 100 }, (_, i) => ({
        id: `el-${i}`,
        type: 'shape' as const,
        position: { x: i * 10, y: i * 10 },
        size: { width: 50, height: 50 },
      }));

      clipboard = copyElements(clipboard, elements, { x: 500, y: 500 });
      const result = pasteElements(clipboard, { x: 0, y: 0 }, generateId);

      expect(result.elements).toHaveLength(100);
    });
  });

  describe('System Clipboard Integration', () => {
    it('should format data for system clipboard (text representation)', () => {
      const element: ClipboardElement = {
        id: 'el-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: 'Hello World',
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });

      const jsonRepresentation = JSON.stringify(clipboard.elements);
      expect(() => JSON.parse(jsonRepresentation)).not.toThrow();
    });

    it('should handle pasting from external text', () => {
      // Simulate external paste - create text element
      const externalText = 'Pasted from external source';
      const createTextElement = (text: string, position: { x: number; y: number }): ClipboardElement => ({
        id: generateId(),
        type: 'text',
        position,
        size: { width: text.length * 8, height: 24 },
        content: text,
      });

      const textElement = createTextElement(externalText, { x: 100, y: 100 });
      expect(textElement.content).toBe(externalText);
      expect(textElement.type).toBe('text');
    });
  });

  describe('Undo/Redo Integration', () => {
    it('should track paste operations for undo', () => {
      const undoStack: { action: string; elements: ClipboardElement[] }[] = [];

      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      clipboard = copyElements(clipboard, [element], { x: 100, y: 100 });
      const result = pasteElements(clipboard, { x: 200, y: 200 }, generateId);

      // Track for undo
      undoStack.push({ action: 'paste', elements: result.elements });

      expect(undoStack).toHaveLength(1);
      expect(undoStack[0].action).toBe('paste');
    });

    it('should track cut operations for undo', () => {
      const undoStack: { action: string; elements: ClipboardElement[] }[] = [];

      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      const result = cutElements(clipboard, [element], { x: 100, y: 100 });

      // Track for undo (store original elements)
      undoStack.push({ action: 'cut', elements: [element] });

      expect(undoStack).toHaveLength(1);
      expect(undoStack[0].action).toBe('cut');
      expect(undoStack[0].elements[0].id).toBe('el-1');
    });

    it('should track duplicate operations for undo', () => {
      const undoStack: { action: string; elementIds: string[] }[] = [];

      const element: ClipboardElement = {
        id: 'el-1',
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
      };

      const duplicated = duplicateElements([element], generateId);

      // Track for undo
      undoStack.push({ action: 'duplicate', elementIds: duplicated.map(e => e.id) });

      expect(undoStack).toHaveLength(1);
      expect(undoStack[0].action).toBe('duplicate');
    });
  });
});
