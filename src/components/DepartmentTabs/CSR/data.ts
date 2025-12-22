
import { CSRDashboardData, CSRInitiative, CSRPartner, CSRStory, CSREvent, CSRVolunteer, CSRTemplate } from './types';

export const mockCSRInitiatives: CSRInitiative[] = [
  {
    id: 'init-001',
    title: 'برنامج محو الأمية الرقمية',
    description: 'برنامج تدريبي لتعليم المهارات الرقمية الأساسية للفئات المجتمعية المحتاجة',
    status: 'active',
    category: 'education',
    budget: 150000,
    allocatedBudget: 120000,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    beneficiaries: 500,
    sdgGoals: ['SDG 4', 'SDG 8', 'SDG 10'],
    manager: 'سارة الأحمد',
    team: ['محمد الخالد', 'فاطمة النور', 'أحمد الزهراني'],
    partnerships: ['وزارة التعليم', 'جمعية الحاسوب'],
    impact: {
      socialImpactIndex: 8.5,
      sroi: 3.2,
      volunteerHours: 480,
      directBeneficiaries: 500,
      indirectBeneficiaries: 1200
    },
    theoryOfChange: {
      problem: 'نقص المهارات الرقمية في المجتمع',
      inputs: ['المدربون', 'الأجهزة', 'المناهج'],
      activities: ['ورش تدريبية', 'جلسات فردية', 'تقييم مستمر'],
      outputs: ['500 متدرب', '50 ورشة', '20 مدرب'],
      outcomes: ['تحسن المهارات', 'زيادة فرص العمل'],
      impact: ['تقليل الفجوة الرقمية', 'تمكين اقتصادي']
    },
    kpis: [
      { id: 'kpi-001', metric: 'عدد المتدربين', target: 500, achieved: 350, unit: 'شخص' },
      { id: 'kpi-002', metric: 'معدل الإنجاز', target: 80, achieved: 85, unit: '%' },
      { id: 'kpi-003', metric: 'رضا المستفيدين', target: 90, achieved: 92, unit: '%' }
    ]
  },
  {
    id: 'init-002',
    title: 'مبادرة الطاقة النظيفة',
    description: 'تركيب أنظمة الطاقة الشمسية في المدارس والمراكز المجتمعية',
    status: 'planning',
    category: 'environment',
    budget: 300000,
    allocatedBudget: 75000,
    startDate: '2024-03-01',
    endDate: '2024-10-31',
    beneficiaries: 2000,
    sdgGoals: ['SDG 7', 'SDG 13', 'SDG 11'],
    manager: 'عبدالله المالكي',
    team: ['نوف الشهري', 'خالد البدوي'],
    partnerships: ['شركة الكهرباء', 'وزارة البيئة'],
    impact: {
      socialImpactIndex: 7.8,
      sroi: 2.8,
      volunteerHours: 200,
      directBeneficiaries: 2000,
      indirectBeneficiaries: 5000
    },
    theoryOfChange: {
      problem: 'اعتماد على الطاقة التقليدية',
      inputs: ['الألواح الشمسية', 'الفنيون', 'التمويل'],
      activities: ['التركيب', 'التدريب', 'المتابعة'],
      outputs: ['10 مراكز', '500 كيلووات', '50 فني'],
      outcomes: ['توفير الطاقة', 'تقليل التكاليف'],
      impact: ['حماية البيئة', 'استدامة الطاقة']
    },
    kpis: [
      { id: 'kpi-004', metric: 'عدد المراكز', target: 10, achieved: 3, unit: 'مركز' },
      { id: 'kpi-005', metric: 'توفير الطاقة', target: 500, achieved: 150, unit: 'كيلووات' }
    ]
  }
];

export const mockCSRPartners: CSRPartner[] = [
  {
    id: 'partner-001',
    name: 'وزارة التعليم',
    type: 'government',
    contactPerson: 'د. محمد الراشد',
    email: 'contact@moe.gov.sa',
    phone: '+966501234567',
    expertise: ['التعليم', 'المناهج', 'التدريب'],
    capacity: 'high',
    previousProjects: 15,
    rating: 4.8,
    contractId: 'CON-2024-001',
    contractStatus: 'signed',
    partnership: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      contributions: ['المناهج', 'المدربين', 'المرافق'],
      responsibilities: ['الإشراف الفني', 'التقييم', 'الشهادات']
    }
  },
  {
    id: 'partner-002',
    name: 'جمعية الحاسوب السعودية',
    type: 'ngo',
    contactPerson: 'أ. فهد الغامدي',
    email: 'info@scs.org.sa',
    phone: '+966507654321',
    expertise: ['التكنولوجيا', 'البرمجة', 'الذكاء الاصطناعي'],
    capacity: 'medium',
    previousProjects: 8,
    rating: 4.5,
    contractStatus: 'draft',
    partnership: {
      startDate: '2024-02-01',
      contributions: ['الخبرة التقنية', 'المتطوعين'],
      responsibilities: ['التدريب المتقدم', 'الاستشارات']
    }
  }
];

