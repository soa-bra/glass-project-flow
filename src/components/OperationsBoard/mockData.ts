
export const getMockData = () => ({
  overview: {
    timeline: [
      { id: 1, date: '2025-06-15', title: 'اجتماع مجلس الإدارة', department: 'إدارية', color: '#374151' },
      { id: 2, date: '2025-06-20', title: 'تسليم المرحلة الأولى', department: 'هندسية', color: '#374151' },
      { id: 3, date: '2025-06-25', title: 'توقيع عقد جديد', department: 'قانونية', color: '#374151' },
      { id: 4, date: '2025-07-01', title: 'مراجعة الأداء الشهري', department: 'مالية', color: '#374151' },
      { id: 5, date: '2025-07-10', title: 'تدريب الفريق الجديد', department: 'موارد بشرية', color: '#374151' },
    ],
    widgets: {
      budget: { total: 1000000, spent: 450000 },
      contracts: { signed: 24, expired: 3 },
      hr: { members: 42, vacancies: 5, onLeave: 3 },
      satisfaction: 87
    }
  },
  finance: {
    projects: [
      { id: 1, name: 'مشروع التطوير الشامل', budget: 350000, spent: 310000 },
      { id: 2, name: 'تحديث البنية التحتية', budget: 200000, spent: 170000 },
      { id: 3, name: 'برنامج التدريب', budget: 120000, spent: 65000 },
      { id: 4, name: 'تطوير المنصة الرقمية', budget: 280000, spent: 180000 },
    ],
    overBudget: [
      { id: 1, name: 'مشروع التطوير الشامل', percentage: 89 },
      { id: 2, name: 'تحديث البنية التحتية', percentage: 85 },
    ]
  },
  projects: {
    projects: [
      { id: 1, name: 'الشامل الإلكتروني', status: 'نشط', manager: 'سلمان العتيبي' },
      { id: 2, name: 'تطوير الموارد', status: 'قيد التنفيذ', manager: 'سارة بخيت' },
      { id: 3, name: 'تجديد العلامة التجارية', status: 'متأخر', manager: 'ماجد عسيري' },
      { id: 4, name: 'تطوير خدمات العملاء', status: 'نشط', manager: 'ديمة القحطاني' },
    ]
  },
  marketing: {
    campaigns: [
      { id: 1, name: 'الحملة الرقمية 2025', channel: 'السوشيال ميديا', launchDate: '2025-07-01' },
      { id: 2, name: 'مؤتمر العلامة', channel: 'الأحداث والمعارض', launchDate: '2025-08-12' },
      { id: 3, name: 'منشورات الصحف', channel: 'الإعلام المكتوب', launchDate: '2025-07-22' },
    ]
  },
  legal: {
    contracts: { signed: 24, pending: 7, expired: 3 },
    upcoming: [
      { id: 1, title: 'عقد الخدمات التقنية', date: '2025-07-10', client: 'شركة التقنية المتقدمة' },
      { id: 2, title: 'اتفاقية التوريد', date: '2025-07-15', client: 'مؤسسة البناء الحديث' },
      { id: 3, title: 'عقد الصيانة الدورية', date: '2025-07-25', client: 'شركة الخليج للمقاولات' },
    ]
  },
  hr: {
    stats: { active: 42, onLeave: 3, vacancies: 5 },
    distribution: [
      { project: 'المشروع الأول', members: 12 },
      { project: 'المشروع الثاني', members: 8 },
      { project: 'المشروع الثالث', members: 9 },
      { project: 'المشروع الرابع', members: 7 },
      { project: 'المشروع الخامس', members: 6 },
    ]
  },
  clients: {
    active: [
      { id: 1, name: 'وزارة التخطيط', projects: 3 },
      { id: 2, name: 'مؤسسة التنمية الحضرية', projects: 2 },
      { id: 3, name: 'شركة البناء المتطورة', projects: 4 },
      { id: 4, name: 'هيئة تطوير المدن', projects: 1 },
    ],
    nps: [
      { id: 1, score: 92, client: 'وزارة التخطيط' },
      { id: 2, score: 87, client: 'مؤسسة التنمية الحضرية' },
      { id: 3, score: 79, client: 'شركة البناء المتطورة' },
    ]
  },
  reports: {
    templates: [
      { id: 1, name: 'تقرير أداء المشاريع الشهري' },
      { id: 2, name: 'تقرير الأداء المالي' },
      { id: 3, name: 'تقرير الموارد البشرية' },
      { id: 4, name: 'تقرير رضا العملاء' },
      { id: 5, name: 'تقرير المخاطر' },
    ]
  }
});
