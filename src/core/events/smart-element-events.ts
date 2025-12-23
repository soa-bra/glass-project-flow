/**
 * Smart Element Events - Re-export from Engine Canvas
 * @deprecated استخدم @/engine/canvas/events/smart-element-events بدلاً من ذلك
 */

import { deprecated } from '@/utils/deprecation';

deprecated('src/core/events/smart-element-events.ts', {
  alternative: '@/engine/canvas/events/smart-element-events',
  removeInVersion: '2.0.0'
});

export * from '@/engine/canvas/events/smart-element-events';
