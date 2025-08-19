/// <reference types="vitest/globals" />
import { cleanup } from '@testing-library/react';

// Clean up after each test case
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
const mockIntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
  takeRecords() { return []; }
};

(globalThis as any).IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
const mockResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

(globalThis as any).ResizeObserver = mockResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});