export const mockCSRStories: CSRStory[] = [
  {
    id: 'story-001',
    title: 'تحول حياة أم سعودية من خلال التعليم الرقمي',
    summary: 'قصة نجاح أم لثلاثة أطفال تمكنت من تعلم المهارات الرقمية وبدء مشروعها الخاص',
    content: 'في بداية العام، انضمت أم محمد إلى برنامج محو الأمية الرقمية...',
    images: ['story1-1.jpg', 'story1-2.jpg'],
    videos: ['story1-video.mp4'],
    initiativeId: 'init-001',
    publishDate: '2024-06-15',
    author: 'سارة الأحمد',
    status: 'published',
    engagement: {
      views: 2500,
      shares: 45,
      likes: 180,
      comments: 23
    },
    tags: ['تمكين', 'تعليم', 'نجاح', 'أمهات']
  }
];

export const mockCSREvents: CSREvent[] = [
  {
    id: 'event-001',
    title: 'ورشة المهارات الرقمية الأساسية',
    description: 'ورشة تدريبية لتعليم استخدام الحاسوب والإنترنت',
    type: 'workshop',
    date: '2024-07-20',
    location: 'مركز التدريب - الرياض',
    duration: 4,
    capacity: 25,
    registered: 23,
    attended: 21,
    initiativeId: 'init-001',
    organizer: 'سارة الأحمد',
    volunteers: ['محمد الخالد', 'فاطمة النور'],
    resources: ['أجهزة حاسوب', 'مواد تدريبية', 'وجبات خفيفة'],
    feedback: {
      averageRating: 4.7,
      responses: 19,
      comments: ['مفيد جداً', 'المدرب ممتاز', 'نريد المزيد']
    }
  }
];

export const mockCSRVolunteers: CSRVolunteer[] = [
  {
    id: 'vol-001',
    employeeId: 'EMP-001',
    name: 'محمد الخالد',
    department: 'التكنولوجيا',
    email: 'mohamed.alkhalid@supra.com',
    phone: '+966501111111',
    skills: ['التدريب', 'الحاسوب', 'التصميم'],
    availability: {
      days: ['السبت', 'الأحد'],
      hours: 8
    },
    experience: ['تدريب الحاسوب', 'ورش العمل'],
    preferences: ['التعليم', 'التكنولوجيا'],
    totalHours: 45,
    currentInitiatives: ['init-001'],
    rating: 4.8,
    feedback: ['متعاون', 'مخلص', 'مبدع']
  }
];

export const mockCSRTemplates: CSRTemplate[] = [
  {
    id: 'template-001',
    name: 'اتفاقية شراكة مجتمعية',
    description: 'نموذج اتفاقية للشراكات مع المؤسسات المجتمعية',
    category: 'agreement',
    fileUrl: '/templates/partnership-agreement.docx',
    variables: ['partner_name', 'project_name', 'duration', 'budget'],
    isActive: true,
    usageCount: 12,
    createdBy: 'سارة الأحمد',
    createdDate: '2024-01-15',
    lastModified: '2024-06-20',
    tags: ['شراكة', 'اتفاقية', 'مجتمع']
  },
  {
    id: 'template-002',
    name: 'تقرير تقييم الأثر الاجتماعي',
    description: 'نموذج لتقييم الأثر الاجتماعي للمبادرات',
    category: 'evaluation',
    fileUrl: '/templates/impact-assessment.xlsx',
    variables: ['initiative_name', 'period', 'beneficiaries', 'sroi'],
    isActive: true,
    usageCount: 8,
    createdBy: 'عبدالله المالكي',
    createdDate: '2024-02-01',
    lastModified: '2024-05-15',
    tags: ['تقييم', 'أثر', 'تقرير']
  }
];

export const mockCSRDashboardData: CSRDashboardData = {
  overview: {
    totalInitiatives: 12,
    activeInitiatives: 8,
    totalBeneficiaries: 15000,
    totalVolunteerHours: 2400,
    totalBudget: 850000,
    averageSROI: 3.1,
    socialImpactIndex: 8.2
  },
  initiatives: mockCSRInitiatives,
  partners: mockCSRPartners,
  stories: mockCSRStories,
  events: mockCSREvents,
  volunteers: mockCSRVolunteers,
  reports: [],
  templates: mockCSRTemplates
};
