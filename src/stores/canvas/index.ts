/**
 * Canvas Store - التوافق الخلفي
 * يُعاد تصدير كل شيء من البنية الجديدة في features/planning/state
 */

// Re-export everything from the new location
export * from '@/features/planning/state';

// Backward compatibility alias
export { usePlanningStore as useCanvasStore } from '@/features/planning/state';
export type { PlanningStore as CanvasStore } from '@/features/planning/state';
