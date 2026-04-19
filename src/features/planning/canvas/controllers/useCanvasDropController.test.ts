import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useCanvasDropController } from './useCanvasDropController';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { toast } from 'sonner';
import { canvasKernel, getContainerRect } from '@/engine/canvas/kernel/canvasKernel';

const mockAddElement = vi.fn();
const mockAddSmartElement = vi.fn();

vi.mock('@/stores/canvasStore', () => ({
  useCanvasStore: vi.fn((selector: (state: { addElement: typeof mockAddElement }) => unknown) =>
    selector({ addElement: mockAddElement }),
  ),
}));

vi.mock('@/stores/smartElementsStore', () => ({
  useSmartElementsStore: {
    getState: vi.fn(() => ({ addSmartElement: mockAddSmartElement })),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('@/engine/canvas/kernel/canvasKernel', () => ({
  canvasKernel: {
    screenToWorld: vi.fn(),
  },
  getContainerRect: vi.fn(),
}));

describe('useCanvasDropController', () => {
  const viewport = { zoom: 1, pan: { x: 0, y: 0 } };
  const containerRef = { current: document.createElement('div') } as any;
  const containerRect = {
    left: 0,
    top: 0,
    width: 1000,
    height: 700,
    right: 1000,
    bottom: 700,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getContainerRect).mockReturnValue(containerRect);
    vi.mocked(canvasKernel.screenToWorld).mockReturnValue({ x: 120, y: 80 });
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test-url'),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adds a smart element when smart element payload exists', () => {
    const { result } = renderHook(() => useCanvasDropController({ containerRef, viewport }));

    const preventDefault = vi.fn();
    const event = {
      preventDefault,
      clientX: 300,
      clientY: 200,
      dataTransfer: {
        getData: vi.fn(() => JSON.stringify({ type: 'kanban', name: 'لوحة كانبان' })),
        files: [],
      },
    } as any;

    act(() => {
      result.current.handleFileDrop(event);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(useSmartElementsStore.getState).toHaveBeenCalled();
    expect(mockAddSmartElement).toHaveBeenCalledWith('kanban', { x: 120, y: 80 }, { title: 'لوحة كانبان' });
    expect(toast.success).toHaveBeenCalledWith('تم إدراج لوحة كانبان');
    expect(mockAddElement).not.toHaveBeenCalled();
  });

  it('adds an image element when an image file is dropped', () => {
    const { result } = renderHook(() => useCanvasDropController({ containerRef, viewport }));

    const file = new File(['image'], 'hero.png', { type: 'image/png' });
    const event = {
      preventDefault: vi.fn(),
      clientX: 10,
      clientY: 20,
      dataTransfer: {
        getData: vi.fn(() => ''),
        files: [file],
      },
    } as any;

    act(() => {
      result.current.handleFileDrop(event);
    });

    expect(mockAddElement).toHaveBeenCalledWith({
      type: 'image',
      position: { x: 120, y: 80 },
      size: { width: 300, height: 200 },
      src: 'blob:test-url',
      alt: 'hero.png',
    });
    expect(toast.success).toHaveBeenCalledWith('تم إدراج الصورة: hero.png');
  });

  it('adds a file element when a non-image file is dropped', () => {
    const { result } = renderHook(() => useCanvasDropController({ containerRef, viewport }));

    const file = new File(['hello'], 'brief.pdf', { type: 'application/pdf' });
    const event = {
      preventDefault: vi.fn(),
      clientX: 50,
      clientY: 60,
      dataTransfer: {
        getData: vi.fn(() => ''),
        files: [file],
      },
    } as any;

    act(() => {
      result.current.handleFileDrop(event);
    });

    expect(mockAddElement).toHaveBeenCalledWith({
      type: 'file',
      position: { x: 120, y: 80 },
      size: { width: 250, height: 120 },
      fileName: 'brief.pdf',
      fileType: 'application/pdf',
      fileSize: file.size,
      fileUrl: 'blob:test-url',
    });
    expect(toast.success).toHaveBeenCalledWith('تم إدراج الملف: brief.pdf');
  });

  it('returns early when container rect is unavailable', () => {
    vi.mocked(getContainerRect).mockReturnValue(null);
    const { result } = renderHook(() => useCanvasDropController({ containerRef, viewport }));

    const event = {
      preventDefault: vi.fn(),
      clientX: 0,
      clientY: 0,
      dataTransfer: {
        getData: vi.fn(() => ''),
        files: [],
      },
    } as any;

    act(() => {
      result.current.handleFileDrop(event);
    });

    expect(mockAddElement).not.toHaveBeenCalled();
    expect(mockAddSmartElement).not.toHaveBeenCalled();
  });

  it('prevents default on drag over', () => {
    const { result } = renderHook(() => useCanvasDropController({ containerRef, viewport }));
    const event = { preventDefault: vi.fn() } as any;

    act(() => {
      result.current.handleFileDragOver(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
