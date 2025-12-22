
import { Employee, AttendanceRecord, LeaveRequest, PerformanceReview, JobPosting, Candidate, TrainingProgram, HRTemplate, WorkforceAnalytics, HRStats } from './types';

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: 'أحمد محمد العلي',
    email: 'ahmed.ali@supra.sa',
    phone: '+966501234567',
    position: 'مطور أول',
    department: 'التقنية',
    hireDate: '2023-01-15',
    employeeId: 'SUP-001',
    status: 'active',
    salary: 8000,
    manager: 'محمد سعد',
    skills: [
      { id: 'sk1', name: 'React', level: 'advanced', category: 'Frontend', lastAssessed: '2024-06-01' },
      { id: 'sk2', name: 'TypeScript', level: 'intermediate', category: 'Programming', lastAssessed: '2024-05-15' },
      { id: 'sk3', name: 'Node.js', level: 'intermediate', category: 'Backend', lastAssessed: '2024-04-20' }
    ],
    emergencyContact: {
      name: 'فاطمة العلي',
      relationship: 'زوجة',
      phone: '+966507654321',
      email: 'fatima@example.com'
    },
    documents: [
      { id: 'd1', name: 'عقد العمل', type: 'contract', uploadDate: '2023-01-10', url: '/docs/contract1.pdf' },
      { id: 'd2', name: 'شهادة البكالوريوس', type: 'certificate', uploadDate: '2023-01-10', url: '/docs/degree1.pdf' }
    ]
  },
  {
    id: 'emp-002',
    name: 'سارة أحمد الزهراني',
    email: 'sarah.zahrani@supra.sa',
    phone: '+966502345678',
    position: 'مصممة UX/UI',
    department: 'التصميم',
    hireDate: '2023-03-20',
    employeeId: 'SUP-002',
    status: 'active',
    salary: 7000,
    manager: 'نورا خالد',
    skills: [
      { id: 'sk4', name: 'Figma', level: 'expert', category: 'Design', lastAssessed: '2024-06-10' },
      { id: 'sk5', name: 'Adobe Creative Suite', level: 'advanced', category: 'Design', lastAssessed: '2024-05-20' },
      { id: 'sk6', name: 'User Research', level: 'intermediate', category: 'UX', lastAssessed: '2024-04-15' }
    ],
    emergencyContact: {
      name: 'أحمد الزهراني',
      relationship: 'والد',
      phone: '+966503456789'
    },
    documents: [
      { id: 'd3', name: 'عقد العمل', type: 'contract', uploadDate: '2023-03-15', url: '/docs/contract2.pdf' }
    ]
  },
  {
    id: 'emp-003',
    name: 'خالد عبدالله الشمري',
    email: 'khalid.shamri@supra.sa',
    phone: '+966503456789',
    position: 'محاسب أول',
    department: 'المالية',
    hireDate: '2022-08-10',
    employeeId: 'SUP-003',
    status: 'onLeave',
    salary: 6500,
    manager: 'عبدالرحمن صالح',
    skills: [
      { id: 'sk7', name: 'محاسبة مالية', level: 'expert', category: 'Finance', lastAssessed: '2024-05-01' },
      { id: 'sk8', name: 'Excel المتقدم', level: 'advanced', category: 'Tools', lastAssessed: '2024-04-10' }
    ],
    emergencyContact: {
      name: 'نادية الشمري',
      relationship: 'زوجة',
      phone: '+966504567890'
    },
    documents: []
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-001',
    employeeId: 'emp-001',
    date: '2024-12-30',
    checkIn: '08:30',
    checkOut: '17:15',
    workHours: 8.75,
    status: 'present'
  },
  {
    id: 'att-002',
    employeeId: 'emp-002',
    date: '2024-12-30',
    checkIn: '09:00',
    checkOut: '17:30',
    workHours: 8.5,
    status: 'present'
  },
  {
    id: 'att-003',
    employeeId: 'emp-001',
    date: '2024-12-29',
    checkIn: '09:15',
    checkOut: '17:00',
    workHours: 7.75,
    status: 'late',
    notes: 'تأخير بسبب الزحام'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-003',
    type: 'annual',
    startDate: '2024-12-28',
    endDate: '2025-01-05',
    days: 7,
    status: 'approved',
    reason: 'إجازة سنوية',
    submittedDate: '2024-12-15',
    approvedBy: 'عبدالرحمن صالح',
    approvalDate: '2024-12-16'
  },
  {
    id: 'leave-002',
    employeeId: 'emp-002',
    type: 'sick',
    startDate: '2024-12-25',
    endDate: '2024-12-26',
    days: 2,
    status: 'pending',
    reason: 'وعكة صحية',
    submittedDate: '2024-12-24'
  }
];

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: 'perf-001',
    employeeId: 'emp-001',
    reviewPeriod: 'Q4 2024',
    overallRating: 4.2,
    goals: [
      {
        id: 'g1',
        title: 'تطوير مهارات React المتقدمة',
        description: 'إتقان Hooks المتقدمة وإدارة الحالة',
        targetDate: '2024-12-31',
        status: 'completed',
        progress: 100
      },
      {
        id: 'g2',
        title: 'قيادة مشروع تطوير جديد',
        description: 'قيادة فريق من 3 مطورين',
        targetDate: '2025-03-31',
        status: 'inProgress',
        progress: 65
      }
    ],
    competencies: [
      { name: 'المهارات التقنية', rating: 4.5, maxRating: 5, comments: 'ممتاز في التقنيات الحديثة' },
      { name: 'العمل الجماعي', rating: 4.0, maxRating: 5, comments: 'متعاون ومفيد للفريق' },
      { name: 'التواصل', rating: 3.8, maxRating: 5, comments: 'جيد، يحتاج تحسين في العروض التقديمية' }
    ],
    feedback: 'أداء ممتاز خلال الربع الأخير. يظهر تحسناً مستمراً في المهارات التقنية.',
    developmentPlan: [
      'دورة في مهارات العرض والتقديم',
      'ورشة عمل في إدارة الفرق',
      'شهادة في أمن المعلومات'
    ],
    reviewDate: '2024-12-15',
    reviewedBy: 'محمد سعد',
    status: 'completed'
  }
];

