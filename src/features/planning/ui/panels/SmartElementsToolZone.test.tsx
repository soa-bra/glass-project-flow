import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SmartElementsPanel from './SmartElementsToolZone';

const mockAddSmartElement = vi.fn();
const mockSetSelectedSmartElement = vi.fn();
const mockSetActiveTool = vi.fn();
const mockGenerateElements = vi.fn();

vi.mock('@/stores/smartElementsStore', () => ({
  useSmartElementsStore: () => ({ addSmartElement: mockAddSmartElement }),
}));

vi.mock('@/stores/canvasStore', () => {
  const canvasState = {
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    setSelectedSmartElement: mockSetSelectedSmartElement,
    setActiveTool: mockSetActiveTool,
  };
  const useCanvasStore = vi.fn((selector?: (state: typeof canvasState) => unknown) => {
    if (typeof selector === 'function') return selector(canvasState);
    return canvasState;
  });
  (useCanvasStore as any).getState = () => canvasState;
  return { useCanvasStore };
});

vi.mock('@/hooks/useSmartElementAI', () => ({
  useSmartElementAI: () => ({ generateElements: mockGenerateElements, isLoading: false }),
}));

vi.mock('@/hooks/central/useCentral', () => ({
  useProjects: () => ({ data: [] }),
  useAllProjectTasks: () => [],
}));

vi.mock('@/features/planning/adapters/departmentBoxesAdapter', () => ({
  getDepartmentBoxSources: () => [],
  createDepartmentBoxElementData: vi.fn(() => ({})),
}));

describe('SmartElementsPanel Boxes category', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows project and task cards inside the Boxes tab', () => {
    render(<SmartElementsPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'صناديق' }));

    const smartElementsGrid = screen.getByText('اختر عنصر ذكي').nextElementSibling as HTMLElement;
    const grid = within(smartElementsGrid);

    expect(grid.getByRole('button', { name: /بطاقة مشروع/i })).toBeInTheDocument();
    expect(grid.getByRole('button', { name: /بطاقة مهمة/i })).toBeInTheDocument();
  });
});
