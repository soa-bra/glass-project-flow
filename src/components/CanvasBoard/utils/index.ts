// Export all utility modules
export * from './errorHandling';
export * from './performance';

// Type exports
export type { CanvasError } from './errorHandling';

// Singleton exports
export { canvasErrorManager } from './errorHandling';
export { performanceMonitor, animationLoop } from './performance';