
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
    id: 'ALERT-001',
    area: 'تحليل البيانات المتقدم',
    severity: 'high',
    affectedEmployees: ['EMP-015', 'EMP-023', 'EMP-031'],
    recommendedCourses: ['COURSE-DATA-001', 'COURSE-DATA-002'],
    businessImpact: 'تأثير على قدرة تحليل رؤى العملاء وتحسين استراتيجيات العلامة التجارية',
    createdAt: '2024-06-28',
    status: 'open'
  },
  {
    id: 'ALERT-002',
    area: 'إدارة المشاريع الرقمية',
    severity: 'medium',
    affectedEmployees: ['EMP-007', 'EMP-019'],
    recommendedCourses: ['COURSE-003'],
    businessImpact: 'قد يؤثر على فعالية تسليم المشاريع الرقمية',
    createdAt: '2024-06-25',
    status: 'addressing'
  }
];

export const mockCorporatePrograms: CorporateProgram[] = [
  {
    id: 'CORP-001',
    clientId: 'CLIENT-001',
    title: 'برنامج تطوير الهوية التجارية - بنك الأهلي',
    description: 'برنامج شامل لتطوير قدرات فريق التسويق في بنك الأهلي على فهم وتطبيق علم اجتماع العلامة التجارية',
    customCourses: ['COURSE-CORP-001', 'COURSE-CORP-002'],
    contractValue: 450000,
    startDate: '2024-05-01',
    endDate: '2024-08-31',
    status: 'in_progress',
    participantCount: 35,
    needsAssessment: {
      id: 'ASSESS-001',
      clientId: 'CLIENT-001',
      conductedBy: 'د. سارة العلي',
      completedAt: '2024-04-15',
      skillGaps: [
        {
          area: 'تحليل السوق الثقافي',
          currentLevel: 2,
          targetLevel: 4,
          priority: 'high'
        },
        {
          area: 'استراتيجية العلامة التجارية',
          currentLevel: 3,
          targetLevel: 5,
          priority: 'high'
        }
      ],
      recommendations: [
        'تطوير برنامج مخصص في تحليل السوق الثقافي',
        'ورش عمل تطبيقية على مشاريع حقيقية'
      ],
      estimatedDuration: 120,
      proposedSolutions: ['COURSE-CORP-001', 'COURSE-CORP-002']
    }
  }
];
