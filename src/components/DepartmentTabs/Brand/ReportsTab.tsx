import React, { useState } from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Download, Calendar, FileText, Eye, Heart, TrendingUp, Target, Users } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';

export const ReportsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportCategories = [
    { id: 'all', name: 'جميع التقارير', count: 24 },
    { id: 'cultural', name: 'الثقافية', count: 8 },
    { id: 'performance', name: 'الأداء', count: 6 },
    { id: 'engagement', name: 'التفاعل', count: 5 },
    { id: 'impact', name: 'الأثر', count: 5 },
  ];

  const availableReports = [
    { id: 1, title: 'تقرير الهوية الثقافية الشهري', type: 'cultural', period: 'يناير 2024', status: 'جاهز', pages: 24, generatedAt: '2024-01-31', culturalScore: 92, insights: 8, charts: 12 },
    { id: 2, title: 'تحليل أداء العلامة التجارية', type: 'performance', period: 'الربع الأول 2024', status: 'قيد التحضير', pages: 36, generatedAt: '2024-02-01', culturalScore: 88, insights: 12, charts: 18 },
    { id: 3, title: 'تقرير التفاعل والمشاركة', type: 'engagement', period: 'يناير 2024', status: 'جاهز', pages: 15, generatedAt: '2024-01-30', culturalScore: 85, insights: 6, charts: 8 },
    { id: 4, title: 'تقييم الأثر الثقافي للمشاريع', type: 'impact', period: '2023', status: 'جاهز', pages: 45, generatedAt: '2024-01-15', culturalScore: 94, insights: 15, charts: 22 },
  ];

  const kpiData = [
    { metric: 'الانسجام الثقافي', current: 87, target: 90, trend: '+3%' },
    { metric: 'صحة الهوية', current: 92, target: 95, trend: '+5%' },
    { metric: 'الوعي بالعلامة', current: 78, target: 85, trend: '+2%' },
    { metric: 'التفاعل الثقافي', current: 85, target: 88, trend: '+7%' },
  ];

  const getStatusColor = (s: string) => s === 'جاهز' ? 'bg-[#3DBE8B]/10 text-[#3DBE8B]' : s === 'قيد التحضير' ? 'bg-[#F6C445]/10 text-[#F6C445]' : 'bg-[rgba(11,15,18,0.08)] text-[rgba(11,15,18,0.50)]';

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <div key={i} className="rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col justify-between min-h-[150px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic">{kpi.metric}</span>
              <span className="text-xs font-bold text-[#3DBE8B]">{kpi.trend}</span>
            </div>
            <div className="mt-auto">
              <div className="flex items-baseline gap-1">
                <span className="text-[36px] leading-none font-bold text-[#0B0F12] font-arabic">{kpi.current}%</span>
                <span className="text-[11px] text-[rgba(11,15,18,0.35)] font-arabic">/ {kpi.target}%</span>
              </div>
              <div className="w-full h-2 bg-[rgba(11,15,18,0.08)] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#3DA8F5] rounded-full transition-all" style={{ width: `${kpi.current}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {reportCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-arabic transition-colors ${selectedCategory === cat.id ? 'bg-[#0B0F12] text-white' : 'border border-[#DADCE0] text-[#0B0F12] hover:bg-[#d9e7ed]/50'}`}
          >
            {cat.name} <span className="opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Reports */}
      <div className="space-y-4">
        {availableReports
          .filter(r => selectedCategory === 'all' || r.type === selectedCategory)
          .map(report => (
            <div key={report.id} className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#0B0F12] font-arabic mb-1">{report.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(report.status)}`}>{report.status}</span>
                    <span className="text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">الفترة: {report.period}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[28px] font-bold text-[#3DA8F5]">{report.culturalScore}%</span>
                  <p className="text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">النقاط الثقافية</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{report.pages}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">صفحة</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{report.insights}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">رؤى</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{report.charts}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">مخطط</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">تم الإنشاء: {report.generatedAt}</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DADCE0] text-[10px] font-arabic hover:bg-[#d9e7ed]/50 transition-colors">
                    <Eye className="w-3 h-3" /> عرض
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B0F12] text-white text-[10px] font-arabic">
                    <Download className="w-3 h-3" /> تحميل
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
