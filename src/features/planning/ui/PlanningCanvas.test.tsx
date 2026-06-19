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

const stateMocks = vi.hoisted(() => ({
  boardRole: { role: 'editor', loading: false, userId: 'editor-user' } as any,
  aiPermissions: {
    role: 'editor',
    userId: 'editor-user',
    loading: false,
    trustedSession: true,
    canUseAI: true,
    denialReason: null,
  } as any,
  syncResult: {
    peers: [],
    peersById: {},
    connectionStatus: 'connected',
    lastSyncAt: null,
    isConnected: true,
    selfUserId: 'editor-user',
    broadcastCursor: vi.fn(),
    updateSelfPresence: vi.fn(),
    hydrationStatus: 'ready',
    hydrationError: null,
    hydratedBoardId: 'board-1',
    isHydrated: true,
    persistence: { status: 'saved' },
  } as any,
}));

function resetPlanningCanvasMocks() {
  stateMocks.boardRole = { role: 'editor', loading: false, userId: 'editor-user' };
  stateMocks.aiPermissions = {
    role: 'editor',
    userId: 'editor-user',
    loading: false,
    trustedSession: true,
    canUseAI: true,
    denialReason: null,
  };
  stateMocks.syncResult = {
    peers: [],
    peersById: {},
    connectionStatus: 'connected',
    lastSyncAt: null,
    isConnected: true,
    selfUserId: 'editor-user',
    broadcastCursor: vi.fn(),
    updateSelfPresence: vi.fn(),
    hydrationStatus: 'ready',
    hydrationError: null,
    hydratedBoardId: 'board-1',
    isHydrated: true,
    persistence: { status: 'saved' },
  };
}

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
      elements: [],
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
  usePlanningCanvasPersistence: () => stateMocks.syncResult,
}));

vi.mock('@/features/planning/hooks/useCurrentBoardRole', () => ({
  canMutateCanvas: (role: string | null | undefined) => role === 'host' || role === 'editor',
  useCurrentBoardRole: () => stateMocks.boardRole,
}));

vi.mock('@/features/planning/hooks/useCanvasAIPermissions', () => ({
  useCanvasAIPermissions: () => stateMocks.aiPermissions,
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
  default: ({ board, onBack }: any) => (
    <div data-testid="canvas-toolbar">
      <span>{board.name}</span>
      <button onClick={onBack}>toolbar-back</button>
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
    resetPlanningCanvasMocks();
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

  async function waitForReadyCanvas() {
    await waitFor(() => {
      expect(screen.getByTestId('planning-canvas-ready')).toHaveAttribute('data-canvas-ready', 'true');
    });
  }

  it('shows one professional loading state until role, AI permissions, and elements are ready', () => {
    stateMocks.boardRole = { role: 'guest', loading: true, userId: null };
    stateMocks.aiPermissions = {
      role: 'guest',
      userId: null,
      loading: true,
      trustedSession: false,
      canUseAI: false,
      denialReason: 'loading',
    };
    stateMocks.syncResult = {
      ...stateMocks.syncResult,
      hydrationStatus: 'loading',
      isHydrated: false,
    };

    render(<PlanningCanvas board={board} />);

    expect(screen.getByTestId('planning-canvas-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('canvas-toolbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tool-zone')).not.toBeInTheDocument();
    expect(screen.queryByTestId('infinite-canvas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ai-assistant-button')).not.toBeInTheDocument();
  });

  it('renders the ready canvas chrome after viewport measurement', async () => {
    render(<PlanningCanvas board={board} />);

    await waitForReadyCanvas();

    expect(screen.queryByTestId('planning-canvas-loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('canvas-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('tool-zone')).toHaveTextContent('selection_tool');
    expect(screen.getByTestId('infinite-canvas')).toHaveTextContent('board-1');
    expect(screen.getByTestId('ai-assistant-button')).toBeInTheDocument();
  });

  it('renders the main planning canvas shell and wires top-level children', async () => {
    render(<PlanningCanvas board={board} />);

    await waitForReadyCanvas();

    expect(screen.getByTestId('canvas-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('infinite-canvas')).toHaveTextContent('board-1');
    expect(screen.getByTestId('tool-zone')).toHaveTextContent('selection_tool');
    expect(screen.getByTestId('bottom-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('contextual-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('smart-command-bar')).toHaveAttribute('data-open', 'true');

    expect(mockSetViewportHostSize).toHaveBeenCalledWith(1440, 900);
  });

  it('shows unified loading and hides canvas controls before element hydration is ready', () => {
    stateMocks.syncResult = {
      ...stateMocks.syncResult,
      hydrationStatus: 'loading',
      isHydrated: false,
    };

    render(<PlanningCanvas board={board} />);

    expect(screen.getByTestId('planning-canvas-loading')).toBeInTheDocument();
    expect(screen.getByText('جاري تجهيز لوحة التخطيط')).toBeInTheDocument();
    expect(screen.queryByTestId('infinite-canvas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tool-zone')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bottom-toolbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ai-assistant-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('contextual-toolbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('smart-command-bar')).not.toBeInTheDocument();
  });

  it('shows hydration errors without rendering the canvas body', async () => {
    stateMocks.syncResult = {
      ...stateMocks.syncResult,
      hydrationStatus: 'error',
      hydrationError: new Error('load failed'),
      isHydrated: false,
    };

    render(<PlanningCanvas board={board} />);

    await waitFor(() => {
      expect(screen.getByTestId('planning-canvas-ready')).toHaveAttribute('data-canvas-ready-reason', 'hydration-error');
    });
    expect(screen.getByText('تعذر تحميل لوحة التخطيط')).toBeInTheDocument();
    expect(screen.queryByTestId('infinite-canvas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bottom-toolbar')).not.toBeInTheDocument();
  });

  it('routes toolbar back action to setCurrentBoard(null)', async () => {
    render(<PlanningCanvas board={board} />);
    await waitForReadyCanvas();

    fireEvent.click(screen.getByText('toolbar-back'));

    expect(mockSetCurrentBoard).toHaveBeenCalledWith(null);
  });

  it('renders one unified command palette instance from the smart command bar hook', async () => {
    render(<PlanningCanvas board={board} />);
    await waitForReadyCanvas();

    expect(screen.getAllByTestId('smart-command-bar')).toHaveLength(1);
    expect(screen.getByTestId('smart-command-bar')).toHaveAttribute('data-open', 'true');
  });

  it('creates typed smart elements and adds them to canvas when smart command bar generates elements', async () => {
    render(<PlanningCanvas board={board} />);
    await waitForReadyCanvas();

    fireEvent.click(screen.getByText('generate-elements'));

    expect(mockCreateTypedSmartElement).toHaveBeenCalledWith({
      element: { type: 'kanban', title: 'لوحة ذكاء', description: 'desc', data: { columns: 3 } },
      index: 0,
      viewport: { zoom: 2, pan: { x: 100, y: 50 } },
    });
    expect(mockAddElement).toHaveBeenCalledWith({ type: 'kanban', id: 'smart-1' });
  });

  it('routes smart command bar close handler', async () => {
    render(<PlanningCanvas board={board} />);
    await waitForReadyCanvas();

    fireEvent.click(screen.getByText('close-smart-bar'));

    expect(mockClose).toHaveBeenCalled();
  });
});
