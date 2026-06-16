import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import CanvasToolbar from './CanvasToolbar';

const mockUndo = vi.fn();
const mockRedo = vi.fn();
const mockRenameBoard = vi.fn();

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: vi.fn(() => ({
    undo: mockUndo,
    redo: mockRedo,
    history: { past: ['step-1'], future: ['step-2'] },
  })),
}));

vi.mock('@/stores/planningStore', () => ({
  usePlanningStore: vi.fn(() => ({
    renameBoard: mockRenameBoard,
  })),
}));

vi.mock('../overlays/HistoryPopover', () => ({ HistoryPopover: () => <div data-testid="history-popover" /> }));
vi.mock('../overlays/SharePopover', () => ({
  SharePopover: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? (
      <div data-testid="share-popover">
        <div>متصل</div>
        <div>2 مشارك</div>
        <button>دعوة</button>
        <div role="tab">المشاركين</div>
        <div>أحمد (أنت)</div>
      </div>
    ) : null
  ),
}));
vi.mock('../overlays/CanvasPropertiesPopover', () => ({ CanvasPropertiesPopover: () => <div data-testid="properties-popover" /> }));
vi.mock('../overlays/FileMenuPopover', () => ({ FileMenuPopover: () => <div data-testid="file-popover" /> }));
vi.mock('../overlays/LayersMenuPopover', () => ({ LayersMenuPopover: () => <div data-testid="layers-popover" /> }));

describe('CanvasToolbar', () => {
  const board = {
    id: 'board-1',
    name: 'لوحة استراتيجية',
  } as any;

  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the board name without board save status', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    expect(screen.getByText('لوحة استراتيجية')).toBeInTheDocument();
    expect(screen.queryByText('تم الحفظ قبل قليل')).not.toBeInTheDocument();
    expect(screen.queryByText('حفظ')).not.toBeInTheDocument();
  });

  it('routes back action to its callback', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    fireEvent.click(screen.getByLabelText('العودة إلى القائمة'));

    expect(onBack).toHaveBeenCalled();
  });

  it('does not bind Ctrl/Cmd + S to board snapshot saving', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    fireEvent.keyDown(window, { key: 's', metaKey: true });

    expect(mockRenameBoard).not.toHaveBeenCalled();
  });

  it('renames the board when editing ends with a new non-empty name', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    fireEvent.doubleClick(screen.getByText('لوحة استراتيجية'));
    const input = screen.getByLabelText('اسم اللوحة');
    fireEvent.change(input, { target: { value: 'لوحة جديدة' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockRenameBoard).toHaveBeenCalledWith('board-1', 'لوحة جديدة');
  });

  it('reverts empty board name edits without renaming', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    fireEvent.doubleClick(screen.getByText('لوحة استراتيجية'));
    const input = screen.getByLabelText('اسم اللوحة');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);

    expect(mockRenameBoard).not.toHaveBeenCalled();
  });

  it('does not render collaboration participant details in the toolbar', () => {
    render(
      <CanvasToolbar
        board={board}
        onBack={onBack}
        peers={[{ user_id: 'peer-1', display_name: 'مراجع خارجي', color: '#123456' } as any]}
        selfName="محرر داخلي"
      />,
    );

    expect(screen.queryByLabelText('المتعاونون النشِطون')).not.toBeInTheDocument();
    expect(screen.queryByText('أنت: محرر داخلي')).not.toBeInTheDocument();
    expect(screen.queryByText('مراجع خارجي')).not.toBeInTheDocument();
  });

  it('routes undo and redo actions', () => {
    const { container } = render(<CanvasToolbar board={board} onBack={onBack} />);
    const buttons = container.querySelectorAll('button');
    const undoButton = buttons[buttons.length - 2];
    const redoButton = buttons[buttons.length - 1];

    fireEvent.click(screen.getByRole('button', { name: 'تراجع' }));
    fireEvent.click(screen.getByRole('button', { name: 'إعادة' }));

    expect(mockUndo).toHaveBeenCalled();
    expect(mockRedo).toHaveBeenCalled();
  });

  it('does not show collaboration status details directly in the toolbar', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    expect(screen.queryByText('متصل')).not.toBeInTheDocument();
    expect(screen.queryByText('غير متصل')).not.toBeInTheDocument();
    expect(screen.queryByText(/أنت:/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('المتعاونون النشِطون')).not.toBeInTheDocument();
  });

  it('opens SharePopover as the unified source for participants details', () => {
    render(<CanvasToolbar board={board} onBack={onBack} />);

    fireEvent.click(screen.getByRole('button', { name: 'المشاركين' }));

    expect(screen.getByTestId('share-popover')).toBeInTheDocument();
    expect(screen.getByText('متصل')).toBeInTheDocument();
    expect(screen.getByText('2 مشارك')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'دعوة' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'المشاركين' })).toBeInTheDocument();
    expect(screen.getByText('أحمد (أنت)')).toBeInTheDocument();
  });
});
