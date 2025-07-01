
import { Enrollment, Certificate, EmployeeSkillMatrix } from '../types';

export const mockEnrollments: Enrollment[] = [
  {
    id: 'ENR-001',
    courseId: 'COURSE-001',
    studentId: 'EMP-001',
    enrolledAt: '2024-06-01T09:00:00Z',
    status: 'completed',
    progress: 100,
    completedModules: ['MOD-001-1', 'MOD-001-2'],
    timeSpent: 300,
    lastAccessed: '2024-06-25T16:30:00Z',
    certificateIssued: true,
    grade: 92
  },
  {
    id: 'ENR-002',
    courseId: 'COURSE-002',
    studentId: 'EMP-002',
    enrolledAt: '2024-06-15T10:00:00Z',
    status: 'in_progress',
    progress: 65,
    completedModules: [],
    timeSpent: 120,
    lastAccessed: '2024-06-28T14:20:00Z',
    certificateIssued: false
  },
  {
    id: 'ENR-003',
    courseId: 'COURSE-003',
    studentId: 'EMP-003',
    enrolledAt: '2024-06-10T08:30:00Z',
    status: 'enrolled',
    progress: 0,
    completedModules: [],
    timeSpent: 0,
    lastAccessed: '2024-06-10T08:30:00Z',
    certificateIssued: false
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'CERT-001',
    courseId: 'COURSE-001',
    studentId: 'EMP-001',
    issuedAt: '2024-06-25T17:00:00Z',
    certificateNumber: 'SUPRA-2024-001',
    digitalBadgeUrl: '/badges/onboarding-complete.png',
    skills: ['ثقافة المؤسسة', 'علم اجتماع العلامة التجارية'],
    score: 92,
    instructor: 'د. أحمد المحمد',
    verificationCode: 'VER-ABC123'
  }
];

export const mockEmployeeSkillMatrix: EmployeeSkillMatrix[] = [
  {
    employeeId: 'EMP-001',
    skills: [
      {
        skillId: 'SKILL-001',
        currentLevel: 'intermediate',
        targetLevel: 'advanced',
        lastUpdated: '2024-06-25',
        certificationsEarned: ['CERT-001']
      },
      {
        skillId: 'SKILL-002',
        currentLevel: 'beginner',
        targetLevel: 'intermediate',
        lastUpdated: '2024-06-01',
        certificationsEarned: []
      }
    ]
  }
];
