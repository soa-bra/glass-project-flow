/**
 * Feature Store Module
 * وحدة مخزن الميزات
 */

export {
  FeatureStoreService,
  featureStore,
  initFeatureStore,
  writeFeatures,
  readLatest,
  readTimeSeries,
  type FeatureWriteInput,
  type FeatureReadOptions,
} from './fs.service';
