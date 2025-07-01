
import { Customer, Opportunity, CustomerService, CRMAnalytics, CRMTemplate, NPS } from './types';

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'أحمد محمد الأحمد',
    email: 'ahmed@techcorp.sa',
    phone: '+966501234567',
    company: 'تك كورب السعودية',
    industry: 'التكنولوجيا',
    country: 'السعودية',
    city: 'الرياض',
    website: 'https://techcorp.sa',
    status: 'active',
    customerSince: '2023-01-15',
    lastContact: '2024-06-25',
    totalValue: 750000,
    assignedManager: 'سارة أحمد',
    preferences: {
      communicationChannel: 'email',
      contactTiming: '09:00-17:00',
      language: 'ar',
      meetingPreference: 'virtual',
      documentFormat: 'pdf'
    },
    specialNeeds: ['تقارير شهرية مفصلة', 'دعم باللغة العربية'],
    interactionHistory: [
      {
        id: 'i1',
        customerId: 'c1',
        type: 'meeting',
        direction: 'inbound',
        subject: 'مراجعة المشروع الربع سنوية',
        summary: 'مراجعة تقدم المشروع ومناقشة المرحلة القادمة',
        date: '2024-06-25',
        duration: 60,
        outcome: 'موافقة على المرحلة القادمة',
        followUpRequired: true,
        followUpDate: '2024-07-05',
        attachments: ['تقرير_التقدم_Q2.pdf'],
        sentimentScore: 8.5,
        employeeId: 'emp1',
        employeeName: 'سارة أحمد'
      }
    ],
    projects: [
      {
        id: 'p1',
        name: 'تطوير منصة التجارة الإلكترونية',
        status: 'active',
        startDate: '2024-01-15',
        value: 500000,
        description: 'تطوير منصة شاملة للتجارة الإلكترونية',
        phase: 'التطوير',
        satisfaction: 9
      }
    ],
    satisfaction: {
      npsScore: 9,
      lastSurveyDate: '2024-06-20',
      overallRating: 4.8
    },
    tags: ['عميل مميز', 'تكنولوجيا', 'مشروع كبير']
  },
  {
    id: 'c2',
    name: 'فاطمة عبدالله السالم',
    email: 'fatima@greenworld.sa',
    phone: '+966507654321',
    company: 'العالم الأخضر للاستشارات',
    industry: 'الاستشارات البيئية',
    country: 'السعودية',
    city: 'جدة',
    status: 'prospect',
    customerSince: '2024-05-10',
    lastContact: '2024-06-28',
    totalValue: 0,
    assignedManager: 'محمد علي',
    preferences: {
      communicationChannel: 'phone',
      contactTiming: '10:00-16:00',
      language: 'ar',
      meetingPreference: 'inPerson',
      documentFormat: 'word'
    },
    specialNeeds: ['خبرة في القطاع البيئي', 'تقارير الأثر البيئي'],
    interactionHistory: [],
    projects: [],
    satisfaction: {
      npsScore: 0,
      lastSurveyDate: '',
      overallRating: 0
    },
    tags: ['احتمالية عالية', 'بيئة', 'استشارات']
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'o1',
    customerId: 'c2',
    customerName: 'العالم الأخضر للاستشارات',
    title: 'تطوير نظام إدارة المشاريع البيئية',
    description: 'نظام شامل لإدارة وتتبع المشاريع البيئية والاستدامة',
    value: 300000,
    currency: 'SAR',
    probability: 75,
    stage: 'proposal',
    source: 'referral',
    expectedCloseDate: '2024-08-15',
    assignedTo: 'محمد علي',
    createdDate: '2024-05-10',
    lastActivityDate: '2024-06-28',
    nextSteps: 'إرسال العرض التفصيلي ومتابعة المراجعة',
    competitors: ['شركة التقنية المتقدمة', 'مجموعة الحلول الذكية'],
    tags: ['بيئة', 'نظام إدارة', 'فرصة كبيرة'],
    documents: [
      {
        id: 'd1',
        name: 'العرض الأولي',
        type: 'proposal',
        url: '/documents/proposal_o1.pdf',
        uploadDate: '2024-06-20',
        version: '1.0',
        status: 'sent'
      }
    ]
  }
];

export const mockCustomerService: CustomerService[] = [
  {
    id: 'cs1',
    customerId: 'c1',
    customerName: 'تك كورب السعودية',
    type: 'complaint',
    priority: 'high',
    status: 'in-progress',
    subject: 'بطء في أداء النظام',
    description: 'يواجه النظام بطء في الاستجابة خاصة في ساعات الذروة',
    category: 'Technical',
    subcategory: 'Performance',
    assignedTo: 'فريق الدعم التقني',
    createdDate: '2024-06-26',
    dueDate: '2024-06-28',
    escalated: false,
    tags: ['أداء', 'تقني', 'عاجل'],
    attachments: ['screenshot_performance.png'],
    responseTime: 2
  }
];

export const mockCRMAnalytics: CRMAnalytics = {
  totalCustomers: 156,
  activeCustomers: 89,
  newCustomersThisMonth: 12,
  churnRate: 3.2,
  customerLifetimeValue: 450000,
  averageNPS: 8.1,
  totalOpportunities: 47,
  wonOpportunities: 23,
  conversionRate: 48.9,
  averageDealSize: 275000,
  salesFunnel: [
    { stage: 'عملاء محتملون', count: 47, value: 12900000, conversionRate: 100 },
    { stage: 'مؤهل', count: 32, value: 8800000, conversionRate: 68.1 },
    { stage: 'عرض', count: 18, value: 4950000, conversionRate: 56.3 },
    { stage: 'تفاوض', count: 12, value: 3300000, conversionRate: 66.7 },
    { stage: 'مغلق - فوز', count: 8, value: 2200000, conversionRate: 66.7 }
  ],
  customerSatisfaction: {
    excellent: 45,
    good: 32,
    fair: 18,
    poor: 5
  },
  monthlyRevenue: 1250000,
  projectedRevenue: 1850000
};

export const mockNPS: NPS = {
  score: 81,
  responses: 124,
  promoters: 89,
  passives: 23,
  detractors: 12,
  trend: 'up',
  segments: [
    { segment: 'عملاء تكنولوجيا', score: 85, responses: 45 },
    { segment: 'عملاء استشارات', score: 78, responses: 32 },
    { segment: 'عملاء صناعة', score: 79, responses: 28 },
    { segment: 'عملاء خدمات', score: 83, responses: 19 }
  ]
};

export const mockCRMTemplates: CRMTemplate[] = [
  {
    id: 't1',
    name: 'قالب العرض التجاري',
    category: 'proposal',
    description: 'قالب معياري لإعداد العروض التجارية للعملاء',
    content: 'محتوى العرض التجاري...',
    variables: ['اسم العميل', 'اسم المشروع', 'القيمة', 'المدة'],
    lastModified: '2024-06-15',
    usageCount: 23,
    createdBy: 'فريق المبيعات',
    tags: ['عرض', 'مبيعات', 'قالب أساسي'],
    isActive: true
  },
  {
    id: 't2',
    name: 'استطلاع رضا العملاء',
    category: 'survey',
    description: 'استطلاع شامل لقياس مستوى رضا العملاء',
    content: 'أسئلة الاستطلاع...',
    variables: ['اسم العميل', 'اسم المشروع', 'فترة التقييم'],
    lastModified: '2024-06-10',
    usageCount: 15,
    createdBy: 'فريق خدمة العملاء',
    tags: ['رضا', 'تقييم', 'NPS'],
    isActive: true
  }
];
