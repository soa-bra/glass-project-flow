
import { TrainingMetrics, LearningROI, SkillGapAlert, CorporateProgram } from '../types';

export const mockTrainingMetrics: TrainingMetrics = {
  totalCourses: 24,
  activeLearners: 156,
  completionRate: 78.5,
  averageScore: 84.2,
  totalHoursDelivered: 1248,
  certificatesIssued: 89,
  monthlyStats: {
    newEnrollments: 34,
    coursesCompleted: 28,
    sessionsConducted: 12,
    revenue: 185000
  },
  kirkpatrickMetrics: {
    reaction: 4.3,
    learning: 4.1,
    behavior: 3.8,
    results: 3.9
  }
};

export const mockLearningROI: LearningROI[] = [
  {
    courseId: 'COURSE-001',
    totalCost: 45000,
    trainingHours: 1000,
    participantCount: 25,
    performanceImprovement: 23.5,
    businessImpact: 125000,
    roi: 177.8,
    calculatedAt: '2024-06-30'
  },
  {
    courseId: 'COURSE-002',
    totalCost: 28000,
    trainingHours: 320,
    participantCount: 20,
    performanceImprovement: 31.2,
    businessImpact: 89000,
    roi: 217.9,
    calculatedAt: '2024-06-30'
  }
];

export const mockSkillGapAlerts: SkillGapAlert[] = [
  {
    id: '1',
    area: 'التسويق الرقمي',
    severity: 'high',
    affectedEmployees: ['EMP-001', 'EMP-002', 'EMP-003'],
    recommendedCourses: ['COURSE-001', 'COURSE-003'],
    businessImpact: 'تأثير على استراتيجية التسويق الرقمي للشركة',
    createdAt: '2024-06-15',
    status: 'open'
  },
  {
    id: '2',
    area: 'تحليل البيانات',
    severity: 'medium',
    affectedEmployees: ['EMP-004', 'EMP-005'],
    recommendedCourses: ['COURSE-004'],
    businessImpact: 'قدرة محدودة على تحليل بيانات العملاء',
    createdAt: '2024-06-10',
    status: 'addressing'
  }
];

export const mockCorporatePrograms: CorporateProgram[] = [
  {
    id: '1',
    clientId: 'CLIENT-001',
    title: 'برنامج تطوير القيادات التنفيذية',
    description: 'برنامج شامل لتطوير مهارات القيادة والإدارة للمستويات التنفيذية',
    customCourses: ['COURSE-001', 'COURSE-002'],
    contractValue: 450000,
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    status: 'in_progress',
    participantCount: 25,
    needsAssessment: {
      id: 'NA-001',
      clientId: 'CLIENT-001',
      conductedBy: 'د. أحمد المحمد',
      completedAt: '2023-12-20',
      skillGaps: [
        {
          area: 'القيادة الاستراتيجية',
          currentLevel: 60,
          targetLevel: 85,
          priority: 'high'
        }
      ],
      recommendations: ['تدريب مكثف على القيادة', 'ورش عمل تطبيقية'],
      estimatedDuration: 120,
      proposedSolutions: ['برنامج القيادة التنفيذية']
    }
  },
  {
    id: '2',
    clientId: 'CLIENT-002',
    title: 'برنامج التسويق الرقمي المتقدم',
    description: 'برنامج متخصص في استراتيجيات التسويق الرقمي الحديثة',
    customCourses: ['COURSE-003'],
    contractValue: 280000,
    startDate: '2024-03-01',
    endDate: '2024-05-30',
    status: 'completed',
    participantCount: 18,
    needsAssessment: {
      id: 'NA-002',
      clientId: 'CLIENT-002',
      conductedBy: 'أ. فاطمة العلي',
      completedAt: '2024-02-10',
      skillGaps: [
        {
          area: 'التسويق الرقمي',
          currentLevel: 45,
          targetLevel: 80,
          priority: 'high'
        }
      ],
      recommendations: ['دورات متخصصة في وسائل التواصل الاجتماعي'],
      estimatedDuration: 80,
      proposedSolutions: ['برنامج التسويق الرقمي']
    }
  }
];
