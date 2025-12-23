/**
 * @deprecated هذا الملف مُهمَل. استخدم '@/shared/services/feature-store' بدلاً منه.
 * سيتم إزالته في الإصدار 2.0.0
 * 
 * This file is deprecated. Use '@/shared/services/feature-store' instead.
 * Will be removed in version 2.0.0
 */

import { deprecated } from '@/utils/deprecation';

// Re-export from new location
export {
  FeatureStoreService,
  featureStore,
  initFeatureStore,
  writeFeatures,
  readLatest,
  readTimeSeries,
  type FeatureWriteInput,
  type FeatureReadOptions,
} from '@/shared/services/feature-store';

// Show deprecation warning on import
deprecated('src/core/feature-store/fs.service.ts', {
  alternative: '@/shared/services/feature-store',
  removeInVersion: '2.0.0',
});

