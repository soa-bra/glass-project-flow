
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Eye, Download, Quote, Globe, Calendar,
  BarChart3, PieChart, LineChart, Brain, Target, Award
} from 'lucide-react';
import { mockContentAnalytics, mockKnowledgeDocuments } from './data/mockData';

export const AnalyticsImpactTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDocument, setSelectedDocument] = useState('all');
  
  const analytics = mockContentAnalytics[0];
  const documents = mockKnowledgeDocuments;

  const impactMetrics = {
    totalCitations: 234, hIndex: 12, avgCitationsPerDoc: 3.2,
    reachScore: 87, influenceScore: 92, collaborationIndex: 15
  };

  const contentSaturation = [
    { topic: 'علم اجتماع العلامة التجارية', saturation: 85, trend: 'up' },
    { topic: 'التسويق الرقمي الثقافي', saturation: 35, trend: 'up' },
    { topic: 'قياس الأثر الثقافي', saturation: 60, trend: 'stable' },
    { topic: 'المسؤولية الاجتماعية', saturation: 78, trend: 'down' }
  ];

  const topPerformingContent = [
    { title: 'دليل علم اجتماع العلامة التجارية', views: 1247, downloads: 456, citations: 23, engagement: 4.3 },
    { title: 'مقاييس الهوية الثقافية', views: 892, downloads: 234, citations: 15, engagement: 4.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">التحليلات والتأثير</h3>
        <div className="flex gap-2">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="week">أسبوع</option>
            <option value="month">شهر</option>
            <option value="quarter">ربع سنة</option>
            <option value="year">سنة</option>
          </select>
          <BaseActionButton variant="outline">تصدير التقرير</BaseActionButton>
        </div>
      </div>

      {/* Impact Metrics */}
      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={4}>
          <NumericStatCard title="إجمالي الاقتباسات" value={impactMetrics.totalCitations} size="sm" />
        </AppGridItem>
        <AppGridItem colSpan={4}>
          <NumericStatCard title="مؤشر H" value={impactMetrics.hIndex} size="sm" />
        </AppGridItem>
        <AppGridItem colSpan={4}>
          <NumericStatCard title="نقاط الوصول" value={impactMetrics.reachScore} size="sm" />
        </AppGridItem>
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={6}>
        {/* Content Performance */}
        <BaseBox>
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> أداء المحتوى
            </h3>
          </div>
          <div>
            <Tabs defaultValue="views" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="views">المشاهدات</TabsTrigger>
                <TabsTrigger value="downloads">التحميلات</TabsTrigger>
                <TabsTrigger value="citations">الاقتباسات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="views" className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center"><LineChart className="h-12 w-12 text-blue-600 mx-auto mb-2" /><div className="text-sm text-gray-600">رسم بياني للمشاهدات</div></div>
                </div>
                <AppDashboardGrid columns={12} density="compact" minRowHeight="auto">
                  <AppGridItem colSpan={6}><NumericStatCard title="إجمالي المشاهدات" value={analytics.views} size="sm" accentColor="#3DA8F5" /></AppGridItem>
                  <AppGridItem colSpan={6}><NumericStatCard title="نمو شهري" value="+15%" size="sm" accentColor="#3DBE8B" /></AppGridItem>
                </AppDashboardGrid>
              </TabsContent>
              
              <TabsContent value="downloads" className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center"><BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-2" /><div className="text-sm text-gray-600">رسم بياني للتحميلات</div></div>
                </div>
                <AppDashboardGrid columns={12} density="compact" minRowHeight="auto">
                  <AppGridItem colSpan={6}><NumericStatCard title="إجمالي التحميلات" value={analytics.downloads} size="sm" accentColor="#3DBE8B" /></AppGridItem>
                  <AppGridItem colSpan={6}><NumericStatCard title="معدل التحويل" value="23%" size="sm" accentColor="#3DA8F5" /></AppGridItem>
                </AppDashboardGrid>
              </TabsContent>
              
              <TabsContent value="citations" className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center"><PieChart className="h-12 w-12 text-purple-600 mx-auto mb-2" /><div className="text-sm text-gray-600">توزيع الاقتباسات</div></div>
                </div>
                <AppDashboardGrid columns={12} density="compact" minRowHeight="auto">
                  <AppGridItem colSpan={6}><NumericStatCard title="إجمالي الاقتباسات" value={analytics.citations} size="sm" accentColor="#9B59B6" /></AppGridItem>
                  <AppGridItem colSpan={6}><NumericStatCard title="متوسط لكل وثيقة" value="3.2" size="sm" accentColor="#F6C445" /></AppGridItem>
                </AppDashboardGrid>
              </TabsContent>
            </Tabs>
          </div>
        </BaseBox>
        </AppGridItem>

        <AppGridItem colSpan={6}>
        {/* Geographic Distribution */}
        <BaseBox>
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Globe className="h-5 w-5" /> التوزيع الجغرافي</h3>
          </div>
          <div>
            <div className="space-y-4">
              {analytics.geography.map((country, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{country.country}</span>
                    <span className="text-sm text-gray-600">{country.views} مشاهدة</span>
                  </div>
                  <Progress value={(country.views / analytics.views) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">{Math.round((country.views / analytics.views) * 100)}% من إجمالي المشاهدات</div>
                </div>
              ))}
            </div>
          </div>
        </BaseBox>
        </AppGridItem>
      </AppDashboardGrid>

      {/* Content Saturation Analysis */}
      <BaseBox>
        <div className="mb-4"><h3 className="text-lg font-semibold flex items-center gap-2"><Brain className="h-5 w-5" /> تحليل تشبع المحتوى</h3></div>
        <div>
          <div className="space-y-4">
            {contentSaturation.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.saturation}%</span>
                    <BaseBadge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'error' : 'secondary'}>
                      {item.trend === 'up' ? '↗️ صاعد' : item.trend === 'down' ? '↘️ هابط' : '→ مستقر'}
                    </BaseBadge>
                  </div>
                </div>
                <Progress value={item.saturation} className="h-3" />
                <div className="text-xs text-gray-500">{item.saturation < 50 ? 'يحتاج لمزيد من المحتوى' : item.saturation < 80 ? 'مستوى متوسط من المحتوى' : 'مستوى مرتفع من المحتوى'}</div>
              </div>
            ))}
          </div>
        </div>
      </BaseBox>

      {/* Top Performing Content */}
      <BaseBox>
        <div className="mb-4"><h3 className="text-lg font-semibold flex items-center gap-2">المحتوى الأكثر أداءً</h3></div>
        <div>
          <div className="space-y-4">
            {topPerformingContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{content.views}</span>
                    <span className="flex items-center gap-1"><Download className="h-4 w-4" />{content.downloads}</span>
                    <span className="flex items-center gap-1"><Quote className="h-4 w-4" />{content.citations}</span>
                  </div>
                </div>
                <NumericStatCard title="معدل التفاعل" value={content.engagement} size="sm" accentColor="#3DBE8B" className="w-32" />
              </div>
            ))}
          </div>
        </div>
      </BaseBox>

      {/* AI Recommendations */}
      <BaseBox>
        <div className="mb-4"><h3 className="text-lg font-semibold flex items-center gap-2"><Brain className="h-5 w-5" /> توصيات تحسين الأداء</h3></div>
        <div>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-blue-50"><h4 className="font-medium mb-1">زيادة المحتوى في التسويق الرقمي الثقافي</h4><p className="text-sm text-gray-600">مستوى التشبع منخفض (35%) مع زيادة الطلب على هذا المحتوى</p></div>
            <div className="p-3 border rounded-lg bg-green-50"><h4 className="font-medium mb-1">تحسين توزيع المحتوى</h4><p className="text-sm text-gray-600">يمكن زيادة الوصول بنسبة 25% من خلال تحسين استراتيجية التوزيع</p></div>
            <div className="p-3 border rounded-lg bg-yellow-50"><h4 className="font-medium mb-1">تطوير المحتوى التفاعلي</h4><p className="text-sm text-gray-600">المحتوى التفاعلي يحقق معدل تفاعل أعلى بـ 40% من المحتوى التقليدي</p></div>
          </div>
        </div>
      </BaseBox>
    </div>
  );
};
