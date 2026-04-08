import React, { useState } from 'react';
import { Download, Eye, X } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { CapsuleBarChart } from '@/components/shared/visual-data/CapsuleBarChart';
import { mockWorkforceAnalytics, mockHRStats } from './data';
import { toast } from 'sonner';

export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [previewReport, setPreviewReport] = useState<typeof reportTypes[0] | null>(null);
  const analytics = mockWorkforceAnalytics;
  const stats = mockHRStats;

  const reportTypes = [
    { id: 'attendance', title: 'تقرير الحضور والغياب', lastGenerated: '2024-12-30' },
    { id: 'performance', title: 'تقرير الأداء والتقييم', lastGenerated: '2024-12-28' },
    { id: 'recruitment', title: 'تقرير التوظيف والاستقطاب', lastGenerated: '2024-12-25' },
    { id: 'training', title: 'تقرير التدريب والتطوير', lastGenerated: '2024-12-20' },
    { id: 'workforce', title: 'تحليل القوى العاملة', lastGenerated: '2024-12-30' },
  ];

  const handleDownload = (report: typeof reportTypes[0]) => {
    const content = {
      title: report.title,
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      data: {
        totalEmployees: analytics.totalEmployees,
        turnoverRate: analytics.turnoverRate,
        attendanceRate: stats.attendanceRate,
        departments: analytics.departmentDistribution,
        performance: analytics.performanceDistribution,
      },
    };
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}-${selectedPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`تم تحميل: ${report.title}`);
  };

  const handlePreview = (report: typeof reportTypes[0]) => {
    setPreviewReport(report);
  };

  const deptData = analytics.departmentDistribution.map((d: any) => ({
    label: d.department,
    value: d.count,
  }));

  const perfData = [
    { label: 'ممتاز', value: analytics.performanceDistribution.excellent },
    { label: 'جيد', value: analytics.performanceDistribution.good },
    { label: 'مقبول', value: analytics.performanceDistribution.satisfactory },
    { label: 'يحتاج تحسين', value: analytics.performanceDistribution.needsImprovement },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricHeroCard title="إجمالي الموظفين" value={analytics.totalEmployees} />
        <MetricHeroCard title="معدل الدوران" value={`${analytics.turnoverRate}%`} />
        <MetricHeroCard title="متوسط العمر" value={analytics.averageAge} unit="سنة" />
        <MetricHeroCard title="معدل الحضور" value={`${stats.attendanceRate}%`} />
      </div>

      {/* Reports List */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">
            التقارير المتاحة
          </span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[#DADCE0] rounded-full bg-white font-arabic text-xs"
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
            <option value="quarterly">ربع سنوي</option>
          </select>
        </div>
        <div className="space-y-3">
          {reportTypes.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 rounded-[18px] border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div>
                <h4 className="text-sm font-bold text-[#0B0F12] font-arabic">{report.title}</h4>
                <p className="text-[11px] text-[rgba(11,15,18,0.35)] font-arabic mt-1">آخر إنشاء: {report.lastGenerated}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(report)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DADCE0] text-xs font-arabic hover:bg-[#d9e7ed]/50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> عرض
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B0F12] text-white text-xs font-arabic hover:bg-[#0B0F12]/90 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> تحميل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setPreviewReport(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[24px] border border-[#DADCE0] shadow-[0_12px_28px_rgba(0,0,0,0.10)] w-full max-w-2xl max-h-[80vh] overflow-auto p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#0B0F12] font-arabic">{previewReport.title}</h3>
              <button onClick={() => setPreviewReport(null)} className="p-2 rounded-full hover:bg-[#d9e7ed]/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-sm font-arabic" dir="rtl">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-[18px] bg-[#d9e7ed]/30">
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)]">إجمالي الموظفين</p>
                  <p className="text-2xl font-bold text-[#0B0F12] mt-1">{analytics.totalEmployees}</p>
                </div>
                <div className="p-4 rounded-[18px] bg-[#d9e7ed]/30">
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)]">معدل الحضور</p>
                  <p className="text-2xl font-bold text-[#0B0F12] mt-1">{stats.attendanceRate}%</p>
                </div>
                <div className="p-4 rounded-[18px] bg-[#d9e7ed]/30">
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)]">معدل الدوران</p>
                  <p className="text-2xl font-bold text-[#0B0F12] mt-1">{analytics.turnoverRate}%</p>
                </div>
                <div className="p-4 rounded-[18px] bg-[#d9e7ed]/30">
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)]">الفترة</p>
                  <p className="text-2xl font-bold text-[#0B0F12] mt-1">{selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : selectedPeriod === 'monthly' ? 'شهري' : 'ربع سنوي'}</p>
                </div>
              </div>
              <div className="p-4 rounded-[18px] border border-[#DADCE0]">
                <p className="text-xs text-[rgba(11,15,18,0.50)] mb-2">توزيع الأداء</p>
                <div className="space-y-2">
                  {perfData.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[rgba(11,15,18,0.60)]">{p.label}</span>
                      <span className="font-semibold">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => { handleDownload(previewReport); setPreviewReport(null); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0F12] text-white text-xs font-arabic hover:bg-[#0B0F12]/90 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> تحميل التقرير
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapsuleBarChart title="التوزيع حسب القسم" data={deptData} color="#3DA8F5" />
        <CapsuleBarChart title="توزيع الأداء" data={perfData} color="#3DBE8B" />
      </div>
    </div>
  );
};
