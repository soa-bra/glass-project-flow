/**
 * Shared Services Index
 * فهرس الخدمات المشتركة
 */

// Approvals Service
export {
  EnhancedApprovalsService,
  enhancedApprovalsService,
  createApprovalRequest,
  type ApprovalRequestInput,
  type ApprovalRequest,
  type ApprovalEvent,
} from './approvals';

// Feature Store Service
export {
  FeatureStoreService,
  featureStore,
  initFeatureStore,
  writeFeatures,
  readLatest,
  readTimeSeries,
  type FeatureWriteInput,
  type FeatureReadOptions,
} from './feature-store';

// Sequence Service
export {
  SequenceService,
  sequenceService,
  nextVal,
} from './sequence';
