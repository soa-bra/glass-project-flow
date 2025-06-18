
import React from 'react';
import { TimelineWidget } from './Overview/TimelineWidget';
import { ProjectStatsSection } from './Overview/ProjectStatsSection';
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
  timeline: Array<{
    id: number;
    date: string;
    title: string;
    department: string;
    color: string;
  }>;
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

  const mockData: OverviewData = {
    stats: {
      expectedRevenue: 150,
      complaints: 5,
      delayedProjects: 3
    },
    phases: [{
      name: 'المرحلة التحضيرية',
      isCompleted: true,
      isCurrent: false
    }, {
      name: 'المراجعة الأولية',
      isCompleted: true,
      isCurrent: false
    }, {
      name: 'التحليل النهائي',
      isCompleted: false,
      isCurrent: true
    }, {
      name: 'المتابعة',
      isCompleted: false,
      isCurrent: false
    }],
    alerts: [{
      id: 1,
      title: 'تحديث قاعدة البيانات',
      status: 'جاري العمل',
      priority: 'high'
    }, {
      id: 2,
      title: 'مراجعة التصميم',
      status: 'مكتمل',
      priority: 'medium'
    }, {
      id: 3,
      title: 'اختبار الأداء',
      status: 'قيد الانتظار',
      priority: 'low'
    }],
    projects: [{
      id: 1,
      title: 'تصميم الواجهة',
      type: 'تطوير موقع سوبرا',
      progress: 75,
      status: 'active',
      date: 'Jun 08'
    }, {
      id: 2,
      title: 'كتابة الكود',
      type: 'تطوير موقع سوبرا',
      progress: 45,
      status: 'delayed',
      date: 'Jun 08'
    }, {
      id: 3,
      title: 'تطوير قواعد البيانات',
      type: 'تطوير موقع سوبرا',
      progress: 90,
      status: 'completed',
      date: 'Jun 08'
    }, {
      id: 4,
      title: 'التسليم',
      type: 'تسليم الموقع النهائي',
      progress: 20,
      status: 'active',
      date: 'Jun 08'
    }],
    financial: {
      total: 92,
      segments: [{
        label: 'هذا النص هنا للشكل المرئي',
        value: 14,
        color: '#bdeed3'
      }, {
        label: 'هذا النص هنا للشكل المرئي',
        value: 78,
        color: '#a4e2f6'
      }, {
        label: 'هذا النص هنا للشكل المرئي',
        value: 2,
        color: '#f1b5b9'
      }, {
        label: 'هذا النص هنا للشكل المرئي',
        value: 3,
        color: '#fbe2aa'
      }]
    },
    timeline: [{
      id: 1,
      date: '2024-05-12',
      title: 'الإجتماع النصف سنوي المراجعة الدورية',
      department: 'داخلي',
      color: '#000000'
    }, {
      id: 2,
      date: '2024-05-16',
      title: 'متابعة المشاركة مع سندي النجمة',
      department: 'مسك الخيرية',
      color: '#000000'
    }, {
      id: 3,
      date: '2024-05-20',
      title: 'تسليم المناهج الدورية',
      department: 'الخليج للتدريب',
      color: '#000000'
    }, {
      id: 4,
      date: '2024-05-25',
      title: 'اجتماع بقاعدة البيانات المترية',
      department: 'جامعة الملك سعود',
      color: '#000000'
    }, {
      id: 5,
      date: '2024-06-02',
      title: 'القطاعات الوظيفية',
      department: 'داخلي',
      color: '#000000'
    }, {
      id: 6,
      date: '2024-06-07',
      title: 'جلسة ملاحظة النموذج المدخل',
      department: 'داخلي',
      color: '#000000'
    }]
  };

  return (
    <div className="h-full flex flex-col font-arabic overflow-hidden py-0 px-[24px]">
      <div className="mb-6 py-0 px-0">
        <ProjectStatsSection stats={mockData.stats} />
      </div>

      <div className="flex-1 grid gap-4 p-4" style={{
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'auto auto auto'
      }}>
        <div style={{ gridColumn: '1 / 4', gridRow: '1' }}>
          <TimelineWidget timeline={mockData.timeline} />
        </div>
        
        <div style={{ gridColumn: '4', gridRow: '1' }}>
          <DataVisualizationPanel 
            title="البيانات" 
            value={75} 
            description="نسبة الإنجاز"
            chart="circle"
          />
        </div>

        <div style={{ gridColumn: '1', gridRow: '2' }}>
          <AlertsPanel alerts={mockData.alerts} />
        </div>

        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <ProjectSummaryPanel projects={mockData.projects} />
        </div>

        <div style={{ gridColumn: '3 / 5', gridRow: '2' }}>
          <FinancialOverviewChart 
            title="النظرة المالية العامة"
            data={mockData.financial}
            isProfit={true}
          />
        </div>

        <div style={{ gridColumn: '1 / 3', gridRow: '3' }}>
          <DataVisualizationPanel 
            title="الأداء الشهري" 
            value={85} 
            description="معدل النمو"
            chart="bar"
          />
        </div>

        <div style={{ gridColumn: '3 / 5', gridRow: '3' }}>
          <DataVisualizationPanel 
            title="اتجاه المبيعات" 
            value={92} 
            description="نسبة التحسن"
            chart="line"
          />
        </div>
      </div>
    </div>
  );
};
