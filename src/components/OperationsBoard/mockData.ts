
export const getMockData = () => ({
  overview: {
    stats: {
      expectedRevenue: 150,
      complaints: 5,
      delayedProjects: 3
    }
  },
  finance: {
    monthlyBudget: [
      { month: 'يناير', budget: 500000, actual: 480000, variance: -20000 },
      { month: 'فبراير', budget: 520000, actual: 540000, variance: 20000 },
      { month: 'مارس', budget: 480000, actual: 460000, variance: -20000 },
      { month: 'أبريل', budget: 550000, actual: 570000, variance: 20000 },
      { month: 'مايو', budget: 510000, actual: 495000, variance: -15000 },
      { month: 'يونيو', budget: 530000, actual: 545000, variance: 15000 }
    ],
    cashFlow: [
      { date: 'يناير', inflow: 600000, outflow: 480000, netFlow: 120000, cumulativeBalance: 1200000 },
      { date: 'فبراير', inflow: 650000, outflow: 540000, netFlow: 110000, cumulativeBalance: 1310000 },
      { date: 'مارس', inflow: 580000, outflow: 460000, netFlow: 120000, cumulativeBalance: 1430000 },
      { date: 'أبريل', inflow: 700000, outflow: 570000, netFlow: 130000, cumulativeBalance: 1560000 },
      { date: 'مايو', inflow: 620000, outflow: 495000, netFlow: 125000, cumulativeBalance: 1685000 },
      { date: 'يونيو', inflow: 680000, outflow: 545000, netFlow: 135000, cumulativeBalance: 1820000 }
    ],
    kpis: [
      { id: 'revenue', title: 'الإيرادات الشهرية', value: 680000, target: 650000, trend: 'up', format: 'currency' },
      { id: 'profit-margin', title: 'هامش الربح', value: 22, target: 20, trend: 'up', format: 'percentage' },
      { id: 'operating-ratio', title: 'نسبة التشغيل', value: 78, target: 80, trend: 'down', format: 'percentage' },
      { id: 'cash-flow', title: 'التدفق النقدي', value: 135000, target: 120000, trend: 'up', format: 'currency' }
    ],
    totalBudget: 3090000,
    totalSpent: 3090000,
    forecastAccuracy: 92
  },
  projects: {
    criticalProjects: [
      { id: 'P001', name: 'تطوير الموقع الإلكتروني', startDate: '2024-01-15', endDate: '2024-05-25', progress: 65, status: 'on-track', priority: 'high' },
      { id: 'P002', name: 'حملة التعريف', startDate: '2024-02-01', endDate: '2024-08-11', progress: 85, status: 'on-track', priority: 'high' },
      { id: 'P003', name: 'صفحات التواصل', startDate: '2024-01-20', endDate: '2024-03-07', progress: 42, status: 'at-risk', priority: 'medium' },
      { id: 'P004', name: 'المؤتمرات الثقافية', startDate: '2024-03-01', endDate: '2024-07-15', progress: 78, status: 'on-track', priority: 'high' },
      { id: 'P005', name: 'العلامة الثقافية للعميل', startDate: '2024-02-15', endDate: '2024-06-27', progress: 30, status: 'delayed', priority: 'high' },
      { id: 'P006', name: 'تطبيق الهاتف المحمول', startDate: '2024-04-01', endDate: '2024-12-10', progress: 15, status: 'on-track', priority: 'medium' },
      { id: 'P007', name: 'نظام إدارة المحتوى', startDate: '2024-01-10', endDate: '2024-09-03', progress: 92, status: 'delayed', priority: 'high' },
      { id: 'P008', name: 'استراتيجية التسويق الرقمي', startDate: '2024-03-15', endDate: '2024-11-18', progress: 56, status: 'on-track', priority: 'medium' }
    ],
    delayedMilestones: [
      { id: 'M001', projectName: 'نظام إدارة المحتوى', milestone: 'تطوير واجهة المستخدم', originalDate: '2024-06-15', currentDate: '2024-07-02', delayDays: 17, impact: 'high' },
      { id: 'M002', projectName: 'العلامة الثقافية للعميل', milestone: 'البحث الثقافي الأولي', originalDate: '2024-05-20', currentDate: '2024-06-10', delayDays: 21, impact: 'medium' },
      { id: 'M003', projectName: 'صفحات التواصل', milestone: 'تصميم المحتوى', originalDate: '2024-06-01', currentDate: '2024-06-25', delayDays: 24, impact: 'low' }
    ],
    summary: { totalProjects: 10, onTrack: 7, atRisk: 2, delayed: 1, completionRate: 75 },
    aiAdvice: [
      { id: 'AI001', type: 'warning', title: 'تأخير محتمل في المشروع', description: 'مشروع نظام إدارة المحتوى يواجه تأخيرات في التطوير. يُنصح بإعادة توزيع الموارد.', confidence: 85, projectId: 'P007' },
      { id: 'AI002', type: 'suggestion', title: 'تحسين التواصل', description: 'يمكن تحسين التواصل مع العميل في مشروع العلامة الثقافية لتسريع عملية الموافقة.', confidence: 72, projectId: 'P005' },
      { id: 'AI003', type: 'optimization', title: 'توزيع أفضل للموارد', description: 'يمكن نقل مطور من مشروع التطبيق المحمول لمساعدة فريق الموقع الإلكتروني.', confidence: 68 }
    ]
  },
  marketing: {
    roasData: [
      { channel: 'وسائل التواصل الاجتماعي', investment: 45000, revenue: 180000, roas: 4.0, trend: 'up' },
      { channel: 'إعلانات جوجل', investment: 60000, revenue: 200000, roas: 3.3, trend: 'up' },
      { channel: 'إعلانات لينكد إن', investment: 25000, revenue: 75000, roas: 3.0, trend: 'stable' },
      { channel: 'التسويق بالمحتوى', investment: 20000, revenue: 50000, roas: 2.5, trend: 'down' }
    ],
    campaigns: [
      { id: '1', name: 'حملة الهوية الثقافية', channel: 'متعدد القنوات', budget: 80000, spent: 65000, impressions: 1200000, clicks: 24000, conversions: 480, status: 'active', startDate: '2024-01-15', endDate: '2024-03-15' },
      { id: '2', name: 'استشارات العلامة التجارية', channel: 'لينكد إن', budget: 40000, spent: 38000, impressions: 500000, clicks: 15000, conversions: 300, status: 'active', startDate: '2024-02-01', endDate: '2024-04-01' },
      { id: '3', name: 'خدمات البحث الثقافي', channel: 'جوجل', budget: 30000, spent: 30000, impressions: 800000, clicks: 20000, conversions: 200, status: 'completed', startDate: '2024-01-01', endDate: '2024-02-29' }
    ],
    attribution: [
      { touchpoint: 'وسائل التواصل الاجتماعي', conversions: 320, revenue: 128000, percentage: 35 },
      { touchpoint: 'البحث المباشر', conversions: 250, revenue: 100000, percentage: 27 },
      { touchpoint: 'إعلانات لينكد إن', conversions: 180, revenue: 72000, percentage: 20 },
      { touchpoint: 'الإحالات', conversions: 120, revenue: 48000, percentage: 13 },
      { touchpoint: 'أخرى', conversions: 45, revenue: 18000, percentage: 5 }
    ],
    kpis: [
      { id: 'cpa', title: 'تكلفة اكتساب العميل', value: 280, target: 300, format: 'currency', trend: 'down' },
      { id: 'ltv', title: 'القيمة الدائمة للعميل', value: 2400, target: 2200, format: 'currency', trend: 'up' },
      { id: 'conversion-rate', title: 'معدل التحويل', value: 3.2, target: 3.0, format: 'percentage', trend: 'up' },
      { id: 'engagement', title: 'معدل التفاعل', value: 4.8, target: 4.5, format: 'percentage', trend: 'up' }
    ],
    totalROAS: 3.2,
    totalSpent: 150000,
    totalRevenue: 480000
  },
  hr: {
    resourceUtilization: [
      { employeeId: 'EMP001', name: 'أحمد محمد', department: 'البحث الثقافي', utilization: 95, capacity: 100, projects: ['مشروع أ', 'مشروع ب'], skills: ['تحليل البيانات', 'البحث الثقافي'], performance: 4.8 },
      { employeeId: 'EMP002', name: 'فاطمة علي', department: 'العلامة التجارية', utilization: 88, capacity: 100, projects: ['مشروع ج'], skills: ['التصميم', 'الهوية البصرية'], performance: 4.6 },
      { employeeId: 'EMP003', name: 'محمد عبدالله', department: 'التسويق', utilization: 82, capacity: 100, projects: ['مشروع د', 'مشروع هـ'], skills: ['التسويق الرقمي', 'إدارة المحتوى'], performance: 4.4 },
      { employeeId: 'EMP004', name: 'نور حسن', department: 'الاستشارات', utilization: 75, capacity: 100, projects: ['مشروع و'], skills: ['الاستشارات', 'التحليل الاستراتيجي'], performance: 4.7 }
    ],
    skillGaps: [
      { skill: 'الذكاء الاصطناعي', current: 6, required: 10, gap: 4, priority: 'high' },
      { skill: 'تحليل البيانات المتقدم', current: 8, required: 10, gap: 2, priority: 'medium' },
      { skill: 'التسويق الرقمي', current: 7, required: 9, gap: 2, priority: 'medium' },
      { skill: 'إدارة المشاريع', current: 9, required: 10, gap: 1, priority: 'low' }
    ],
    stats: { 
      totalEmployees: 45, 
      activeProjects: 12, 
      avgUtilization: 85, 
      skillGaps: 3, 
      performanceScore: 4.2, 
      retentionRate: 92,
      active: 42,
      onLeave: 3,
      vacancies: 5
    },
    workloadBalance: [
      { department: 'البحث الثقافي', current: 95, capacity: 100, efficiency: 92 },
      { department: 'العلامة التجارية', current: 88, capacity: 100, efficiency: 89 },
      { department: 'التسويق', current: 82, capacity: 100, efficiency: 85 },
      { department: 'الاستشارات', current: 75, capacity: 100, efficiency: 88 },
      { department: 'التطوير', current: 90, capacity: 100, efficiency: 91 }
    ]
  },
  clients: {
    opportunityFunnel: [
      { stage: 'عملاء محتملون', count: 150, value: 3750000, conversionRate: 100 },
      { stage: 'مهتمون', count: 85, value: 2125000, conversionRate: 57 },
      { stage: 'عروض مقدمة', count: 45, value: 1350000, conversionRate: 53 },
      { stage: 'تفاوض', count: 25, value: 750000, conversionRate: 56 },
      { stage: 'إغلاق الصفقة', count: 15, value: 450000, conversionRate: 60 }
    ],
    npsScores: [
      { id: 1, score: 85, client: 'شركة النخبة للاستشارات', category: 'promoter', feedback: 'خدمة ممتازة ونتائج متميزة', date: '2024-01-15' },
      { id: 2, score: 92, client: 'مؤسسة التطوير الثقافي', category: 'promoter', feedback: 'فريق محترف وتسليم في الوقت المحدد', date: '2024-01-20' },
      { id: 3, score: 78, client: 'مجموعة الإبداع', category: 'promoter', feedback: 'نتائج جيدة مع بعض التحسينات المطلوبة', date: '2024-01-25' },
      { id: 4, score: 65, client: 'شركة الرؤية', category: 'passive', feedback: 'خدمة مقبولة', date: '2024-02-01' },
      { id: 5, score: 95, client: 'مؤسسة الابتكار', category: 'promoter', feedback: 'تجربة استثنائية ونوعية عالية', date: '2024-02-05' }
    ],
    portfolioHealth: { 
      totalClients: 28, 
      activeContracts: 42, 
      renewalRate: 85, 
      churnRate: 8, 
      avgContractValue: 125000, 
      clientSatisfaction: 4.6 
    },
    sentimentData: [
      { clientId: 'CLI001', clientName: 'شركة النخبة', sentiment: 'positive', score: 85, lastInteraction: '2024-01-15', riskLevel: 'low' },
      { clientId: 'CLI002', clientName: 'مؤسسة التطوير', sentiment: 'positive', score: 92, lastInteraction: '2024-01-20', riskLevel: 'low' },
      { clientId: 'CLI003', clientName: 'مجموعة الإبداع', sentiment: 'neutral', score: 65, lastInteraction: '2024-01-25', riskLevel: 'medium' },
      { clientId: 'CLI004', clientName: 'شركة الرؤية', sentiment: 'negative', score: 45, lastInteraction: '2024-02-01', riskLevel: 'high' }
    ]
  },
  reports: {
    templates: [
      { id: 'RPT001', name: 'تقرير الأداء الشهري', category: 'تقارير الأداء', description: 'تقرير شامل عن أداء المؤسسة الشهري', format: 'PDF', lastUpdated: '2024-01-30', downloadCount: 45, tags: ['شهري', 'أداء', 'شامل'] },
      { id: 'RPT002', name: 'تحليل العلامة التجارية', category: 'تقارير العلامة التجارية', description: 'تحليل متعمق لوضع العلامة التجارية', format: 'PowerBI', lastUpdated: '2024-01-25', downloadCount: 28, tags: ['علامة تجارية', 'تحليل'] },
      { id: 'RPT003', name: 'دراسة المنافسين', category: 'دراسات السوق', description: 'تحليل شامل للمنافسين في السوق', format: 'Excel', lastUpdated: '2024-01-20', downloadCount: 32, tags: ['منافسين', 'سوق'] }
    ],
    statistics: { 
      totalReports: 156, 
      monthlyDownloads: 1240, 
      customReports: 23, 
      scheduledReports: 12, 
      popularCategories: [
        { category: 'تقارير الأداء', count: 45 },
        { category: 'تقارير العلامة التجارية', count: 38 },
        { category: 'دراسات السوق', count: 32 }
      ] 
    },
    aiSuggestions: [
      { id: 'AI001', title: 'تقرير تحليل الاتجاهات الثقافية', description: 'تحليل ذكي للاتجاهات الثقافية الناشئة', confidence: 92, dataPoints: ['بيانات وسائل التواصل', 'استطلاعات الرأي', 'تحليل المحتوى'], estimatedTime: '4 ساعات' },
      { id: 'AI002', title: 'تقرير أداء الحملات التسويقية', description: 'تقييم شامل لفعالية الحملات الحالية', confidence: 88, dataPoints: ['بيانات الحملات', 'معدلات التحويل', 'عائد الاستثمار'], estimatedTime: '2 ساعة' }
    ]
  }
});
