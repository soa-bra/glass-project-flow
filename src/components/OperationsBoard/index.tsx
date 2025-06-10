
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
import { LegalTab } from './LegalTab';
import { HRTab } from './HRTab';
import { ClientsTab } from './ClientsTab';
import { ReportsTab } from './ReportsTab';

// نوع لبيانات التبويب
type TabData = {
  [key: string]: any;
};

interface OperationsBoardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const OperationsBoard = ({ isVisible, onClose }: OperationsBoardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tabData, setTabData] = useState<TabData>({});
  const [loading, setLoading] = useState<boolean>(false);

  // محاكاة جلب البيانات من الـ API
  const fetchTabData = async (tabName: string) => {
    setLoading(true);
    // هنا سيتم استبدال هذا بطلب API حقيقي
    // const response = await fetch(`/api/overview?dept=${tabName}`);
    // const data = await response.json();
    
    // بيانات تجريبية لأغراض العرض
    const mockData = {
      overview: {
        timeline: [
          { id: 1, date: '2025-06-15', title: 'اجتماع مجلس الإدارة', department: 'إدارية', color: 'bg-blue-500' },
          { id: 2, date: '2025-06-20', title: 'تسليم المرحلة الأولى', department: 'هندسية', color: 'bg-green-500' },
          { id: 3, date: '2025-06-25', title: 'توقيع عقد جديد', department: 'قانونية', color: 'bg-purple-500' },
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
    };
    
    setTimeout(() => {
      setTabData(prevData => ({ ...prevData, [tabName]: mockData[tabName as keyof typeof mockData] }));
      setLoading(false);
    }, 300); // محاكاة وقت التحميل
  };

  // جلب بيانات التبويب النشط عند تغييره
  useEffect(() => {
    if (isVisible) {
      fetchTabData(activeTab);
    }
  }, [activeTab, isVisible]);

  // التبويبات مع المحتوى
  return (
    <div 
      className={`fixed transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-[100%]'
      }`}
      style={{
        width: '60vw',
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        left: '20px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #B8E6B8 0%, #7FDFDF 50%, #5FB3D4 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full h-full"
          dir="rtl"
        >
          <div className="border-b border-gray-200/30 h-[60px] flex items-center px-6">
            <TabsList className="bg-transparent w-full justify-start">
              <TabsTrigger 
                value="overview" 
                className={`text-lg font-arabic py-2 px-4 ${activeTab === 'overview' ? 'border-b-[3px] border-sky-400' : ''}`}
              >
                نظرة عامّة
              </TabsTrigger>
              <TabsTrigger 
                value="finance" 
                className={`text-lg font-arabic py-2 px-4 ${activeTab === 'finance' ? 'border-b-[3px] border-sky-400' : ''}`}
              >
                مالية
              </TabsTrigger>
              <TabsTrigger 
                value="legal" 
                className={`text-lg font-arabic py-2 px-4 ${activeTab === 'legal' ? 'border-b-[3px] border-sky-400' : ''}`}
              >
                قانونية
              </TabsTrigger>
              <TabsTrigger 
                value="hr" 
                className={`text-lg font-arabic py-2 px-4 ${activeTab === 'hr' ? 'border-b-[3px] border-sky-400' : ''}`}
              >
                موارد بشرية
              </TabsTrigger>
              <TabsTrigger 
                value="clients" 
                className={`text-lg font-arabic py-2 px-4 ${activeTab === 'clients' ? 'border-b-[3px] border-sky-400' : ''}`}
              >
                عملاء
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className={`text-lg font-arabic py-2 px-4 ${activeTab === 'reports' ? 'border-b-[3px] border-sky-400' : ''}`}
              >
                تقارير
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent 
              value="overview" 
              className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out"
            >
              <OverviewTab data={tabData.overview} loading={loading} />
            </TabsContent>

            <TabsContent 
              value="finance" 
              className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out"
            >
              <FinanceTab data={tabData.finance} loading={loading} />
            </TabsContent>

            <TabsContent 
              value="legal" 
              className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out"
            >
              <LegalTab data={tabData.legal} loading={loading} />
            </TabsContent>

            <TabsContent 
              value="hr" 
              className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out"
            >
              <HRTab data={tabData.hr} loading={loading} />
            </TabsContent>

            <TabsContent 
              value="clients" 
              className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out"
            >
              <ClientsTab data={tabData.clients} loading={loading} />
            </TabsContent>

            <TabsContent 
              value="reports" 
              className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out"
            >
              <ReportsTab data={tabData.reports} loading={loading} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
