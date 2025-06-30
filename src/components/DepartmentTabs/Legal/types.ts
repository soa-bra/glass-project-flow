
// Legal Dashboard Types
export interface ContractStatus {
  signed: number;
  pending: number;
  expired: number;
  underReview: number;
}

export interface LegalCase {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'resolved' | 'escalated';
  priority: 'high' | 'medium' | 'low';
  client: string;
  assignedLawyer: string;
  dateCreated: string;
  lastUpdate: string;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface Contract {
  id: string;
  title: string;
  client: string;
  type: 'service' | 'employment' | 'partnership' | 'confidentiality' | 'supplier';
  status: 'draft' | 'pending' | 'signed' | 'expired' | 'terminated';
  startDate: string;
  endDate: string;
  value: number;
  signatories: string[];
  renewalDate?: string;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  category: 'labor' | 'tax' | 'data_protection' | 'intellectual_property' | 'professional';
  status: 'compliant' | 'non_compliant' | 'pending_review' | 'action_required';
  lastReview: string;
  nextReview: string;
  responsible: string;
  documents: string[];
}

export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'compliance' | 'contract' | 'litigation';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  probability: number; // 1-5 scale
  impact: number; // 1-5 scale
  mitigationStrategy: string;
  status: 'identified' | 'under_review' | 'mitigated' | 'accepted';
  assignedTo: string;
  dateIdentified: string;
  targetResolution: string;
}

export interface License {
  id: string;
  name: string;
  type: 'business' | 'professional' | 'software' | 'intellectual_property';
  status: 'active' | 'expired' | 'pending_renewal' | 'suspended';
  issuer: string;
  issueDate: string;
  expiryDate: string;
  renewalCost: number;
  documents: string[];
}

export interface LegalTemplate {
  id: string;
  name: string;
  category: 'contract' | 'agreement' | 'policy' | 'form' | 'letter';
  type: string;
  description: string;
  lastModified: string;
  createdBy: string;
  usage: number;
  status: 'active' | 'archived' | 'draft';
}

export interface Alert {
  id: string;
  type: 'contract_expiry' | 'compliance_deadline' | 'license_renewal' | 'court_date' | 'payment_due';
  message: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dateCreated: string;
  dueDate: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  relatedItem: string;
}

export interface LegalMetrics {
  contractsCount: ContractStatus;
  activeCases: number;
  complianceScore: number;
  riskScore: number;
  pendingAlerts: number;
  monthlyStats: {
    contractsSigned: number;
    casesResolved: number;
    complianceChecks: number;
    riskAssessments: number;
  };
}
