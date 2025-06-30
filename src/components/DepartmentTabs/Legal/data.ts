
import { LegalMetrics, Contract, LegalCase, ComplianceItem, RiskAssessment, License, Alert } from './types';

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

export const mockContracts: Contract[] = [
  {
    id: 'CTR-001',
    title: 'عقد خدمات استشارية - شركة الأمل',
    client: 'شركة الأمل للتطوير',
    type: 'service',
    status: 'signed',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    value: 250000,
    signatories: ['أحمد محمد', 'سارة العلي'],
    renewalDate: '2024-11-01',
    riskLevel: 'low'
  },
  {
    id: 'CTR-002',
    title: 'عقد عمل - مطور واجهات',
    client: 'سوبرا',
    type: 'employment',
    status: 'pending',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    value: 120000,
    signatories: ['خالد الأحمد'],
    riskLevel: 'medium'
  },
  {
    id: 'CTR-003',
    title: 'اتفاقية شراكة استراتيجية',
    client: 'مجموعة التقنية المتقدمة',
    type: 'partnership',
    status: 'expired',
    startDate: '2023-03-01',
    endDate: '2024-02-29',
    value: 500000,
    signatories: ['محمد الخالد', 'نورا السعد'],
    riskLevel: 'high'
  }
];

export const mockLegalCases: LegalCase[] = [
  {
    id: 'CASE-001',
    title: 'نزاع تجاري - تأخر في التسليم',
    status: 'active',
    priority: 'high',
    client: 'شركة البناء الحديث',
    assignedLawyer: 'المحامي أحمد الكريم',
    dateCreated: '2024-05-15',
    lastUpdate: '2024-06-25',
    riskLevel: 'high'
  },
  {
    id: 'CASE-002',
    title: 'مراجعة عقد توظيف',
    status: 'pending',
    priority: 'medium',
    client: 'سوبرا',
    assignedLawyer: 'المحامية سارة المحمد',
    dateCreated: '2024-06-10',
    lastUpdate: '2024-06-20',
    riskLevel: 'low'
  },
  {
    id: 'CASE-003',
    title: 'انتهاك حقوق الملكية الفكرية',
    status: 'escalated',
    priority: 'high',
    client: 'مؤسسة الإبداع التقني',
    assignedLawyer: 'المحامي محمد العلي',
    dateCreated: '2024-04-20',
    lastUpdate: '2024-06-28',
    riskLevel: 'critical'
  }
];

export const mockComplianceItems: ComplianceItem[] = [
  {
    id: 'COMP-001',
    requirement: 'سياسة حماية البيانات الشخصية',
    category: 'data_protection',
    status: 'compliant',
    lastReview: '2024-05-01',
    nextReview: '2024-11-01',
    responsible: 'مسؤول حماية البيانات',
    documents: ['سياسة الخصوصية', 'إجراءات الأمان']
  },
  {
    id: 'COMP-002',
    requirement: 'التزامات قانون العمل السعودي',
    category: 'labor',
    status: 'action_required',
    lastReview: '2024-03-15',
    nextReview: '2024-09-15',
    responsible: 'إدارة الموارد البشرية',
    documents: ['عقود العمل', 'لوائح داخلية']
  },
  {
    id: 'COMP-003',
    requirement: 'امتثال ضريبة القيمة المضافة',
    category: 'tax',
    status: 'pending_review',
    lastReview: '2024-06-01',
    nextReview: '2024-07-01',
    responsible: 'المحاسب القانوني',
    documents: ['الإقرارات الضريبية', 'الفواتير']
  }
];

export const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'RISK-001',
    title: 'مخاطر انتهاك حقوق الملكية الفكرية',
    description: 'احتمالية استخدام محتوى محمي بحقوق الطبع والنشر',
    category: 'legal',
    riskLevel: 'high',
    probability: 3,
    impact: 4,
    mitigationStrategy: 'مراجعة دورية للمحتوى وتدريب الفريق',
    status: 'under_review',
    assignedTo: 'فريق الشؤون القانونية',
    dateIdentified: '2024-06-15',
    targetResolution: '2024-07-15'
  },
  {
    id: 'RISK-002',
    title: 'عدم الامتثال للوائح حماية البيانات',
    description: 'مخاطر عدم الالتزام بقوانين حماية البيانات الشخصية',
    category: 'compliance',
    riskLevel: 'medium',
    probability: 2,
    impact: 3,
    mitigationStrategy: 'تحديث السياسات وتدريب الموظفين',
    status: 'mitigated',
    assignedTo: 'مسؤول حماية البيانات',
    dateIdentified: '2024-05-20',
    targetResolution: '2024-06-20'
  }
];

export const mockLicenses: License[] = [
  {
    id: 'LIC-001',
    name: 'ترخيص مزاولة النشاط التجاري',
    type: 'business',
    status: 'active',
    issuer: 'وزارة التجارة',
    issueDate: '2023-01-15',
    expiryDate: '2025-01-15',
    renewalCost: 5000,
    documents: ['الترخيص الأصلي', 'شهادة التجديد']
  },
  {
    id: 'LIC-002',
    name: 'ترخيص برمجيات Adobe Creative Suite',
    type: 'software',
    status: 'pending_renewal',
    issuer: 'Adobe Systems',
    issueDate: '2023-07-01',
    expiryDate: '2024-07-01',
    renewalCost: 15000,
    documents: ['اتفاقية الترخيص', 'فاتورة الشراء']
  },
  {
    id: 'LIC-003',
    name: 'تسجيل العلامة التجارية - سوبرا',
    type: 'intellectual_property',
    status: 'active',
    issuer: 'الهيئة السعودية للملكية الفكرية',
    issueDate: '2022-03-20',
    expiryDate: '2032-03-20',
    renewalCost: 8000,
    documents: ['شهادة التسجيل', 'وصف العلامة']
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALERT-001',
    type: 'contract_expiry',
    message: 'عقد الشراكة مع مجموعة التقنية المتقدمة سينتهي خلال 30 يوماً',
    priority: 'high',
    dateCreated: '2024-06-01',
    dueDate: '2024-07-01',
    status: 'pending',
    relatedItem: 'CTR-003'
  },
  {
    id: 'ALERT-002',
    type: 'license_renewal',
    message: 'ترخيص Adobe Creative Suite يحتاج للتجديد',
    priority: 'medium',
    dateCreated: '2024-06-15',
    dueDate: '2024-07-01',
    status: 'acknowledged',
    relatedItem: 'LIC-002'
  },
  {
    id: 'ALERT-003',
    type: 'compliance_deadline',
    message: 'موعد مراجعة سياسة حماية البيانات',
    priority: 'medium',
    dateCreated: '2024-06-20',
    dueDate: '2024-07-01',
    status: 'pending',
    relatedItem: 'COMP-001'
  }
];
