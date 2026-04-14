import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE, RingMetricCard } from '@/components/shared/visual-data';
import { mockCRMAnalytics, mockNPS } from './data';

export const OverviewTab: React.FC = () => {
  const funnelData = mockCRMAnalytics.salesFunnel;
  const satisfactionData = [
    { name: 'ممتاز', value: mockCRMAnalytics.customerSatisfaction.excellent, color: '#bdeed3' },
    { name: 'جيد', value: mockCRMAnalytics.customerSatisfaction.good, color: '#a4e2f6' },
    { name: 'مقبول', value: mockCRMAnalytics.customerSatisfaction.fair, color: '#fbe2aa' },
    { name: 'ضعيف', value: mockCRMAnalytics.customerSatisfaction.poor, color: '#f1b5b9' },
  ];

  const monthlyTrend = [
    { label: 'يناير', customers: 142, revenue: 1100000 },
    { label: 'فبراير', customers: 148, revenue: 1180000 },
    { label: 'مارس', customers: 151, revenue: 1220000 },
    { label: 'أبريل', customers: 154, revenue: 1190000 },
    { label: 'مايو', customers: 156, revenue: 1250000 },
    { label: 'يونيو', customers: 158, revenue: 1300000 },
  ];

  const kpiStats = [
    { title: 'إجمالي العملاء', value: mockCRMAnalytics.totalCustomers, unit: 'عميل', description: 'العملاء المسجلون حالياً' },
    { title: 'معدل التحويل', value: `${mockCRMAnalytics.conversionRate}%`, unit: 'تحويل', description: 'نسبة تحويل الفرص' },
    { title: 'درجة NPS', value: mockNPS.score, unit: 'نقطة', description: 'مؤشر رضا العملاء' },
    { title: 'الإيرادات الشهرية', value: `${(mockCRMAnalytics.monthlyRevenue / 1000000).toFixed(1)}`, unit: 'مليون ر.س', description: 'إجمالي الإيرادات' },
  ];

  return (
    <div className="space-y-5">
      <KPIStatsSection stats={kpiStats} />

      <AppDashboardGrid columns={12} density="default">
        <AppGridItem colSpan={6} tabletSpan={6}>
        <DataCardFrame title="مسار المبيعات">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
                <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
                <Bar dataKey="count" fill="#a4e2f6" radius={[999, 999, 999, 999]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DataCardFrame>
        </AppGridItem>

        <AppGridItem colSpan={6} tabletSpan={6}>
        <RingMetricCard
            title="رضا العملاء"
            centerValue={`${mockCRMAnalytics.customerSatisfaction.excellent + mockCRMAnalytics.customerSatisfaction.good}%`}
            centerUnit="إيجابي"
            layers={satisfactionData.map(d => ({
              value: d.value,
              color: d.color,
              label: d.name,
            }))}
          />
        </AppGridItem>
      </AppDashboardGrid>

      <DataCardFrame title="الاتجاهات الشهرية">
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="crmAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9d2fd" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#d9d2fd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
              <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
              <Area type="monotone" dataKey="customers" stroke="#d9d2fd" strokeWidth={2.5} fill="url(#crmAreaFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-3 h-1 rounded-full bg-[#d9d2fd]" />
          <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">عدد العملاء</span>
        </div>
      </DataCardFrame>

      {/* AI Insights */}
      <DataCardFrame title="رؤى الذكاء الاصطناعي">
        <div className="space-y-3">
          {[
            { msg: 'بناءً على الاتجاهات الحالية، متوقع زيادة الإيرادات بنسبة 15% في الربع القادم', color: '#a4e2f6' },
            { msg: '85% من التفاعلات الأخيرة إيجابية، مع تحسن ملحوظ في رضا العملاء', color: '#fbe2aa' },
            { msg: 'تم تحديد 3 عملاء معرضين لخطر المغادرة - يُنصح بالتواصل الاستباقي', color: '#bdeed3' },
          ].map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-[16px]" style={{ backgroundColor: `${insight.color}20` }}>
              <span className="w-1 h-full min-h-[20px] rounded-full shrink-0" style={{ backgroundColor: insight.color }} />
              <p className="text-[12px] text-[rgba(11,15,18,0.70)] font-arabic leading-relaxed">{insight.msg}</p>
            </div>
          ))}
        </div>
      </DataCardFrame>
    </div>
  );
};
