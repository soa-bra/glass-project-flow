import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PlanningWorkspace from './PlanningWorkspace';

const mocks = vi.hoisted(() => ({
  loadBoards: vi.fn(),
  currentBoard: { id: 'board-1', name: 'Planning Board' },
}));

vi.mock('@/stores/planningStore', () => ({
  usePlanningStore: () => ({
    currentBoard: mocks.currentBoard,
    loadBoards: mocks.loadBoards,
  }),
}));

vi.mock('@/features/planning/ui/PlanningEntryScreen', () => ({
  default: () => <div data-testid="planning-entry-screen" />,
}));

vi.mock('@/features/planning/ui/PlanningCanvas', () => ({
  default: () => {
    throw new Error('Rendered more hooks than during the previous render');
  },
}));

describe('PlanningWorkspace', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  it('contains planning render failures without unmounting the workspace shell', () => {
    render(<PlanningWorkspace isSidebarCollapsed={false} />);

    expect(screen.getByTestId('planning-workspace-error')).toBeInTheDocument();
    expect(screen.getByText('حدث خطأ في planning')).toBeInTheDocument();
    expect(screen.getByText('Rendered more hooks than during the previous render')).toBeInTheDocument();
    expect(mocks.loadBoards).toHaveBeenCalled();
  });
});