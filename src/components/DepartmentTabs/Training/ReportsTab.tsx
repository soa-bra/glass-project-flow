import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { NumericStatCard } from '@/components/shared/visual-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE, RingMetricCard } from '@/components/shared/visual-data';
import { FileText, Download, Eye, Calendar, TrendingUp, Users, Target, DollarSign } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');

  const performanceReports = [
    { id: 1, title: 'تقرير الأداء الشهري - مارس 2024', period: 'monthly', generated_date: '2024-03-31', status: 'completed', metrics: { enrollments: 89, completions: 67, satisfaction: 4.3 } },
    { id: 2, title: 'تقرير الأداء الربع سنوي - Q1 2024', period: 'quarterly', generated_date: '2024-03-31', status: 'completed', metrics: { enrollments: 234, completions: 187, satisfaction: 4.4 } },
  ];

  const roiReports = [
    { id: 1, title: 'تقرير العائد على الاستثمار - Q1 2024', investment: 450000, benefits: 675000, roi: 50, generated_date: '2024-03-31' },
    { id: 2, title: 'تحليل التكلفة والفائدة السنوي - 2023', investment: 1800000, benefits: 2700000, roi: 75, generated_date: '2024-01-15' },
  ];

  const skillGapReports = [
    { id: 1, title: 'تقرير فجوات المهارات - مارس 2024', critical_gaps: 3, departments_affected: 5, recommended_training: 12, generated_date: '2024-03-25' },
  ];

  const monthlyData = [
    { month: 'يناير', enrollments: 67, completions: 52 },
    { month: 'فبراير', enrollments: 73, completions: 58 },
    { month: 'مارس', enrollments: 89, completions: 67 },
    { month: 'أبريل', enrollments: 84, completions: 63 },
    { month: 'مايو', enrollments: 95, completions: 71 },
    { month: 'يونيو', enrollments: 98, completions: 74 },
  ];

  const departmentData = [
    { name: 'التسويق', value: 35, color: '#a4e2f6' },
    { name: 'المبيعات', value: 28, color: '#bdeed3' },
    { name: 'الموارد البشرية', value: 22, color: '#fbe2aa' },
    { name: 'التقنية', value: 15, color: '#d9d2fd' },
  ];

  const ReportRow = ({ report, children }: { report: { id: number; title: string; generated_date: string }; children?: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
      <div className="flex-1">
        <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12]">{report.title}</h4>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">
          <span>تاريخ الإنشاء: {new Date(report.generated_date).toLocaleDateString('ar-SA')}</span>
        </div>
        {children}
      </div>
      <div className="flex gap-2">
        <BaseActionButton variant="outline" size="sm" icon={<Eye className="w-3 h-3" />}>عرض</BaseActionButton>
        <BaseActionButton variant="primary" size="sm" icon={<Download className="w-3 h-3" />}>تحميل</BaseActionButton>
      </div>
    </div>
  );

  const PerformanceReports = () => (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">تقارير الأداء</span>
        <BaseActionButton variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>إنشاء تقرير جديد</BaseActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <NumericStatCard title="إجمالي التسجيلات" value="289" description="+12% من الشهر الماضي" accentColor="#a4e2f6" />
        <NumericStatCard title="معدل الإنجاز" value="78%" description="+5% من الشهر الماضي" accentColor="#bdeed3" />
        <NumericStatCard title="متوسط الرضا" value="4.5" description="+0.2 من الشهر الماضي" accentColor="#d9d2fd" />
        <NumericStatCard title="ساعات تدريبية" value="1,280" description="+18% من الشهر الماضي" accentColor="#fbe2aa" />
      </div>

      <BaseBox title="الأداء الشهري">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
            <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
            <Line type="monotone" dataKey="enrollments" stroke="#a4e2f6" strokeWidth={2} name="التسجيلات" />
            <Line type="monotone" dataKey="completions" stroke="#bdeed3" strokeWidth={2} name="الإكمالات" />
          </LineChart>
        </ResponsiveContainer>
      </BaseBox>

      <BaseBox title="التقارير المتاحة">
        <div className="space-y-3">
          {performanceReports.map((report) => (
            <ReportRow key={report.id} report={report}>
              <div className="flex items-center gap-4 mt-1 text-[10px] font-arabic">
                <BaseBadge variant={report.status === 'completed' ? 'success' : 'outline'} size="sm">
                  {report.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                </BaseBadge>
                <span className="text-[rgba(11,15,18,0.40)]">التسجيلات: {report.metrics.enrollments}</span>
                <span className="text-[rgba(11,15,18,0.40)]">الإكمالات: {report.metrics.completions}</span>
              </div>
            </ReportRow>
          ))}
        </div>
      </BaseBox>
    </div>
  );

  const ROIReports = () => (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">تقارير العائد على الاستثمار</span>
        <BaseActionButton variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>حساب ROI جديد</BaseActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <NumericStatCard title="إجمالي الاستثمار" value="1.8M" description="ريال سعودي" accentColor="#bdeed3" />
        <NumericStatCard title="إجمالي الفوائد" value="2.7M" description="ريال سعودي" accentColor="#a4e2f6" />
        <NumericStatCard title="عائد الاستثمار" value="75%" description="ROI" accentColor="#d9d2fd" />
        <NumericStatCard title="فترة الاسترداد" value="18" description="شهر" accentColor="#fbe2aa" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BaseBox title="اتجاه العائد على الاستثمار">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { quarter: 'Q1 2023', roi: 45 },
              { quarter: 'Q2 2023', roi: 52 },
              { quarter: 'Q3 2023', roi: 68 },
              { quarter: 'Q4 2023', roi: 75 },
              { quarter: 'Q1 2024', roi: 80 },
            ]}>
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
              <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
              <Bar dataKey="roi" fill="#a4e2f6" radius={[999, 999, 999, 999]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </BaseBox>

        <RingMetricCard
            title="توزيع العائد حسب القسم"
            centerValue="100%"
            centerUnit="توزيع"
            layers={departmentData.map(d => ({
              value: d.value,
              color: d.color,
              label: d.name,
            }))}
          />
      </div>

      <BaseBox title="تقارير العائد على الاستثمار">
        <div className="space-y-3">
          {roiReports.map((report) => (
            <ReportRow key={report.id} report={report}>
              <div className="grid grid-cols-3 gap-4 mt-2 text-[10px] font-arabic">
                <div><span className="text-[rgba(11,15,18,0.40)]">الاستثمار:</span> <span className="font-bold">{report.investment.toLocaleString()} ر.س</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">الفوائد:</span> <span className="font-bold">{report.benefits.toLocaleString()} ر.س</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">العائد:</span> <span className="font-bold text-[#3DBE8B]">{report.roi}%</span></div>
              </div>
            </ReportRow>
          ))}
        </div>
      </BaseBox>
    </div>
  );

  const SkillGapReports = () => (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">تقارير فجوات المهارات</span>
        <BaseActionButton variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>تحليل فجوات جديد</BaseActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <NumericStatCard title="فجوات حرجة" value="3" description="تحتاج معالجة عاجلة" accentColor="#f1b5b9" />
        <NumericStatCard title="أقسام متأثرة" value="5" description="من أصل 8 أقسام" accentColor="#fbe2aa" />
        <NumericStatCard title="تدريبات موصى بها" value="12" description="برنامج تدريبي" accentColor="#a4e2f6" />
        <NumericStatCard title="فترة المعالجة" value="6" description="أشهر" accentColor="#bdeed3" />
      </div>

      <BaseBox title="تحليل فجوات المهارات حسب القسم">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { department: 'التسويق', critical: 2, high: 4, medium: 6, low: 3 },
            { department: 'المبيعات', critical: 1, high: 3, medium: 5, low: 4 },
            { department: 'التقنية', critical: 3, high: 6, medium: 8, low: 2 },
            { department: 'الموارد البشرية', critical: 0, high: 2, medium: 4, low: 5 },
            { department: 'المالية', critical: 1, high: 2, medium: 3, low: 6 },
          ]}>
            <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
            <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
            <Bar dataKey="critical" stackId="a" fill="#f1b5b9" name="حرج" radius={[0, 0, 0, 0]} />
            <Bar dataKey="high" stackId="a" fill="#fbe2aa" name="عالي" />
            <Bar dataKey="medium" stackId="a" fill="#a4e2f6" name="متوسط" />
            <Bar dataKey="low" stackId="a" fill="#bdeed3" name="منخفض" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </BaseBox>

      <BaseBox title="تقارير تحليل فجوات المهارات">
        <div className="space-y-3">
          {skillGapReports.map((report) => (
            <ReportRow key={report.id} report={report}>
              <div className="grid grid-cols-3 gap-4 mt-2 text-[10px] font-arabic">
                <div><span className="text-[rgba(11,15,18,0.40)]">فجوات حرجة:</span> <span className="font-bold text-[#E5564D]">{report.critical_gaps}</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">أقسام متأثرة:</span> <span className="font-bold">{report.departments_affected}</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">تدريبات موصى بها:</span> <span className="font-bold">{report.recommended_training}</span></div>
              </div>
            </ReportRow>
          ))}
        </div>
      </BaseBox>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">التقارير</span>
          <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">تقارير الأداء وتحليلات العائد على الاستثمار وتقارير فجوات المهارات</p>
        </div>
        <div className="flex gap-2">
          <BaseActionButton variant="outline" size="sm">جدولة تقرير</BaseActionButton>
          <BaseActionButton variant="primary" size="sm">إعدادات التقارير</BaseActionButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-[rgba(11,15,18,0.04)] p-1">
          <TabsTrigger value="performance" className="rounded-full text-[12px] font-arabic">تقارير الأداء</TabsTrigger>
          <TabsTrigger value="roi" className="rounded-full text-[12px] font-arabic">العائد على الاستثمار</TabsTrigger>
          <TabsTrigger value="skillgap" className="rounded-full text-[12px] font-arabic">فجوات المهارات</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6 mt-4">
          <PerformanceReports />
        </TabsContent>
        <TabsContent value="roi" className="space-y-6 mt-4">
          <ROIReports />
        </TabsContent>
        <TabsContent value="skillgap" className="space-y-6 mt-4">
          <SkillGapReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
