import {
  KnowledgeDocument,
  KnowledgeMetrics,
  SoabraMetric,
  ResearchProject,
  AIRecommendation,
  DocumentClassification,
  KnowledgeGap,
  ContentAnalytics,
} from "../types";

export const mockKnowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "DOC-001",
    title: "دليل علم اجتماع العلامة التجارية",
    type: "guide",
    category: "علم اجتماع العلامة التجارية",
    author: "د. أحمد المحمد",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
    status: "published",
    tags: ["علم اجتماع", "العلامة التجارية", "دليل"],
    content: "محتوى شامل عن علم اجتماع العلامة التجارية...",
    readCount: 1247,
    citations: 23,
    downloads: 456,
    version: "2.1",
    permissions: {
      read: ["all"],
      write: ["researcher", "admin"],
      admin: ["admin"],
    },
    metadata: {
      size: 2048000,
      format: "PDF",
      language: "ar",
      keywords: ["علم اجتماع", "العلامة التجارية", "الهوية الثقافية"],
    },
  },
  {
    id: "DOC-002",
    title: "مقاييس سوبرا للهوية الثقافية",
    type: "metric",
    category: "مقاييس وأدوات",
    author: "فريق البحث",
    createdAt: "2024-02-10",
    updatedAt: "2024-04-15",
    status: "published",
    tags: ["مقاييس", "هوية ثقافية", "إكسل"],
    content: "مجموعة شاملة من مقاييس سوبرا...",
    readCount: 892,
    citations: 15,
    downloads: 234,
    version: "1.5",
    permissions: {
      read: ["all"],
      write: ["researcher", "admin"],
      admin: ["admin"],
    },
    metadata: {
      size: 1024000,
      format: "XLSX",
      language: "ar",
      keywords: ["مقاييس", "هوية", "ثقافة"],
    },
  },
];

export const mockKnowledgeMetrics: KnowledgeMetrics = {
  totalDocuments: 156,
  totalReads: 12847,
  totalCitations: 234,
  totalDownloads: 3456,
  activeUsers: 89,
  monthlyGrowth: 15.3,
  topCategories: [
    { name: "علم اجتماع العلامة التجارية", count: 45, percentage: 28.8 },
    { name: "مقاييس وأدوات", count: 32, percentage: 20.5 },
    { name: "بحوث تطبيقية", count: 28, percentage: 17.9 },
    { name: "أدلة ومراجع", count: 25, percentage: 16.0 },
    { name: "تقارير تحليلية", count: 26, percentage: 16.7 },
  ],
};

export const mockSoaBraMetrics: SoaBraMetric[] = [
  {
    id: "METRIC-001",
    name: "مؤشر مستوى تطابق الهوية والقيم",
    nameEn: "Cultural Fit Index",
    category: "cultural_identity",
    description: "يقيس مدى تطابق هوية العلامة التجارية مع القيم الثقافية للمجتمع المستهدف",
    scale: {
      min: 0,
      max: 100,
      levels: [
        { range: "0-20", label: "ضعيف جداً", description: "يحتاج إلى تطوير جذري وشامل" },
        { range: "21-40", label: "ضعيف", description: "يحتاج إلى تحسينات كبيرة في معظم الجوانب" },
        { range: "41-60", label: "متوسط", description: "مستوى مقبول مع الحاجة إلى تحسينات محددة" },
        { range: "61-80", label: "جيد", description: "مستوى جيد مع إمكانية التحسين في بعض الجوانب" },
        { range: "81-100", label: "ممتاز", description: "مستوى متميز يمكن اعتباره مرجعاً في المجال" },
      ],
    },
    criteria: [
      {
        id: "CRIT-001",
        name: "القيم الأساسية",
        statements: [
          { id: "STMT-001", text: "تتماشى قيم العلامة مع القيم الثقافية المحلية", score: 0 },
          { id: "STMT-002", text: "تعكس العلامة الهوية الثقافية للمجتمع", score: 0 },
        ],
      },
    ],
    excelFile: "cultural_fit_index.xlsx",
    lastUpdated: "2024-03-15",
    usage: 45,
  },
  {
    id: "METRIC-002",
    name: "مؤشر الأثر الاجتماعي",
    nameEn: "Social Impact Index",
    category: "social_responsibility",
    description: "يقيس مدى تأثير العلامة التجارية على المجتمع والبيئة الاجتماعية",
    scale: {
      min: 0,
      max: 100,
      levels: [
        { range: "0-20", label: "ضعيف جداً", description: "لا يوجد أثر اجتماعي ملحوظ" },
        { range: "21-40", label: "ضعيف", description: "أثر اجتماعي محدود" },
        { range: "41-60", label: "متوسط", description: "أثر اجتماعي مقبول" },
        { range: "61-80", label: "جيد", description: "أثر اجتماعي إيجابي واضح" },
        { range: "81-100", label: "ممتاز", description: "أثر اجتماعي متميز ومؤثر" },
      ],
    },
    criteria: [
      {
        id: "CRIT-002",
        name: "المساهمة المجتمعية",
        statements: [
          { id: "STMT-003", text: "تساهم العلامة في حل القضايا الاجتماعية", score: 0 },
          { id: "STMT-004", text: "تدعم العلامة المبادرات الخيرية والتطوعية", score: 0 },
        ],
      },
    ],
    excelFile: "social_impact_index.xlsx",
    lastUpdated: "2024-03-20",
    usage: 32,
  },
];

