
import React from 'react';
import { ProjectStatsSection } from './Overview/ProjectStatsSection';
import { ProjectPhaseProgress } from './Overview/ProjectPhaseProgress';
import { AlertsPanel } from './Overview/AlertsPanel';
import { ProjectSummaryPanel } from './Overview/ProjectSummaryPanel';
import { FinancialOverviewChart } from './Overview/FinancialOverviewChart';
import { DataVisualizationPanel } from './Overview/DataVisualizationPanel';

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

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  // بيانات تجريبية محدثة لتطابق التصميم المطلوب
  const mockData: OverviewData = {
    stats: {
      expectedRevenue: 150, // 150 ألف ريال سعودي
      complaints: 5, // 05 شكاوى
      delayedProjects: 3 // 03 مشاريع متأخرة
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

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* الصف الأول - المؤشرات الإحصائية */}
      <ProjectStatsSection stats={mockData.stats} />
      
      {/* الصف الثاني - الشريط الزمني للأحداث القادمة */}
      <ProjectPhaseProgress phases={mockData.phases} />
      
      {/* الصف الثالث - التنبيهات وملخص المشاريع */}
      <div className="grid grid-cols-2 gap-6">
        <AlertsPanel alerts={mockData.alerts} />
        <ProjectSummaryPanel projects={mockData.projects} />
      </div>
      
      {/* الصف الرابع - البيانات المالية والتحليلية */}
      <div className="grid grid-cols-3 gap-6">
        <FinancialOverviewChart 
          title="النظرة المالية" 
          data={mockData.financial}
        />
        <DataVisualizationPanel 
          title="بيانات" 
          value={46} 
          description="هذا النص هنا للشكل المرئي"
          chart="bar"
        />
        <DataVisualizationPanel 
          title="بيانات" 
          value={17} 
          description="هذا النص هنا للشكل المرئي"
          chart="bar"
        />
      </div>
      
      {/* الصف الخامس - بيانات إضافية */}
      <div className="grid grid-cols-2 gap-6">
        <DataVisualizationPanel 
          title="بيانات" 
          value={3} 
          description="هذا النص هنا للشكل المرئي"
          chart="line"
        />
        <DataVisualizationPanel 
          title="بيانات" 
          value={75} 
          description="نسبة"
          chart="circle"
        />
      </div>
    </div>
  );
};
