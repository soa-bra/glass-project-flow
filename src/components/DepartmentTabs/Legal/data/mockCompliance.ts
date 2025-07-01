
import { ComplianceItem } from '../types';

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
