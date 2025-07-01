
import { LegalMetrics } from '../types';

export const mockLegalMetrics: LegalMetrics = {
  contractsCount: {
    signed: 45,
    pending: 12,
    expired: 8,
    underReview: 5
  },
  activeCases: 23,
  complianceScore: 85,
  riskScore: 72,
  pendingAlerts: 9,
  monthlyStats: {
    contractsSigned: 15,
    casesResolved: 8,
    complianceChecks: 32,
    riskAssessments: 12
  }
};
