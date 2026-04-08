import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, Eye, Calendar, Globe, Target } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';

export const ReportsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const reportTypes = [
    { id: 'impact', label: 'تقرير الأثر', color: '#3DA8F5' },
    { id: 'esg', label: 'تقرير ESG', color: '#3DBE8B' },
    { id: 'sdg', label: 'تقرير SDG', color: '#9B59B6' },
    { id: 'sroi', label: 'تقرير SROI', color: '#F6C445' },
    { id: 'annual', label: 'التقرير السنوي', color: '#E5564D' },
  ];

  const mockReports = [
    { id: 'rep-001', title: 'تقرير الأثر الاجتماعي - الربع الثاني 2024', type: 'impact', period: { start: '2024-04-01', end: '2024-06-30' }, generatedDate: '2024-07-15', status: 'published', metrics: { totalBudget: 450000, totalBeneficiaries: 2500, totalVolunteerHours: 680, averageSROI: 3.4 } },
    { id: 'rep-002', title: 'تقرير ESG - النصف الأول 2024', type: 'esg', period: { start: '2024-01-01', end: '2024-06-30' }, generatedDate: '2024-07-20', status: 'review', metrics: { totalBudget: 850000, totalBeneficiaries: 5000, totalVolunteerHours: 1200, averageSROI: 3.1 } },
  ];

  const getStatusColor = (s: string) => s === 'published' ? 'bg-[#3DBE8B]/10 text-[#3DBE8B]' : s === 'review' ? 'bg-[#F6C445]/10 text-[#F6C445]' : 'bg-[rgba(11,15,18,0.08)] text-[rgba(11,15,18,0.50)]';
  const getStatusText = (s: string) => ({ published: 'منشور', approved: 'معتمد', review: 'قيد المراجعة', draft: 'مسودة' }[s] || s);
  const formatCurrency = (a: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(a);

  const sdgGoals = [
    { num: 4, name: 'التعليم الجيد', count: 3, color: '#3DA8F5' },
    { num: 7, name: 'طاقة نظيفة', count: 2, color: '#3DBE8B' },
    { num: 8, name: 'عمل لائق', count: 4, color: '#9B59B6' },
    { num: 13, name: 'العمل المناخي', count: 1, color: '#F6C445' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative flex-1 lg:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.30)]" />
          <Input placeholder="البحث في التقارير..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-10 rounded-full border-[#DADCE0]" />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0F12] text-white text-xs font-arabic">
          <Plus className="w-3.5 h-3.5" /> إنشاء تقرير
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {reportTypes.map(type => (
          <div key={type.id} className="rounded-[24px] bg-white border border-[#DADCE0] p-5 text-center hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow cursor-pointer">
            <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${type.color}15` }}>
              <Target className="h-5 w-5" style={{ color: type.color }} />
            </div>
            <h4 className="text-sm font-bold text-[#0B0F12] font-arabic mb-1">{type.label}</h4>
            <button className="text-[10px] font-arabic px-3 py-1 rounded-full border border-[#DADCE0] mt-2 hover:bg-[#d9e7ed]/50 transition-colors">
              <Plus className="w-3 h-3 inline ml-1" /> إنشاء
            </button>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase mb-4 block">التقارير الحديثة</span>
        <div className="space-y-4">
          {mockReports.map(report => (
            <div key={report.id} className="rounded-[18px] border border-[#DADCE0] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0B0F12] font-arabic mb-1">{report.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(report.status)}`}>{getStatusText(report.status)}</span>
                    <span className="text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">
                      {new Date(report.period.start).toLocaleDateString('ar-SA')} - {new Date(report.period.end).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{formatCurrency(report.metrics.totalBudget)}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">الميزانية</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{report.metrics.totalBeneficiaries.toLocaleString('ar-SA')}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">المستفيدين</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{report.metrics.totalVolunteerHours}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">ساعات التطوع</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-[#0B0F12]">{report.metrics.averageSROI}:1</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">SROI</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[rgba(11,15,18,0.35)] font-arabic flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {new Date(report.generatedDate).toLocaleDateString('ar-SA')}
                </span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DADCE0] text-[10px] font-arabic hover:bg-[#d9e7ed]/50 transition-colors"><Eye className="w-3 h-3" /> عرض</button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B0F12] text-white text-[10px] font-arabic"><Download className="w-3 h-3" /> تحميل</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SDG Mapping */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-[#0B0F12]" />
          <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">أهداف التنمية المستدامة</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sdgGoals.map(goal => (
            <div key={goal.num} className="rounded-[18px] p-4 text-center" style={{ backgroundColor: `${goal.color}10` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm" style={{ backgroundColor: goal.color }}>
                {goal.num}
              </div>
              <p className="text-xs font-bold font-arabic text-[#0B0F12]">{goal.name}</p>
              <p className="text-[10px] font-arabic" style={{ color: goal.color }}>{goal.count} مبادرات</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
