import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContextualToolbarManager from './ContextualToolbarManager';

const canvasState = {
  activeTool: 'selection_tool',
  editingTextId: null as string | null,
  selectedElementIds: [] as string[],
};

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: vi.fn((selector: (state: typeof canvasState) => unknown) => selector(canvasState)),
}));

vi.mock('./floating-bar', () => ({
  default: () => <div data-testid="floating-bar" />,
}));

vi.mock('@/features/planning/elements/smart/ContextSmartMenu', () => ({
  default: ({ boardId }: { boardId?: string | null }) => (
    <div data-testid="context-smart-menu">{boardId ?? 'no-board'}</div>
  ),
}));

describe('ContextualToolbarManager', () => {
  beforeEach(() => {
    canvasState.activeTool = 'selection_tool';
    canvasState.editingTextId = null;
    canvasState.selectedElementIds = [];
  });

  it('mounts the contextual AI menu next to the floating toolbar when elements are selected', () => {
    canvasState.selectedElementIds = ['el-1'];

    render(<ContextualToolbarManager boardId="board-123" />);

    expect(screen.getByTestId('floating-bar')).toBeInTheDocument();
    expect(screen.getByTestId('context-smart-menu')).toHaveTextContent('board-123');
  });

  it('mounts the contextual AI menu while text editing is active', () => {
    canvasState.editingTextId = 'text-1';

    render(<ContextualToolbarManager boardId="board-123" />);

    expect(screen.getByTestId('floating-bar')).toBeInTheDocument();
    expect(screen.getByTestId('context-smart-menu')).toBeInTheDocument();
  });

  it('does not mount contextual toolbar content when there is no contextual target', () => {
    const { container } = render(<ContextualToolbarManager boardId="board-123" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not mount contextual toolbar content while the smart pen owns the surface', () => {
    canvasState.activeTool = 'smart_pen';
    canvasState.selectedElementIds = ['el-1'];

    const { container } = render(<ContextualToolbarManager boardId="board-123" />);

    expect(container).toBeEmptyDOMElement();
  });
});
