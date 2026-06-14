import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import FloatingBar from './FloatingBar';

const mockUpdateElement = vi.fn();
const mockDeleteElement = vi.fn();
const mockAddElement = vi.fn();
const mockSelectElement = vi.fn();
const mockGroupElements = vi.fn();
const mockUngroupElements = vi.fn();
const mockAnalyzeSelection = vi.fn();
const mockTransformElements = vi.fn();
const mockAlignHorizontally = vi.fn();
const mockAlignVertically = vi.fn();
const mockCreateFrameFromSelection = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastInfo = vi.fn();
const mockToastError = vi.fn();

const canvasState: any = {
  elements: [
    { id: 'el-1', type: 'text', content: 'Launch plan', position: { x: 100, y: 120 }, style: {}, data: { text: 'Launch plan' } },
    { id: 'el-2', type: 'shape', content: 'Build MVP', position: { x: 160, y: 180 }, style: {}, data: {}, metadata: { groupId: 'group-1' } },
    { id: 'el-3', type: 'shape', style: {}, data: {}, metadata: { groupId: 'group-2' } },
  ],
  selectedElementIds: ['el-1', 'el-2'],
  clipboard: [],
  layers: [{ id: 'layer-1', name: 'Layer 1' }],
  viewport: { zoom: 1, pan: { x: 0, y: 0 } },
  updateElement: mockUpdateElement,
  deleteElement: mockDeleteElement,
  addElement: mockAddElement,
  selectElement: mockSelectElement,
  editingTextId: null,
  groupElements: mockGroupElements,
  ungroupElements: mockUngroupElements,
};

const selectionMeta: any = {
  selectionType: 'multiple',
  selectedElements: [canvasState.elements[0], canvasState.elements[1]],
  firstElement: canvasState.elements[0],
  hasSelection: true,
  mindmapTreeElements: [],
  areElementsLocked: false,
  areElementsVisible: true,
  areElementsGrouped: false,
  selectionCount: 2,
  isMindmapSelection: false,
};

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: vi.fn(() => canvasState),
}));

