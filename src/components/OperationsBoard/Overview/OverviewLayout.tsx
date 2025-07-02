
import React from 'react';
import { AlertTriangle, TrendingUp, Calendar, DollarSign, Clock, Target } from 'lucide-react';
import { OperationStatsSection } from './OperationStatsSection';
import { OverviewGrid } from './OverviewGrid';
import { TimelineCard } from './TimelineCard';
import { OverviewData } from './OverviewData';

interface OverviewLayoutProps {
  data: OverviewData;
}

/**
 * تخطيط النظرة العامة - يعرض الإحصائيات الرئيسية والشبكة التفاعلية
 */
export const OverviewLayout: React.FC<OverviewLayoutProps> = ({
  data
}) => {
  console.log('OverviewLayout received data:', data);
  
  const kpiData = [
    { title: 'عدد المشاريع', value: '24', icon: Target, color: 'text-black' },
    { title: '% الالتزام بالوقت', value: '87%', icon: Clock, color: 'text-black' },
    { title: '% الالتزام بالميزانية', value: '92%', icon: DollarSign, color: 'text-black' },
    { title: 'المشاريع المتأخرة', value: '3', icon: AlertTriangle, color: 'text-black' }
  ];

  const topRisks = [
    { id: '1', title: 'تأخر في تسليم المرحلة الأولى', severity: 'high', project: 'مشروع التطبيق' },
    { id: '2', title: 'نقص في الموارد البشرية', severity: 'medium', project: 'حملة التسويق' },
    { id: '3', title: 'تجاوز الميزانية المحددة', severity: 'high', project: 'تطوير الموقع' }
  ];

  return (
    <div className="font-arabic px-[15px] py-0">
      {/* مؤشرات KPI الكلية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <kpi.icon className={`h-6 w-6 ${kpi.color} mx-auto mb-3`} />
            <h3 className="text-2xl font-bold text-black mb-1">{kpi.value}</h3>
            <p className="text-sm text-black">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* خريطة حرارية Timeline */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            خريطة حرارية Timeline إجمالي
          </h3>
          <TimelineCard />
        </div>

        {/* أحدث المخاطر */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            أحدث المخاطر (Top-5)
          </h3>
          <div className="space-y-3">
            {topRisks.map((risk) => (
              <div key={risk.id} className="p-3 bg-white rounded-2xl border border-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-black text-sm">{risk.title}</h4>
                    <p className="text-xs text-gray-600">{risk.project}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    risk.severity === 'high' ? 'bg-[#f1b5b9] text-black' : 'bg-[#fbe2aa] text-black'
                  }`}>
                    {risk.severity === 'high' ? 'عالي' : 'متوسط'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الشبكة التفاعلية */}
      <div className="py-0">
        <OverviewGrid />
      </div>
    </div>
  );
};
