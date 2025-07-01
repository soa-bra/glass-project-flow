
import { Alert } from '../types';

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
