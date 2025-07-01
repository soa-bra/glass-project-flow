
import { RiskAssessment } from '../types';

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
