import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useSnapEngine } from './useSnapEngine';

const mockStoreState = {
  elements: [],
  settings: {
    snapToGrid: true,
    gridSize: 20,
  },
};

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

describe('useSnapEngine', () => {
  beforeEach(() => {
    mockStoreState.settings.snapToGrid = true;
    mockStoreState.settings.gridSize = 20;
  });

  it('يعكس تغييرات settings.snapToGrid و settings.gridSize في config', () => {
    const { result, rerender } = renderHook(() => useSnapEngine());

    expect(result.current.config.gridEnabled).toBe(true);
    expect(result.current.config.gridSize).toBe(20);

    act(() => {
      mockStoreState.settings.snapToGrid = false;
      mockStoreState.settings.gridSize = 32;
    });

    rerender();

    expect(result.current.config.gridEnabled).toBe(false);
    expect(result.current.config.gridSize).toBe(32);
  });
});