vi.mock('@/hooks/useSmartElementAI', () => ({
  useSmartElementAI: () => ({
    analyzeSelection: mockAnalyzeSelection,
    transformElements: mockTransformElements,
    isLoading: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    info: (...args: any[]) => mockToastInfo(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}));

vi.mock('@/components/ui/separator', () => ({ Separator: () => <div data-testid="separator" /> }));
vi.mock('@/features/planning/elements/text/TextEditorContext', () => ({ useActiveTextEditor: () => null }));
vi.mock('@/features/planning/elements/text/TextFormattingController', () => ({
  applyInlineFormat: vi.fn(() => false),
  clearEditorFormatting: vi.fn(() => false),
  getActiveTextFormats: vi.fn(() => []),
  toggleListFormat: vi.fn(() => false),
  toggleTextStyleFromElement: vi.fn(() => null),
}));

vi.mock('./hooks', () => ({
  useFloatingPosition: () => ({ x: 150, y: 80 }),
  useSelectionMeta: () => selectionMeta,
  useLayoutOperations: () => ({
    alignHorizontally: mockAlignHorizontally,
    alignVertically: mockAlignVertically,
  }),
}));

vi.mock('./groups', () => ({
  CommonActions: ({ onTransform }: any) => (
    <div data-testid="common-actions">
      <button onClick={() => onTransform('kanban')}>transform-kanban</button>
    </div>
  ),
  MindmapActions: () => <div data-testid="mindmap-actions" />,
  VisualDiagramActions: () => <div data-testid="visual-actions" />,
  TextActions: () => <div data-testid="text-actions" />,
  ImageActions: () => <div data-testid="image-actions" />,
  ElementActions: () => <div data-testid="element-actions" />,
  MultipleActions: ({ onToggleGroup, onCreateFrame, onHorizontalAlign, onVerticalAlignMultiple }: any) => (
    <div data-testid="multiple-actions">
      <button onClick={() => onToggleGroup()}>toggle-group</button>
      <button onClick={() => onCreateFrame()}>create-frame</button>
      <button onClick={() => onHorizontalAlign('center')}>align-horizontal</button>
      <button onClick={() => onVerticalAlignMultiple('middle')}>align-vertical</button>
    </div>
  ),
}));

vi.mock('./actions', () => ({
  copyElements: vi.fn(),
  cutElements: vi.fn(),
  pasteElements: vi.fn(),
  duplicateElements: vi.fn(),
  deleteElements: vi.fn(),
  lockElements: vi.fn(),
  unlockElements: vi.fn(),
  toggleVisibility: vi.fn(),
  bringToFront: vi.fn(),
  bringForward: vi.fn(),
  sendBackward: vi.fn(),
  sendToBack: vi.fn(),
  changeLayer: vi.fn(),
  addNewText: vi.fn(),
  createFrameFromSelection: (...args: any[]) => mockCreateFrameFromSelection(...args),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FloatingBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="planning-floating-overlay"></div>';
    selectionMeta.selectionType = 'multiple';
    selectionMeta.hasSelection = true;
    selectionMeta.areElementsGrouped = false;
    selectionMeta.selectedElements = [canvasState.elements[0], canvasState.elements[1]];
    canvasState.selectedElementIds = ['el-1', 'el-2'];
    mockCreateFrameFromSelection.mockReturnValue('frame-1');
  });

  it('does not render when there is no selection', () => {
    selectionMeta.hasSelection = false;

    const { container } = render(<FloatingBar />);

    expect(container).toBeEmptyDOMElement();
  });

  it('groups selected elements from the multiple selection toolbar', () => {
    render(<FloatingBar />);

    fireEvent.click(screen.getByText('toggle-group'));

    expect(mockGroupElements).toHaveBeenCalledWith(['el-1', 'el-2']);
    expect(mockToastSuccess).toHaveBeenCalledWith('تم التجميع');
  });

  it('ungroups unique group ids when grouped selection is toggled', () => {
    selectionMeta.areElementsGrouped = true;
    selectionMeta.selectedElements = [
      { ...canvasState.elements[1], metadata: { groupId: 'group-1' } },
      { ...canvasState.elements[2], metadata: { groupId: 'group-2' } },
      { ...canvasState.elements[0], metadata: { groupId: 'group-1' } },
    ];

    render(<FloatingBar />);

    fireEvent.click(screen.getByText('toggle-group'));

    expect(mockUngroupElements).toHaveBeenCalledTimes(2);
    expect(mockUngroupElements).toHaveBeenCalledWith('group-1');
    expect(mockUngroupElements).toHaveBeenCalledWith('group-2');
    expect(mockToastSuccess).toHaveBeenCalledWith('تم فك التجميع');
  });

  it('shows info toast when grouped mode has no valid group ids', () => {
    selectionMeta.areElementsGrouped = true;
    selectionMeta.selectedElements = [{ ...canvasState.elements[0], metadata: {} }];

    render(<FloatingBar />);

    fireEvent.click(screen.getByText('toggle-group'));

    expect(mockUngroupElements).not.toHaveBeenCalled();
    expect(mockToastInfo).toHaveBeenCalledWith('لا يوجد تجميع صالح لفكه');
  });

  it('creates a frame and selects it when frame creation succeeds', () => {
    render(<FloatingBar />);

    fireEvent.click(screen.getByText('create-frame'));

    expect(mockCreateFrameFromSelection).toHaveBeenCalledWith(['el-1', 'el-2'], canvasState.elements, mockAddElement);
    expect(mockSelectElement).toHaveBeenCalledWith('frame-1');
    expect(mockToastSuccess).toHaveBeenCalledWith('تم إنشاء الإطار');
  });

  it('routes multiple selection alignment actions through layout operations', () => {
    render(<FloatingBar />);

    fireEvent.click(screen.getByText('align-horizontal'));
    fireEvent.click(screen.getByText('align-vertical'));

    expect(mockAlignHorizontally).toHaveBeenCalledWith('center');
    expect(mockAlignVertically).toHaveBeenCalledWith('middle');
  });

  it('creates a renderable kanban smart element after transforming text selection', async () => {
    mockTransformElements.mockResolvedValueOnce({
      elements: [{
        id: 'generated-kanban',
        type: 'kanban',
        title: 'Launch Kanban',
        content: 'Tasks extracted from the selected text',
        data: {
          columns: [{
            id: 'todo',
            title: 'To do',
            cards: [{ id: 'task-1', title: 'Build MVP', description: 'Create the first release', order: 0 }],
            collapsed: false,
          }],
        },
        position: { x: 220, y: 240 },
      }],
      layout: 'grid',
      summary: 'created kanban',
    });

    render(<FloatingBar />);

    fireEvent.click(screen.getByText('transform-kanban'));

    await waitFor(() => {
      expect(mockAddElement).toHaveBeenCalledTimes(1);
    });

    const createdElement = mockAddElement.mock.calls[0][0];
    expect(createdElement.type).toBe('kanban');
    expect(createdElement.content).toBe('Launch Kanban');
    expect(createdElement.data.title).toBe('Launch Kanban');
    expect(createdElement.data.content).toBe('Tasks extracted from the selected text');
    expect(createdElement.data.columns[0].cards[0].title).toBe('Build MVP');
  });

});
