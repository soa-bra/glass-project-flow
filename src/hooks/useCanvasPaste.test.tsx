import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

let mockStoreState: {
  editingTextId: string | null;
  addText: ReturnType<typeof vi.fn>;
  selectElement: ReturnType<typeof vi.fn>;
  startEditingText: ReturnType<typeof vi.fn>;
};

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: {
    getState: () => mockStoreState,
  },
}));

import { useCanvasPaste } from './useCanvasPaste';

function dispatchPaste(text: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, 'clipboardData', {
    configurable: true,
    value: {
      getData: (type: string) => (type === 'text/plain' ? text : ''),
    },
  });
  window.dispatchEvent(event);
  return event;
}

describe('useCanvasPaste', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    mockStoreState = {
      editingTextId: null,
      addText: vi.fn(() => 'new-text-id'),
      selectElement: vi.fn(),
      startEditingText: vi.fn(),
    };
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('creates and focuses a new text element when paste happens inside canvas context', () => {
    const container = document.createElement('div');
    container.setAttribute('data-canvas-container', 'true');
    const focusTarget = document.createElement('button');
    focusTarget.type = 'button';
    container.appendChild(focusTarget);
    document.body.appendChild(container);
    focusTarget.focus();

    renderHook(() =>
      useCanvasPaste({
        lastPointerPosition: { current: { x: 42, y: 84 } },
        viewportBounds: { x: 0, y: 0, width: 800, height: 600 },
      }),
    );

    const event = dispatchPaste('مرحبا بالعالم');

    expect(event.defaultPrevented).toBe(true);
    expect(mockStoreState.addText).toHaveBeenCalledTimes(1);
    expect(mockStoreState.addText).toHaveBeenCalledWith(
      expect.objectContaining({
        position: { x: 42, y: 84 },
        content: 'مرحبا بالعالم',
        textType: 'line',
        direction: 'rtl',
        alignment: 'right',
      }),
    );
    expect(mockStoreState.selectElement).toHaveBeenCalledWith('new-text-id', false);
    expect(mockStoreState.startEditingText).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(mockStoreState.startEditingText).toHaveBeenCalledWith('new-text-id');
  });

  it('ignores paste when focus is outside the canvas context', () => {
    const container = document.createElement('div');
    container.setAttribute('data-canvas-container', 'true');
    document.body.appendChild(container);

    const outsideButton = document.createElement('button');
    outsideButton.type = 'button';
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    renderHook(() =>
      useCanvasPaste({
        lastPointerPosition: { current: null },
        viewportBounds: { x: 100, y: 200, width: 400, height: 300 },
      }),
    );

    const event = dispatchPaste('outside paste');

    expect(event.defaultPrevented).toBe(false);
    expect(mockStoreState.addText).not.toHaveBeenCalled();
    expect(mockStoreState.selectElement).not.toHaveBeenCalled();
    expect(mockStoreState.startEditingText).not.toHaveBeenCalled();
  });

  it('ignores paste when an editable element already owns focus', () => {
    const container = document.createElement('div');
    container.setAttribute('data-canvas-container', 'true');
    const input = document.createElement('input');
    container.appendChild(input);
    document.body.appendChild(container);
    input.focus();

    renderHook(() =>
      useCanvasPaste({
        lastPointerPosition: { current: null },
        viewportBounds: { x: 10, y: 20, width: 300, height: 200 },
      }),
    );

    const event = dispatchPaste('editable owns focus');

    expect(event.defaultPrevented).toBe(false);
    expect(mockStoreState.addText).not.toHaveBeenCalled();
  });
});
