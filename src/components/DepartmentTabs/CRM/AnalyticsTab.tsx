import React, { useState } from 'react';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { CapsuleBarChart } from '@/components/shared/visual-data/CapsuleBarChart';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from '@/components/shared/visual-data';
import { mockCRMAnalytics, mockNPS } from './data';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const customerGrowthData = [
    { month: 'يناير', new: 8, total: 142 },
    { month: 'فبراير', new: 12, total: 153 },
    { month: 'مارس', new: 9, total: 159 },
    { month: 'أبريل', new: 15, total: 172 },
    { month: 'مايو', new: 11, total: 179 },
    { month: 'يونيو', new: 13, total: 191 },
  ];

  const revenueBySegment = [
    { segment: 'شركات كبيرة', revenue: 4500000, color: '#3DA8F5' },
    { segment: 'متوسطة', revenue: 2800000, color: '#3DBE8B' },
    { segment: 'صغيرة', revenue: 1200000, color: '#F6C445' },
    { segment: 'ناشئة', revenue: 450000, color: '#E5564D' },
  ];

  const salesPerformance = [
    { month: 'يناير', target: 1000000, actual: 950000 },
    { month: 'فبراير', target: 1100000, actual: 1180000 },
    { month: 'مارس', target: 1200000, actual: 1220000 },
    { month: 'أبريل', target: 1150000, actual: 1190000 },
    { month: 'مايو', target: 1300000, actual: 1250000 },
    { month: 'يونيو', target: 1400000, actual: 1450000 },
  ];

  const satisfactionTrend = [
    { month: 'يناير', nps: 76, satisfaction: 4.2 },
    { month: 'فبراير', nps: 78, satisfaction: 4.3 },
    { month: 'مارس', nps: 74, satisfaction: 4.1 },
    { month: 'أبريل', nps: 82, satisfaction: 4.5 },
    { month: 'مايو', nps: 79, satisfaction: 4.4 },
    { month: 'يونيو', nps: 81, satisfaction: 4.6 },
  ];

  const conversionFunnel = [
    { label: 'زوار الموقع', value: 12500 },
    { label: 'استفسارات', value: 1250 },
    { label: 'عروض أسعار', value: 375 },
    { label: 'مفاوضات', value: 188 },
    { label: 'صفقات مغلقة', value: 94 },
  ];

  const churnData = [
    { label: 'السعر', value: 35 },
    { label: 'جودة الخدمة', value: 28 },
    { label: 'عدم الاستخدام', value: 20 },
    { label: 'منافس أفضل', value: 12 },
    { label: 'أخرى', value: 5 },
  ];

  const handleExport = () => {
    downloadAsCSV(
      ['الشهر', 'المستهدف', 'الفعلي'],
      salesPerformance.map(r => [r.month, String(r.target), String(r.actual)]),
      'تقرير-تحليلات-CRM'
    );
    toast.success('تم تصدير التقرير');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="px-3 py-1.5 border border-[#DADCE0] rounded-full bg-white font-arabic text-xs">
          <option value="1month">الشهر الماضي</option>
          <option value="3months">آخر 3 أشهر</option>
          <option value="6months">آخر 6 أشهر</option>
          <option value="1year">السنة</option>
        </select>
        <div className="flex gap-2">
          <button onClick={() => toast.success('تم التحديث')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DADCE0] text-xs font-arabic hover:bg-[#d9e7ed]/50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> تحديث
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B0F12] text-white text-xs font-arabic hover:bg-[#0B0F12]/90 transition-colors">
            <Download className="w-3.5 h-3.5" /> تصدير
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricHeroCard title="إجمالي العملاء" value={mockCRMAnalytics.totalCustomers} description={`+${mockCRMAnalytics.newCustomersThisMonth} هذا الشهر`} className="min-h-[130px]" />
        <MetricHeroCard title="الإيرادات الشهرية" value={`${(mockCRMAnalytics.monthlyRevenue / 1000000).toFixed(1)}`} unit="م ر.س" description="+12% عن الماضي" className="min-h-[130px]" />
        <MetricHeroCard title="معدل التحويل" value={`${mockCRMAnalytics.conversionRate}%`} description="+3.2% عن الماضي" className="min-h-[130px]" />
        <MetricHeroCard title="درجة NPS" value={mockNPS.score} description="+5 نقاط" className="min-h-[130px]" />
        <MetricHeroCard title="معدل الفقدان" value={`${mockCRMAnalytics.churnRate}%`} description="-0.8% عن الماضي" className="min-h-[130px]" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCardFrame title="نمو العملاء">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={customerGrowthData}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#FFF' }} />
              <Area type="monotone" dataKey="total" stroke="#3DA8F5" fill="#3DA8F5" fillOpacity={0.15} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </DataCardFrame>

        <DataCardFrame title="أداء المبيعات">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesPerformance} barSize={20}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#FFF' }} formatter={(v: any) => [`${(v / 1000000).toFixed(1)}م`, '']} />
              <Bar dataKey="target" fill="rgba(11,15,18,0.08)" radius={[999, 999, 999, 999]} />
              <Bar dataKey="actual" fill="#3DA8F5" radius={[999, 999, 999, 999]} />
            </BarChart>
          </ResponsiveContainer>
        </DataCardFrame>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCardFrame title="الإيرادات حسب الشريحة">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={revenueBySegment} cx="50%" cy="50%" outerRadius={85} innerRadius={50} strokeWidth={0} dataKey="revenue"
                label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}>
                {revenueBySegment.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#FFF' }} />
            </PieChart>
          </ResponsiveContainer>
        </DataCardFrame>

        <DataCardFrame title="اتجاه رضا العملاء">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={satisfactionTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#FFF' }} />
              <Line type="monotone" dataKey="nps" stroke="#3DBE8B" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="satisfaction" stroke="#3DA8F5" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </DataCardFrame>
      </div>

      {/* Funnel & Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapsuleBarChart title="مسار التحويل" data={conversionFunnel} color="#3DA8F5" />
        <CapsuleBarChart title="أسباب فقدان العملاء" data={churnData} color="#E5564D" />
      </div>

      {/* AI Insights */}
      <DataCardFrame title="رؤى الذكاء الاصطناعي">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { title: 'فرصة نمو', text: 'العملاء في الشريحة الفضية يظهرون استعداداً للترقية. حملة مستهدفة لـ 67 عميل.', color: '#3DA8F5' },
            { title: 'تحذير مخاطر', text: '5 عملاء مميزين يظهرون علامات عدم رضا. يُنصح بالتدخل الفوري.', color: '#F6C445' },
            { title: 'أداء متميز', text: 'تحسن معدل التحويل بنسبة 15% هذا الربع. استمر في الاستراتيجية الحالية.', color: '#3DBE8B' },
          ].map((insight, i) => (
            <div key={i} className="rounded-[18px] p-4" style={{ backgroundColor: `${insight.color}10`, borderRight: `3px solid ${insight.color}` }}>
              <h4 className="text-xs font-bold font-arabic mb-1" style={{ color: insight.color }}>{insight.title}</h4>
              <p className="text-[11px] text-[rgba(11,15,18,0.60)] font-arabic leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </DataCardFrame>
    </div>
  );
};
