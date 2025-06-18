
import React from 'react';
import { ProjectStatsSection } from './Overview/ProjectStatsSection';
import { AlertsPanel } from './Overview/AlertsPanel';
import { ProjectSummaryPanel } from './Overview/ProjectSummaryPanel';
import { FinancialOverviewChart } from './Overview/FinancialOverviewChart';
import { DataVisualizationPanel } from './Overview/DataVisualizationPanel';
import { TimelineWidget } from './Overview/TimelineWidget';

interface OverviewData {
  stats: {
    expectedRevenue: number;
    complaints: number;
    delayedProjects: number;
  };
  phases: Array<{
    name: string;
    isCompleted: boolean;
    isCurrent: boolean;
  }>;
  alerts: Array<{
    id: number;
    title: string;
    status: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  projects: Array<{
    id: number;
    title: string;
    type: string;
    progress: number;
    status: 'active' | 'completed' | 'delayed';
    date: string;
  }>;
  financial: {
    total: number;
    segments: Array<{
      label: string;
      value: number;
      color: string;
    }>;
  };
}

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  // بيانات محدثة لتطابق التصميم المطلوب
  const mockData: OverviewData = {
    stats: {
      expectedRevenue: 150,
      complaints: 5,
      delayedProjects: 3
    },
    phases: [
      { name: 'المرحلة التحضيرية', isCompleted: true, isCurrent: false },
      { name: 'المراجعة الأولية', isCompleted: true, isCurrent: false },
      { name: 'التحليل النهائي', isCompleted: false, isCurrent: true },
      { name: 'المتابعة', isCompleted: false, isCurrent: false }
    ],
    alerts: [
      { id: 1, title: 'تحديث قاعدة البيانات', status: 'جاري العمل', priority: 'high' },
      { id: 2, title: 'مراجعة التصميم', status: 'مكتمل', priority: 'medium' },
      { id: 3, title: 'اختبار الأداء', status: 'قيد الانتظار', priority: 'low' }
    ],
    projects: [
      { id: 1, title: 'تصميم الواجهة', type: 'تطوير موقع سوبرا', progress: 75, status: 'active', date: 'Jun 08' },
      { id: 2, title: 'كتابة الكود', type: 'تطوير موقع سوبرا', progress: 45, status: 'delayed', date: 'Jun 08' },
      { id: 3, title: 'تطوير قواعد البيانات', type: 'تطوير موقع سوبرا', progress: 90, status: 'completed', date: 'Jun 08' },
      { id: 4, title: 'التسليم', type: 'تسليم الموقع النهائي', progress: 20, status: 'active', date: 'Jun 08' }
    ],
    financial: {
      total: 92,
      segments: [
        { label: 'هذا النص هنا للشكل المرئي', value: 14, color: '#10b981' },
        { label: 'هذا النص هنا للشكل المرئي', value: 78, color: '#3b82f6' },
        { label: 'هذا النص هنا للشكل المرئي', value: 2, color: '#ef4444' },
        { label: 'هذا النص هنا للشكل المرئي', value: 3, color: '#f59e0b' }
      ]
    }
  };

  // بيانات الأحداث القادمة
  const timelineData = [
    {
      id: 1,
      date: '2024-06-07',
      title: 'حفل التخرج',
      department: 'داخلي',
      color: '#000000'
    },
    {
      id: 2,
      date: '2024-06-02',
      title: 'التقنيات الداخلية',
      department: 'داخلي',
      color: '#000000'
    },
    {
      id: 3,
      date: '2024-05-25',
      title: 'اجتماع للقيادة الشركة الغربية',
      department: 'جامعة الملك سعود',
      color: '#000000'
    },
    {
      id: 4,
      date: '2024-05-20',
      title: 'تسليم المنتج الأولي',
      department: 'الخليج للتدريب',
      color: '#000000'
    },
    {
      id: 5,
      date: '2024-05-16',
      title: 'محاضرة العلامة في منتدى الاجتماع',
      department: 'مسك الخيرية',
      color: '#000000'
    },
    {
      id: 6,
      date: '2024-05-12',
      title: 'الإفطار الشهي لسوق المراجعة المالية',
      department: 'داخلي',
      color: '#000000'
    }
  ];

  const isProfit = mockData.financial.total > 50;

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* الصف الأول - إحصائيات المشاريع + بطاقة البيانات */}
      <div className="grid grid-cols-4 gap-6">
        <ProjectStatsSection stats={mockData.stats} />
        <DataVisualizationPanel title="بيانات" value={46} description="هذا النص هنا للشكل المرئي" chart="bar" />
      </div>

      {/* الصف الثاني - بطاقة الأحداث القادمة */}
      <TimelineWidget timeline={timelineData} />

      {/* الصف الثالث - 4 أعمدة */}
      <div className="grid grid-cols-4 gap-6">
        <AlertsPanel alerts={mockData.alerts} />
        <ProjectSummaryPanel projects={mockData.projects} />
        <FinancialOverviewChart 
          title="النظرة المالية" 
          data={mockData.financial} 
          isProfit={isProfit}
        />
        <DataVisualizationPanel title="بيانات" value={75} description="نسبة" chart="circle" />
      </div>
    </div>
  );
};