export const mockJobPostings: JobPosting[] = [
  {
    id: 'job-001',
    title: 'مطور Full Stack',
    department: 'التقنية',
    description: 'نبحث عن مطور Full Stack متمرس للانضمام إلى فريقنا',
    requirements: [
      'خبرة 3+ سنوات في تطوير الويب',
      'إتقان React و Node.js',
      'معرفة بقواعد البيانات',
      'مهارات حل المشاكل قوية'
    ],
    qualifications: [
      'بكالوريوس في علوم الحاسب أو مجال ذي صلة',
      'شهادات تقنية معتبرة (مفضلة)',
      'مهارات تواصل ممتازة'
    ],
    salaryRange: { min: 7000, max: 10000 },
    type: 'fullTime',
    status: 'active',
    postedDate: '2024-12-20',
    applicationDeadline: '2025-01-20',
    applicationsCount: 25
  },
  {
    id: 'job-002',
    title: 'مصمم جرافيك',
    department: 'التصميم',
    description: 'مصمم جرافيك مبدع للعمل على مشاريع العلامة التجارية',
    requirements: [
      'خبرة 2+ سنوات في التصميم الجرافيكي',
      'إتقان Adobe Creative Suite',
      'فهم قوي لمبادئ التصميم',
      'معرفة بالهوية البصرية'
    ],
    qualifications: [
      'بكالوريوس في التصميم الجرافيكي',
      'معرض أعمال قوي',
      'مهارات إبداعية متميزة'
    ],
    salaryRange: { min: 5000, max: 8000 },
    type: 'fullTime',
    status: 'active',
    postedDate: '2024-12-25',
    applicationDeadline: '2025-01-25',
    applicationsCount: 18
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-001',
    name: 'عمر الغامدي',
    email: 'omar.ghamdi@example.com',
    phone: '+966505678901',
    position: 'مطور Full Stack',
    resume: '/resumes/omar-resume.pdf',
    applicationDate: '2024-12-22',
    status: 'interview',
    interviews: [
      {
        id: 'int-001',
        candidateId: 'cand-001',
        interviewerName: 'محمد سعد',
        scheduledDate: '2025-01-02T10:00:00',
        type: 'video',
        status: 'scheduled'
      }
    ],
    notes: 'مرشح واعد، خبرة جيدة في React',
    aiScore: 85
  },
  {
    id: 'cand-002',
    name: 'منى العتيبي',
    email: 'mona.otaibi@example.com',
    phone: '+966506789012',
    position: 'مصمم جرافيك',
    resume: '/resumes/mona-resume.pdf',
    applicationDate: '2024-12-26',
    status: 'screening',
    interviews: [],
    notes: 'معرض أعمال ممتاز، تحتاج لمقابلة فنية',
    aiScore: 78
  }
];

