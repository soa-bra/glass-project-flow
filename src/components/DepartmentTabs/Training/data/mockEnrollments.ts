
import { Enrollment, Certificate, EmployeeSkillMatrix } from '../types';

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    courseId: 'COURSE-001',
    studentId: 'STUDENT-001',
    enrolledAt: '2024-01-15',
    status: 'completed',
    progress: 100,
    completedModules: ['MODULE-001', 'MODULE-002'],
    timeSpent: 120,
    lastAccessed: '2024-02-15',
    certificateIssued: true,
    grade: 85
  },
  {
    id: '2',
    courseId: 'COURSE-002',
    studentId: 'STUDENT-002',
    enrolledAt: '2024-02-01',
    status: 'in_progress',
    progress: 65,
    completedModules: ['MODULE-001'],
    timeSpent: 45,
    lastAccessed: '2024-02-28',
    certificateIssued: false,
    grade: 78
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: '1',
    courseId: 'COURSE-001',
    studentId: 'STUDENT-001',
    issuedAt: '2024-02-15',
    validUntil: '2025-02-15',
    certificateNumber: 'CERT-2024-001',
    digitalBadgeUrl: 'https://example.com/badge1',
    skills: ['leadership', 'strategy'],
    score: 85,
    instructor: 'د. أحمد المحمد',
    verificationCode: 'VER-001'
  },
  {
    id: '2',
    courseId: 'COURSE-002',
    studentId: 'STUDENT-002',
    issuedAt: '2024-01-20',
    certificateNumber: 'CERT-2024-002',
    digitalBadgeUrl: 'https://example.com/badge2',
    skills: ['marketing', 'digital'],
    score: 92,
    instructor: 'أ. فاطمة العلي',
    verificationCode: 'VER-002'
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
        lastUpdated: '2024-02-15',
        certificationsEarned: ['CERT-2024-001']
      },
      {
        skillId: 'SKILL-002',
        currentLevel: 'beginner',
        targetLevel: 'intermediate',
        lastUpdated: '2024-01-20',
        certificationsEarned: []
      }
    ]
  },
  {
    employeeId: 'EMP-002',
    skills: [
      {
        skillId: 'SKILL-001',
        currentLevel: 'advanced',
        targetLevel: 'expert',
        lastUpdated: '2024-02-10',
        certificationsEarned: ['CERT-2024-002']
      }
    ]
  }
];
