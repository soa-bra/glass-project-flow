
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
    criticalProjects: [],
    delayedMilestones: [],
    summary: { totalProjects: 10, onTrack: 7, atRisk: 2, delayed: 1, completionRate: 75 },
    aiAdvice: []
  },
  marketing: {
    roasData: [],
    campaigns: [],
    attribution: [],
    kpis: [],
    totalROAS: 3.2,
    totalSpent: 150000,
    totalRevenue: 480000
  },
  hr: {
    resourceUtilization: [],
    skillGaps: [],
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
    workloadBalance: []
  },
  clients: {
    opportunityFunnel: [],
    npsScores: [],
    portfolioHealth: { totalClients: 0, activeContracts: 0, renewalRate: 0, churnRate: 0, avgContractValue: 0, clientSatisfaction: 0 },
    sentimentData: []
  },
  reports: {
    templates: [],
    statistics: { totalReports: 0, monthlyDownloads: 0, customReports: 0, scheduledReports: 0, popularCategories: [] },
    aiSuggestions: []
  }
});
