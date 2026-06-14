import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CanvasElement, { isInteractiveCanvasTarget } from './CanvasElement';

const mockUpdateElement = vi.fn();
const mockMoveElements = vi.fn();
const mockMoveFrame = vi.fn();
const mockFindFrameAtPoint = vi.fn();
const mockAddChildToFrame = vi.fn();
const mockRemoveChildFromFrame = vi.fn();
const mockReleaseElementLock = vi.fn();
const mockIsInternalDrag = vi.fn(() => false);
const mockGetSmartElementData = vi.fn(() => null);

const canvasState: any = {
  elements: [],
  viewport: { zoom: 1, pan: { x: 0, y: 0 } },
  layers: [{ id: 'default', visible: true, locked: false }],
  editingTextId: null,
  updateElement: mockUpdateElement,
  updateFrameTitle: vi.fn(),
  startEditingText: vi.fn(),
  stopEditingText: vi.fn(),
  updateTextContent: vi.fn(),
  moveElements: mockMoveElements,
  moveFrame: mockMoveFrame,
  findFrameAtPoint: mockFindFrameAtPoint,
  addChildToFrame: mockAddChildToFrame,
  removeChildFromFrame: mockRemoveChildFromFrame,
  selectedElementIds: [],
  selectElements: vi.fn(),
  setActiveTool: vi.fn(),
};

vi.mock('@/stores/canvasStore', () => {
  const useCanvasStore = vi.fn((selector?: (state: any) => unknown) => {
    if (typeof selector === 'function') return selector(canvasState);
    return canvasState;
  });
  (useCanvasStore as any).getState = () => canvasState;
  return { useCanvasStore };
});

vi.mock('@/stores/interactionStore', () => {
  const useInteractionStore = vi.fn(() => ({ isInternalDrag: mockIsInternalDrag }));
  (useInteractionStore as any).getState = () => ({ isInternalDrag: mockIsInternalDrag });
  return { useInteractionStore };
});

vi.mock('@/stores/collaborationStore', () => ({
  useCollaborationStore: vi.fn((selector: (state: any) => unknown) => selector({ currentUserId: 'user-1', participants: [] })),
}));

vi.mock('@/stores/smartElementsStore', () => ({
  useSmartElementsStore: () => ({ getSmartElementData: mockGetSmartElementData }),
}));

vi.mock('@/features/planning/canvas/selection/ResizeHandle', () => ({
  ResizeHandle: ({ position }: { position: string }) => <div data-testid={`resize-${position}`} />,
}));

vi.mock('@/features/planning/elements/diagram/ArrowControlPoints', () => ({ ArrowControlPoints: () => null }));
vi.mock('@/features/planning/elements/diagram/ArrowLabels', () => ({ ArrowLabels: () => null }));

const smartTaskElement: any = {
  id: 'smart-task-1',
  type: 'smart',
  smartType: 'task_card',
  position: { x: 10, y: 20 },
  size: { width: 320, height: 220 },
  layerId: 'default',
  data: { smartType: 'task_card', taskName: 'اختبار التفاعل' },
};

describe('CanvasElement interactive targets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    canvasState.elements = [smartTaskElement];
    canvasState.selectedElementIds = [];
  });

  it('recognizes native and marked interactive canvas targets', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<div data-interactive-control><span id="child">AI</span></div>';

    expect(isInteractiveCanvasTarget(document.createElement('button'))).toBe(true);
    expect(isInteractiveCanvasTarget(document.createElement('input'))).toBe(true);
    expect(isInteractiveCanvasTarget(document.createElement('textarea'))).toBe(true);
    expect(isInteractiveCanvasTarget(document.createElement('select'))).toBe(true);

    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    expect(isInteractiveCanvasTarget(editable)).toBe(true);
    expect(isInteractiveCanvasTarget(wrapper.querySelector('#child') as HTMLElement)).toBe(true);
  });

  it('does not select or start dragging when pressing an action button inside a smart element', () => {
    const onSelect = vi.fn();
    render(
      <CanvasElement
        element={smartTaskElement}
        isSelected={false}
        onSelect={onSelect}
        activeTool="selection_tool"
        releaseElementLock={mockReleaseElementLock}
      />,
    );

    fireEvent.mouseDown(screen.getByRole('button', { name: 'اعتماد وتحويل المهمة' }), {
      button: 0,
      clientX: 64,
      clientY: 96,
    });
    fireEvent.mouseMove(window, { clientX: 164, clientY: 196 });

    expect(onSelect).not.toHaveBeenCalled();
    expect(mockUpdateElement).not.toHaveBeenCalled();
    expect(mockMoveElements).not.toHaveBeenCalled();
    expect(mockMoveFrame).not.toHaveBeenCalled();
  });
});
