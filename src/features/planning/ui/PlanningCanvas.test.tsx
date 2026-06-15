import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import PlanningCanvas from './PlanningCanvas';

const mockSetCurrentBoard = vi.fn();
const mockSetViewportHostSize = vi.fn();
const mockAddElement = vi.fn();
const mockUpdateElement = vi.fn();
const mockOpen = vi.fn();
const mockClose = vi.fn();
const mockCreateTypedSmartElement = vi.fn();

vi.mock('@/stores/planningStore', () => ({
  usePlanningStore: vi.fn((selector: (state: { setCurrentBoard: typeof mockSetCurrentBoard }) => unknown) =>
    selector({ setCurrentBoard: mockSetCurrentBoard }),
  ),
}));

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: vi.fn((selector: (state: any) => unknown) =>
    selector({
      activeTool: 'selection_tool',
      setViewportHostSize: mockSetViewportHostSize,
      addElement: mockAddElement,
      updateElement: mockUpdateElement,
      selectedElementIds: [],
      viewport: { zoom: 2, pan: { x: 100, y: 50 } },
    }),
  ),
}));


vi.mock('@/stores/collaborationStore', () => ({
  useCollaborationStore: vi.fn((selector: (state: any) => unknown) =>
    selector({
      currentUserId: 'editor-user',
      participants: [],
      setConnected: vi.fn(),
      setCurrentUser: vi.fn(),
      setParticipants: vi.fn(),
    }),
  ),
}));

vi.mock('@/features/planning/hooks/useBoardCanvasLifecycle', () => ({
  useBoardCanvasLifecycle: vi.fn(),
}));

vi.mock('@/features/planning/hooks/usePlanningCanvasPersistence', () => ({
  usePlanningCanvasPersistence: () => ({
    peers: [],
    connectionStatus: 'connected',
    hydrationStatus: 'ready',
    lastSyncAt: null,
    isConnected: true,
    selfUserId: 'editor-user',
    broadcastCursor: vi.fn(),
    persistence: {},
  }),
}));

vi.mock('@/features/planning/hooks/useCurrentBoardRole', () => ({
  canMutateCanvas: () => true,
  useCurrentBoardRole: () => ({ role: 'editor', loading: false, userId: 'editor-user' }),
}));

vi.mock('@/features/planning/hooks/useCanvasAIPermissions', () => ({
  useCanvasAIPermissions: () => ({ canUseAI: true, denialReason: null }),
}));

vi.mock('@/features/planning/domain/commands', () => ({
  executeCommandWithAuthorization: (_command: unknown, handler: () => void) => handler(),
}));

vi.mock('@/features/planning/ui/widgets/AIAssistantButton', () => ({
  AIAssistantButton: () => <button data-testid="ai-assistant-button">AI</button>,
}));

vi.mock('@/features/planning/ui/overlays/SmartConversionReviewDialog', () => ({
  SmartConversionReviewDialog: () => <div data-testid="smart-conversion-review" />,
}));

vi.mock('@/components/ProjectManagement/ProjectManagementBoard', () => ({
  ProjectManagementBoard: () => <div data-testid="project-management-board" />,
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/features/planning/canvas/viewport/InfiniteCanvas', () => ({
  default: ({ boardId }: { boardId: string }) => <div data-testid="infinite-canvas">{boardId}</div>,
}));

vi.mock('@/features/planning/ui/toolbars/BottomToolbar', () => ({ default: () => <div data-testid="bottom-toolbar" /> }));
vi.mock('@/features/planning/ui/toolbars/NavigationBar', () => ({ default: () => <div data-testid="navigation-bar" /> }));
vi.mock('@/features/planning/ui/toolbars/ContextualToolbarManager', () => ({ default: () => <div data-testid="contextual-toolbar" /> }));
vi.mock('./panels/ToolZone', () => ({ default: ({ activeTool }: { activeTool: string }) => <div data-testid="tool-zone">{activeTool}</div> }));

vi.mock('@/features/planning/ui/toolbars/CanvasToolbar', () => ({
  default: ({ board, onBack, onOpenAI }: any) => (
    <div data-testid="canvas-toolbar">
      <span>{board.name}</span>
      <button onClick={onBack}>toolbar-back</button>
      <button onClick={onOpenAI}>toolbar-ai</button>
    </div>
  ),
}));

vi.mock('@/features/planning/elements/smart/SmartCommandBar', () => ({
  useSmartCommandBar: () => ({ isOpen: true, open: mockOpen, close: mockClose }),
  SmartCommandBar: ({ isOpen, onClose, onElementsGenerated }: any) => (
    <div data-testid="smart-command-bar" data-open={String(isOpen)}>
      <button onClick={onClose}>close-smart-bar</button>
      <button
        onClick={() =>
          onElementsGenerated([
            { type: 'kanban', title: 'لوحة ذكاء', description: 'desc', data: { columns: 3 } },
          ])
        }
      >
        generate-elements
      </button>
    </div>
  ),
}));

vi.mock('@/features/planning/elements/smart/factories/createTypedSmartElement', () => ({
  createTypedSmartElement: (...args: any[]) => mockCreateTypedSmartElement(...args),
}));

describe('PlanningCanvas', () => {
  const board = {
    id: 'board-1',
    name: 'لوحة التخطيط',
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateTypedSmartElement.mockReturnValue({ type: 'kanban', id: 'smart-1' });

    class ResizeObserverMock {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe(target: Element) {
        Object.defineProperty(target, 'clientWidth', { configurable: true, value: 1440 });
        Object.defineProperty(target, 'clientHeight', { configurable: true, value: 900 });
        this.callback([], this as any);
      }
      disconnect() {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock as any);
  });

  it('renders the main planning canvas shell and wires top-level children', async () => {
    render(<PlanningCanvas board={board} />);

    expect(screen.getByTestId('canvas-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('infinite-canvas')).toHaveTextContent('board-1');
    expect(screen.getByTestId('tool-zone')).toHaveTextContent('selection_tool');
    expect(screen.getByTestId('bottom-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('contextual-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('smart-command-bar')).toHaveAttribute('data-open', 'true');

    await waitFor(() => {
      expect(mockSetViewportHostSize).toHaveBeenCalledWith(1440, 900);
    });
  });

  it('routes toolbar back action to setCurrentBoard(null)', () => {
    render(<PlanningCanvas board={board} />);

    fireEvent.click(screen.getByText('toolbar-back'));

    expect(mockSetCurrentBoard).toHaveBeenCalledWith(null);
  });

  it('opens the unified command palette with Cmd/Ctrl + K without rendering a second palette', () => {
    render(<PlanningCanvas board={board} />);

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'K', metaKey: true });

    expect(mockOpen).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId('smart-command-bar')).toHaveLength(1);
  });

  it('creates typed smart elements and adds them to canvas when smart command bar generates elements', () => {
    render(<PlanningCanvas board={board} />);

    fireEvent.click(screen.getByText('generate-elements'));

    expect(mockCreateTypedSmartElement).toHaveBeenCalledWith({
      element: { type: 'kanban', title: 'لوحة ذكاء', description: 'desc', data: { columns: 3 } },
      index: 0,
      viewport: { zoom: 2, pan: { x: 100, y: 50 } },
    });
    expect(mockAddElement).toHaveBeenCalledWith({ type: 'kanban', id: 'smart-1' });
  });

  it('routes smart command bar close handler', () => {
    render(<PlanningCanvas board={board} />);

    fireEvent.click(screen.getByText('close-smart-bar'));

    expect(mockClose).toHaveBeenCalled();
  });
});
