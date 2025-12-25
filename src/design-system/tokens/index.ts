/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Tokens Entry Point - Unified Exports
 * نقطة التصدير الموحدة لجميع التوكنات
 * 
 * @version 1.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// Design System Tokens (Foundation)
// ─────────────────────────────────────────────────────────────────────────────
export {
  // Colors
  DS_COLORS,
  
  // Spacing
  DS_SPACING,
  DS_GAP,
  
  // Radius
  DS_RADIUS,
  
  // Elevation
  DS_ELEVATION,
  
  // Motion
  DS_DURATION,
  DS_EASE,
  DS_TRANSITION,
  DS_MOTION,
  
  // Z-Index
  DS_Z_INDEX,
  
  // Typography
  DS_FONT_FAMILY,
  DS_FONT_WEIGHT,
  DS_FONT_SIZE,
  DS_LINE_HEIGHT,
  DS_TRACKING,
  DS_TEXT,
  DS_TYPOGRAPHY,
  
  // Combined
  DS,
} from './ds-tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Operating Components Tokens (Application Layer)
// ─────────────────────────────────────────────────────────────────────────────
export {
  // Project
  OC_PROJECT,
  
  // Task
  OC_TASK,
  
  // Canvas
  OC_CANVAS,
  
  // Status
  OC_STATUS,
  
  // Priority
  OC_PRIORITY,
  
  // Visual Data
  OC_CHART,
  OC_PROGRESS,
  OC_KPI,
  OC_SCROLL,
  
  // Financial
  OC_FINANCIAL,
  
  // Combined
  OC,
} from './oc-tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Default Export
// ─────────────────────────────────────────────────────────────────────────────
import { DS } from './ds-tokens';
import { OC } from './oc-tokens';

export const TOKENS = {
  DS,
  OC,
} as const;

export default TOKENS;
