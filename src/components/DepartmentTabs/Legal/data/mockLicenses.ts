
import { License } from '../types';

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
