
import { LegalCase } from '../types';

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
