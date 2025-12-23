/**
 * @deprecated هذا الملف مُهمَل. استخدم '@/shared/services/approvals' بدلاً منه.
 * سيتم إزالته في الإصدار 2.0.0
 * 
 * This file is deprecated. Use '@/shared/services/approvals' instead.
 * Will be removed in version 2.0.0
 */

import { deprecated } from '@/utils/deprecation';

// Re-export from new location
export {
  EnhancedApprovalsService,
  enhancedApprovalsService,
  createApprovalRequest,
  type ApprovalRequestInput,
} from '@/shared/services/approvals';

// Show deprecation warning on import
deprecated('src/core/approvals/approvals.service.ts', {
  alternative: '@/shared/services/approvals',
  removeInVersion: '2.0.0',
});
