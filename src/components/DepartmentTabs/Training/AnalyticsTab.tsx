import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { NumericStatCard } from '@/components/shared/visual-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { TrendingUp, Users, Clock, Award, DollarSign, Target, BookOpen } from 'lucide-react';
import { mockTrainingMetrics, mockLearningROI, mockSkillGapAlerts } from './data';

export const AnalyticsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const metrics = mockTrainingMetrics;
  const roiData = mockLearningROI;
  const skillGaps = mockSkillGapAlerts;

  const totalInvestment = roiData.reduce((acc, roi) => acc + roi.totalCost, 0);
  const totalBenefits = roiData.reduce((acc, roi) => acc + roi.businessImpact, 0);
  const averageROI = roiData.length > 0 ? roiData.reduce((acc, roi) => acc + roi.roi, 0) / roiData.length : 0;

  const OverviewSection = () => (
    <div className="space-y-5">
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">نظرة عامة على الأداء</span>

      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الدورات" value={metrics.totalCourses} description="دورة" accentColor="#a4e2f6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="متدربون نشطون" value={metrics.activeLearners} description="متدرب" accentColor="#bdeed3" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="معدل الإنجاز" value={`${metrics.completionRate}%`} description="إنجاز" accentColor="#d9d2fd" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="شهادات صادرة" value={metrics.certificatesIssued} description="شهادة" accentColor="#fbe2aa" /></AppGridItem>
      </AppDashboardGrid>

      <BaseBox title="مقياس كيركباتريك للتقييم">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'رد الفعل', value: metrics.kirkpatrickMetrics.reaction, color: '#a4e2f6' },
            { label: 'التعلم', value: metrics.kirkpatrickMetrics.learning, color: '#bdeed3' },
            { label: 'السلوك', value: metrics.kirkpatrickMetrics.behavior, color: '#d9d2fd' },
            { label: 'النتائج', value: metrics.kirkpatrickMetrics.results, color: '#fbe2aa' },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-[28px] font-bold text-[#0B0F12] font-arabic mb-1">{m.value}</div>
              <div className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-2">{m.label}</div>
              <div className="w-full h-2 bg-[rgba(11,15,18,0.04)] rounded-full">
                <div className="h-2 rounded-full transition-all" style={{ width: `${m.value * 20}%`, backgroundColor: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </BaseBox>

      <BaseBox title="الإحصائيات الشهرية">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'تسجيلات جديدة', value: metrics.monthlyStats.newEnrollments },
            { label: 'دورات مكتملة', value: metrics.monthlyStats.coursesCompleted },
            { label: 'جلسات منعقدة', value: metrics.monthlyStats.sessionsConducted },
            { label: 'إيرادات (ر.س)', value: `${(metrics.monthlyStats.revenue / 1000).toFixed(0)}k` },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)] text-center">
              <div className="text-[20px] font-bold text-[#0B0F12] font-arabic">{s.value}</div>
              <div className="text-[10px] text-[rgba(11,15,18,0.50)] font-arabic">{s.label}</div>
            </div>
          ))}
        </div>
      </BaseBox>
    </div>
  );

  const ROISection = () => (
    <div className="space-y-5">
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">تحليل العائد على الاستثمار</span>

      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الاستثمار" value={`${(totalInvestment / 1000).toFixed(0)}k`} description="ريال سعودي" accentColor="#a4e2f6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الفوائد" value={`${(totalBenefits / 1000).toFixed(0)}k`} description="ريال سعودي" accentColor="#bdeed3" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="متوسط العائد" value={`${averageROI.toFixed(1)}%`} description="ROI" accentColor="#d9d2fd" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="فترة الاسترداد" value="8.5" description="أشهر" accentColor="#fbe2aa" /></AppGridItem>
      </AppDashboardGrid>

      <BaseBox title="تفاصيل العائد على الاستثمار بالدورة">
        <div className="space-y-3">
          {roiData.map((roi) => (
            <div key={roi.courseId} className="p-4 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12]">دورة {roi.courseId}</h4>
                <BaseBadge variant={roi.roi > 150 ? 'success' : roi.roi > 100 ? 'info' : 'outline'} size="sm">{roi.roi}% عائد</BaseBadge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-arabic">
                <div><span className="text-[rgba(11,15,18,0.40)]">التكلفة:</span> <span className="font-bold">{roi.totalCost.toLocaleString()} ر.س</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">المشاركون:</span> <span className="font-bold">{roi.participantCount}</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">التأثير:</span> <span className="font-bold">{roi.businessImpact.toLocaleString()} ر.س</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">تحسن الأداء:</span> <span className="font-bold">{roi.performanceImprovement}%</span></div>
              </div>
            </div>
          ))}
        </div>
      </BaseBox>
    </div>
  );

  const SkillGapsSection = () => (
    <div className="space-y-5">
      <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">تحليل فجوات المهارات</span>

      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={4}><NumericStatCard title="فجوات حرجة" value={skillGaps.filter(g => g.severity === 'high').length} description="تحتاج معالجة" accentColor="#f1b5b9" /></AppGridItem>
        <AppGridItem colSpan={4}><NumericStatCard title="موظفون متأثرون" value={skillGaps.reduce((a, g) => a + g.affectedEmployees.length, 0)} description="موظف" accentColor="#fbe2aa" /></AppGridItem>
        <AppGridItem colSpan={4}><NumericStatCard title="قيد المعالجة" value={skillGaps.filter(g => g.status === 'addressing').length} description="فجوة" accentColor="#bdeed3" /></AppGridItem>
      </AppDashboardGrid>

      <BaseBox title="تفاصيل فجوات المهارات">
        <div className="space-y-3">
          {skillGaps.map((gap) => (
            <div key={gap.id} className="p-4 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12]">{gap.area}</h4>
                <div className="flex gap-1">
                  <BaseBadge variant={gap.severity === 'critical' ? 'error' : gap.severity === 'high' ? 'warning' : 'secondary'} size="sm">
                    {gap.severity === 'critical' ? 'حرجة' : gap.severity === 'high' ? 'عالية' : gap.severity === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </BaseBadge>
                  <BaseBadge variant={gap.status === 'open' ? 'error' : gap.status === 'addressing' ? 'success' : 'secondary'} size="sm">
                    {gap.status === 'open' ? 'مفتوح' : gap.status === 'addressing' ? 'قيد المعالجة' : 'محلول'}
                  </BaseBadge>
                </div>
              </div>
              <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-2">{gap.businessImpact}</p>
              <div className="grid grid-cols-3 gap-3 text-[10px] font-arabic">
                <div><span className="text-[rgba(11,15,18,0.40)]">متأثرون:</span> <span className="font-bold">{gap.affectedEmployees.length}</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">دورات مقترحة:</span> <span className="font-bold">{gap.recommendedCourses.length}</span></div>
                <div><span className="text-[rgba(11,15,18,0.40)]">التاريخ:</span> <span className="font-bold">{new Date(gap.createdAt).toLocaleDateString('ar-SA')}</span></div>
              </div>
            </div>
          ))}
        </div>
      </BaseBox>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">التحليلات والتقارير</span>
          <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">تحليل شامل لأداء التدريب وتقييم العائد على الاستثمار</p>
        </div>
        <div className="flex gap-2">
          <BaseActionButton variant="outline" size="sm">تصدير التقرير</BaseActionButton>
          <BaseActionButton variant="primary" size="sm">إعدادات التحليلات</BaseActionButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-[rgba(11,15,18,0.04)] p-1">
          <TabsTrigger value="overview" className="rounded-full text-[12px] font-arabic">نظرة عامة</TabsTrigger>
          <TabsTrigger value="roi" className="rounded-full text-[12px] font-arabic">العائد على الاستثمار</TabsTrigger>
          <TabsTrigger value="skillgaps" className="rounded-full text-[12px] font-arabic">فجوات المهارات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4"><OverviewSection /></TabsContent>
        <TabsContent value="roi" className="space-y-6 mt-4"><ROISection /></TabsContent>
        <TabsContent value="skillgaps" className="space-y-6 mt-4"><SkillGapsSection /></TabsContent>
      </Tabs>
    </div>
  );
};