export const mockResearchProjects: ResearchProject[] = [
  {
    id: "PROJ-001",
    title: "دراسة تأثير العلامات التجارية على الهوية الثقافية",
    description: "بحث شامل حول كيفية تأثير العلامات التجارية على تشكيل الهوية الثقافية للمجتمعات",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    researchers: ["د. أحمد المحمد", "د. فاطمة العلي"],
    publications: ["PUB-001", "PUB-002"],
    budget: 150000,
    progress: 65,
    milestones: [
      { id: "MILE-001", title: "مراجعة الأدبيات", dueDate: "2024-03-31", completed: true },
      { id: "MILE-002", title: "جمع البيانات", dueDate: "2024-06-30", completed: true },
      { id: "MILE-003", title: "تحليل النتائج", dueDate: "2024-09-30", completed: false },
    ],
  },
];

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: "REC-001",
    type: "gap_analysis",
    title: "فجوة معرفية في مجال التسويق الرقمي الثقافي",
    description: "تم اكتشاف نقص في المحتوى المتعلق بالتسويق الرقمي الثقافي للعلامات التجارية",
    priority: "high",
    confidence: 0.85,
    relatedDocuments: ["DOC-001"],
    createdAt: "2024-04-01",
    status: "pending",
  },
  {
    id: "REC-002",
    type: "content_suggestion",
    title: "اقتراح إنشاء دليل لقياس الأثر الثقافي",
    description: "بناءً على استعلامات البحث المتكررة، يُنصح بإنشاء دليل شامل لقياس الأثر الثقافي",
    priority: "medium",
    confidence: 0.72,
    relatedDocuments: ["DOC-002"],
    createdAt: "2024-04-02",
    status: "reviewed",
  },
];

export const mockKnowledgeGaps: KnowledgeGap[] = [
  {
    id: "GAP-001",
    topic: "التسويق الرقمي الثقافي",
    description: "نقص في المحتوى المتعلق بالتسويق الرقمي للعلامات التجارية في السياق الثقافي",
    searchQueries: ["التسويق الرقمي الثقافي", "العلامات التجارية الرقمية"],
    priority: "high",
    suggestedResources: ["دليل التسويق الرقمي", "كتيب الهوية الثقافية الرقمية"],
    identifiedAt: "2024-04-01",
    status: "identified",
  },
];

export const mockContentAnalytics: ContentAnalytics[] = [
  {
    documentId: "DOC-001",
    views: 1247,
    downloads: 456,
    shares: 89,
    citations: 23,
    engagement: {
      comments: 15,
      ratings: 42,
      averageRating: 4.3,
    },
    geography: [
      { country: "السعودية", views: 750 },
      { country: "الإمارات", views: 250 },
      { country: "الكويت", views: 150 },
      { country: "قطر", views: 97 },
    ],
    timeRange: [
      { date: "2024-01", views: 45 },
      { date: "2024-02", views: 89 },
      { date: "2024-03", views: 156 },
      { date: "2024-04", views: 234 },
    ],
  },
];
