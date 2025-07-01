
import { Course, CourseModule, TrainingSession } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'COURSE-001',
    title: 'مسار التأهيل للموظفين الجدد',
    description: 'برنامج تأهيل شامل يغطي ثقافة سوبرا وسياسات الجودة وأساسيات علم اجتماع العلامة التجارية',
    category: 'onboarding',
    type: 'internal',
    duration: 40,
    status: 'published',
    instructor: 'د. أحمد المحمد',
    maxStudents: 25,
    prerequisites: [],
    skills: ['ثقافة المؤسسة', 'علم اجتماع العلامة التجارية', 'سياسات الجودة'],
    scormCompliant: true,
    xApiEnabled: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-06-01',
    modules: [
      {
        id: 'MOD-001-1',
        courseId: 'COURSE-001',
        title: 'مقدمة في ثقافة سوبرا',
        description: 'التعرف على قيم ورؤية ورسالة سوبرا',
        order: 1,
        type: 'video',
        content: 'intro-video-url',
        duration: 120,
        completionCriteria: {
          type: 'time_based',
          threshold: 100
        },
        resources: []
      },
      {
        id: 'MOD-001-2',
        courseId: 'COURSE-001',
        title: 'أساسيات علم اجتماع العلامة التجارية',
        description: 'المفاهيم الأساسية لعلم اجتماع العلامة التجارية',
        order: 2,
        type: 'document',
        content: 'brand-sociology-basics.pdf',
        duration: 180,
        completionCriteria: {
          type: 'assessment_based',
          threshold: 80
        },
        resources: []
      }
    ]
  },
  {
    id: 'COURSE-002',
    title: 'تحليل الهوية الثقافية المؤسسية',
    description: 'ورشة عمل متخصصة في تحليل الهوية الثقافية وتطبيقها في استراتيجيات العلامة التجارية',
    category: 'workshop',
    type: 'external',
    duration: 16,
    status: 'published',
    instructor: 'د. سارة العلي',
    maxStudents: 15,
    prerequisites: ['COURSE-001'],
    skills: ['تحليل الهوية الثقافية', 'استراتيجية العلامة التجارية'],
    scormCompliant: false,
    xApiEnabled: true,
    createdAt: '2024-02-20',
    updatedAt: '2024-06-15',
    modules: []
  },
  {
    id: 'COURSE-003',
    title: 'إدارة المشاريع باستخدام المنهجيات الرشيقة',
    description: 'برنامج تقني متقدم في إدارة المشاريع باستخدام Agile وScrum',
    category: 'technical',
    type: 'internal',
    duration: 32,
    status: 'published',
    instructor: 'م. خالد الأحمد',
    maxStudents: 20,
    prerequisites: [],
    skills: ['إدارة المشاريع', 'Agile', 'Scrum', 'القيادة التقنية'],
    scormCompliant: true,
    xApiEnabled: true,
    createdAt: '2024-03-10',
    updatedAt: '2024-06-20',
    modules: []
  }
];

export const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'SESSION-001',
    courseId: 'COURSE-002',
    title: 'ورشة تحليل الهوية الثقافية - المجموعة الأولى',
    instructor: 'د. سارة العلي',
    type: 'workshop',
    scheduledAt: '2024-07-15T09:00:00Z',
    duration: 480,
    location: 'قاعة التدريب - المبنى الرئيسي',
    maxAttendees: 15,
    registeredCount: 12,
    waitingList: ['EMP-045', 'EMP-067'],
    status: 'scheduled',
    materials: [
      {
        id: 'MAT-001',
        type: 'document',
        title: 'دليل تحليل الهوية الثقافية',
        url: '/materials/cultural-identity-guide.pdf'
      }
    ]
  },
  {
    id: 'SESSION-002',
    courseId: 'COURSE-003',
    title: 'جلسة Scrum Master Certification',
    instructor: 'م. خالد الأحمد',
    type: 'live',
    scheduledAt: '2024-07-20T14:00:00Z',
    duration: 240,
    location: 'https://meet.supra.com/scrum-training',
    maxAttendees: 20,
    registeredCount: 18,
    waitingList: [],
    status: 'scheduled',
    meetingLink: 'https://meet.supra.com/scrum-training',
    materials: []
  }
];
