import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import CanvasToolbar from './CanvasToolbar';

const mockUndo = vi.fn();
const mockRedo = vi.fn();
const mockRenameBoard = vi.fn();
const mockSaveBoardState = vi.fn();
const mockFormatBoardSaveStatusLabel = vi.fn();

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

vi.mock('@/features/planning/hooks/useBoardSaveState', () => ({
  useBoardSaveState: vi.fn(() => ({
    status: 'saved',
    lastSavedAt: new Date('2026-04-19T00:00:00.000Z'),
    canSave: true,
    saveBoardState: mockSaveBoardState,
    isDirty: true,
  })),
  formatBoardSaveStatusLabel: (...args: any[]) => mockFormatBoardSaveStatusLabel(...args),
}));

vi.mock('../overlays/HistoryPopover', () => ({ HistoryPopover: () => <div data-testid="history-popover" /> }));
vi.mock('../overlays/SharePopover', () => ({ SharePopover: () => <div data-testid="share-popover" /> }));
vi.mock('../overlays/CanvasPropertiesPopover', () => ({ CanvasPropertiesPopover: () => <div data-testid="properties-popover" /> }));
vi.mock('../overlays/FileMenuPopover', () => ({ FileMenuPopover: () => <div data-testid="file-popover" /> }));
vi.mock('../overlays/LayersMenuPopover', () => ({ LayersMenuPopover: () => <div data-testid="layers-popover" /> }));

describe('CanvasToolbar', () => {
  const board = {
    id: 'board-1',
    name: 'لوحة استراتيجية',
  } as any;

  const onBack = vi.fn();
  const onOpenAI = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormatBoardSaveStatusLabel.mockReturnValue('تم الحفظ قبل قليل');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the board name and save label', () => {
    render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);

    expect(screen.getByText('لوحة استراتيجية')).toBeInTheDocument();
    expect(screen.getByText('تم الحفظ قبل قليل')).toBeInTheDocument();
    expect(mockFormatBoardSaveStatusLabel).toHaveBeenCalled();
  });

  it('routes back and AI actions to their callbacks', () => {
    render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);

    fireEvent.click(screen.getByLabelText('العودة إلى القائمة'));
    fireEvent.click(screen.getByText('AI'));

    expect(onBack).toHaveBeenCalled();
    expect(onOpenAI).toHaveBeenCalled();
  });

  it('calls saveBoardState when save button is clicked', () => {
    render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);

    fireEvent.click(screen.getByText('تم الحفظ'));

    expect(mockSaveBoardState).toHaveBeenCalled();
  });

  it('calls saveBoardState on Ctrl/Cmd + S', () => {
    render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    fireEvent.keyDown(window, { key: 's', metaKey: true });

    expect(mockSaveBoardState).toHaveBeenCalledTimes(2);
  });

  it('renames the board when editing ends with a new non-empty name', () => {
    render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);

    fireEvent.doubleClick(screen.getByText('لوحة استراتيجية'));
    const input = screen.getByLabelText('اسم اللوحة');
    fireEvent.change(input, { target: { value: 'لوحة جديدة' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockRenameBoard).toHaveBeenCalledWith('board-1', 'لوحة جديدة');
  });

  it('reverts empty board name edits without renaming', () => {
    render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);

    fireEvent.doubleClick(screen.getByText('لوحة استراتيجية'));
    const input = screen.getByLabelText('اسم اللوحة');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);

    expect(mockRenameBoard).not.toHaveBeenCalled();
  });

  it('routes undo and redo actions', () => {
    const { container } = render(<CanvasToolbar board={board} onBack={onBack} onOpenAI={onOpenAI} />);
    const buttons = container.querySelectorAll('button');
    const undoButton = buttons[6];
    const redoButton = buttons[7];

    fireEvent.click(undoButton);
    fireEvent.click(redoButton);

    expect(mockUndo).toHaveBeenCalled();
    expect(mockRedo).toHaveBeenCalled();
  });
});
