/**
 * @deprecated هذا الملف مُهمَل. استخدم '@/shared/services/sequence' بدلاً منه.
 * سيتم إزالته في الإصدار 2.0.0
 * 
 * This file is deprecated. Use '@/shared/services/sequence' instead.
 * Will be removed in version 2.0.0
 */

import { deprecated } from '@/utils/deprecation';

// Re-export from new location
export {
  SequenceService,
  sequenceService,
  nextVal,
} from '@/shared/services/sequence';

// Show deprecation warning on import
deprecated('src/core/sequence/sequence.service.ts', {
  alternative: '@/shared/services/sequence',
  removeInVersion: '2.0.0',
});