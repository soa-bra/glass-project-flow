import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Brain, Target } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { AppDashboardGrid, AppGridItem } from '@/components/shared/layout';
import { mockKnowledgeMetrics, mockAIRecommendations, mockKnowledgeGaps } from './data/mockData';

export const OverviewTab: React.FC = () => {
  const metrics = mockKnowledgeMetrics;
  const kpiStats = [{
    title: 'إجمالي الوثائق',
    value: metrics.totalDocuments,
    unit: 'وثيقة',
    description: 'المحتوى المعرفي المتاح'
  }, {
    title: 'إجمالي القراءات',
    value: metrics.totalReads.toLocaleString(),
    unit: 'قراءة',
    description: 'مرات الوصول للمحتوى'
  }, {
    title: 'المستخدمون النشطون',
    value: metrics.activeUsers,
    unit: 'مستخدم',
    description: 'النشاط الشهري للمستخدمين'
  }, {
    title: 'النمو الشهري',
    value: `+${metrics.monthlyGrowth}`,
    unit: '%',
    description: 'معدل نمو استخدام المحتوى'
  }];
  const recommendations = mockAIRecommendations.slice(0, 3);
  const gaps = mockKnowledgeGaps.slice(0, 2);

  return (
    <div className="space-y-6 py-0 px-[20px] my-[46px]">
      <KPIStatsSection stats={kpiStats} />

      <AppDashboardGrid density="spacious">
        {/* Top Categories */}
        <AppGridItem colSpan={6}>
          <BaseBox className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الفئات الأكثر نشاطاً
              </h3>
            </div>
            <div className="space-y-4">
              {metrics.topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">{category.count} وثيقة</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="text-xs text-gray-500">{category.percentage}% من إجمالي المحتوى</div>
                </div>
              ))}
            </div>
          </BaseBox>
        </AppGridItem>

        {/* AI Recommendations */}
        <AppGridItem colSpan={6}>
          <BaseBox className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5" />
                توصيات الذكاء الاصطناعي
              </h3>
            </div>
            <div className="space-y-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <BaseBadge variant={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                      {rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                    </BaseBadge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">الثقة: {Math.round(rec.confidence * 100)}%</span>
                    <BaseBadge variant="outline" className="text-xs">
                      {rec.type === 'gap_analysis' ? 'تحليل الفجوات' : rec.type === 'content_suggestion' ? 'اقتراح محتوى' : 'موضوع بحث'}
                    </BaseBadge>
                  </div>
                </div>
              ))}
            </div>
          </BaseBox>
        </AppGridItem>
      </AppDashboardGrid>

      {/* Knowledge Gaps */}
      <BaseBox className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            فجوات المعرفة المكتشفة
          </h3>
        </div>
        <AppDashboardGrid density="default">
          {gaps.map(gap => (
            <AppGridItem key={gap.id} colSpan={6}>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{gap.topic}</h4>
                  <BaseBadge variant={gap.priority === 'high' ? 'error' : 'default'}>
                    {gap.priority === 'high' ? 'عالي' : 'متوسط'}
                  </BaseBadge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">استعلامات البحث المتكررة:</div>
                  <div className="flex flex-wrap gap-1">
                    {gap.searchQueries.map((query, index) => (
                      <BaseBadge key={index} variant="secondary" className="text-xs">{query}</BaseBadge>
                    ))}
                  </div>
                </div>
              </div>
            </AppGridItem>
          ))}
        </AppDashboardGrid>
      </BaseBox>

      {/* Recent Activity */}
      <BaseBox className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">النشاط الأخير</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 border rounded-2xl">
            <Download className="h-4 w-4 text-blue-600" />
            <span className="text-sm">تم تحميل "مقاييس سوبرا للهوية الثقافية" 15 مرة اليوم</span>
            <span className="text-xs text-gray-500 mr-auto">منذ ساعتين</span>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-2xl">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="text-sm">تم اكتشاف فجوة معرفية جديدة في "التسويق الرقمي الثقافي"</span>
            <span className="text-xs text-gray-500 mr-auto">منذ 4 ساعات</span>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-2xl">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm">تم نشر وثيقة جديدة: "دليل قياس الأثر الثقافي"</span>
            <span className="text-xs text-gray-500 mr-auto">أمس</span>
          </div>
        </div>
      </BaseBox>
    </div>
  );
};