export const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: 'train-001',
    title: 'أساسيات الأمن السيبراني',
    description: 'دورة شاملة في أساسيات الأمن السيبراني وحماية البيانات',
    category: 'أمن المعلومات',
    duration: 16,
    format: 'online',
    instructor: 'د. عبدالله الشهري',
    maxParticipants: 25,
    enrolledCount: 18,
    startDate: '2025-01-15',
    endDate: '2025-01-30',
    status: 'upcoming',
    materials: ['كتيب الدورة', 'عروض تقديمية', 'تمارين عملية'],
    cost: 2500
  },
  {
    id: 'train-002',
    title: 'مهارات القيادة الفعالة',
    description: 'تطوير مهارات القيادة وإدارة الفرق',
    category: 'القيادة والإدارة',
    duration: 24,
    format: 'hybrid',
    instructor: 'أ. نوال الحربي',
    maxParticipants: 20,
    enrolledCount: 15,
    startDate: '2025-02-01',
    endDate: '2025-02-20',
    status: 'upcoming',
    materials: ['دليل القائد', 'دراسات حالة', 'أدوات التقييم'],
    cost: 3500
  }
];

export const mockHRTemplates: HRTemplate[] = [
  {
    id: 'temp-001',
    name: 'عقد عمل أساسي',
    category: 'contract',
    description: 'نموذج عقد عمل للموظفين بدوام كامل',
    fileUrl: '/templates/basic-contract.docx',
    lastModified: '2024-12-01',
    usageCount: 45,
    createdBy: 'إدارة الموارد البشرية',
    tags: ['عقد', 'دوام كامل', 'أساسي']
  },
  {
    id: 'temp-002',
    name: 'نموذج تقييم الأداء',
    category: 'evaluation',
    description: 'نموذج شامل لتقييم أداء الموظفين',
    fileUrl: '/templates/performance-evaluation.docx',
    lastModified: '2024-11-15',
    usageCount: 28,
    createdBy: 'إدارة الموارد البشرية',
    tags: ['تقييم', 'أداء', 'مراجعة']
  },
  {
    id: 'temp-003',
    name: 'طلب إجازة',
    category: 'form',
    description: 'نموذج طلب الإجازات بأنواعها المختلفة',
    fileUrl: '/templates/leave-request.pdf',
    lastModified: '2024-10-20',
    usageCount: 156,
    createdBy: 'إدارة الموارد البشرية',
    tags: ['إجازة', 'طلب', 'نموذج']
  }
];

export const mockWorkforceAnalytics: WorkforceAnalytics = {
  totalEmployees: 156,
  activeEmployees: 148,
  newHires: 12,
  turnoverRate: 8.5,
  averageAge: 32,
  genderDistribution: {
    male: 89,
    female: 67
  },
  departmentDistribution: [
    { department: 'التقنية', count: 45, percentage: 28.8 },
    { department: 'التسويق', count: 32, percentage: 20.5 },
    { department: 'المالية', count: 28, percentage: 17.9 },
    { department: 'الموارد البشرية', count: 18, percentage: 11.5 },
    { department: 'القانونية', count: 15, percentage: 9.6 },
    { department: 'العمليات', count: 18, percentage: 11.5 }
  ],
  skillsGaps: [
    { skill: 'الذكاء الاصطناعي', currentLevel: 2.5, requiredLevel: 4.0, gap: 1.5 },
    { skill: 'تحليل البيانات', currentLevel: 3.2, requiredLevel: 4.5, gap: 1.3 },
    { skill: 'إدارة المشاريع', currentLevel: 3.8, requiredLevel: 4.2, gap: 0.4 }
  ],
  performanceDistribution: {
    excellent: 28,
    good: 67,
    satisfactory: 45,
    needsImprovement: 16
  }
};

export const mockHRStats: HRStats = {
  totalEmployees: 156,
  activeEmployees: 148,
  onLeave: 8,
  newHires: 12,
  pendingReviews: 23,
  openPositions: 6,
  upcomingTraining: 4,
  attendanceRate: 94.2
};
