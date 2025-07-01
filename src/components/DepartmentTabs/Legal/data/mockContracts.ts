
import { Contract } from '../types';

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
