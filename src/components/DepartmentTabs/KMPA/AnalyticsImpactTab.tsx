
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, Eye, Download, Quote, Globe, Calendar,
  BarChart3, PieChart, LineChart, Brain, Target, Award, FileDown
} from 'lucide-react';
import { mockContentAnalytics, mockKnowledgeDocuments } from './data/mockData';
import { downloadAsJSON } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const AnalyticsImpactTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analytics = mockContentAnalytics[0];

  const impactMetrics = {
    totalCitations: 234, hIndex: 12, avgCitationsPerDoc: 3.2,
    reachScore: 87, influenceScore: 92, collaborationIndex: 15
  };

  const contentSaturation = [
    { topic: 'علم اجتماع العلامة التجارية', saturation: 85, trend: 'up' as const },
    { topic: 'التسويق الرقمي الثقافي', saturation: 35, trend: 'up' as const },
    { topic: 'قياس الأثر الثقافي', saturation: 60, trend: 'stable' as const },
    { topic: 'المسؤولية الاجتماعية', saturation: 78, trend: 'down' as const }
  ];

  const topPerformingContent = [
    { title: 'دليل علم اجتماع العلامة التجارية', views: 1247, downloads: 456, citations: 23, engagement: 4.3 },
    { title: 'مقاييس الهوية الثقافية', views: 892, downloads: 234, citations: 15, engagement: 4.1 }
  ];

  const TREND_MAP: Record<string, { label: string; color: string }> = {
    up:     { label: '↗ صاعد',   color: '#3DBE8B' },
    down:   { label: '↘ هابط',   color: '#E5564D' },
    stable: { label: '→ مستقر', color: 'rgba(11,15,18,0.5)' },
  };

  const handleExportReport = () => {
    const report = {
      period: selectedPeriod,
      exportDate: new Date().toISOString(),
      impactMetrics,
      contentSaturation,
      topPerformingContent,
      analytics: { views: analytics.views, downloads: analytics.downloads, citations: analytics.citations, geography: analytics.geography },
    };
    downloadAsJSON(report, `تقرير-التحليلات-${selectedPeriod}`);
    toast.success('تم تصدير التقرير بنجاح');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-lg font-bold font-arabic">التحليلات والتأثير</h3>
        <div className="flex gap-2 items-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="الفترة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="quarter">ربع سنة</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>
          <BaseActionButton variant="outline" onClick={handleExportReport} className="flex items-center gap-1.5">
            <FileDown className="h-4 w-4" /> تصدير التقرير
          </BaseActionButton>
        </div>
      </div>

      {/* Impact KPIs */}
      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={4}><NumericStatCard title="إجمالي الاقتباسات" value={impactMetrics.totalCitations} accentColor="#8B5CF6" /></AppGridItem>
        <AppGridItem colSpan={4}><NumericStatCard title="مؤشر H" value={impactMetrics.hIndex} accentColor="#3DA8F5" /></AppGridItem>
        <AppGridItem colSpan={4}><NumericStatCard title="نقاط الوصول" value={impactMetrics.reachScore} unit="/100" accentColor="#3DBE8B" /></AppGridItem>
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={6}>
          {/* Content Performance */}
          <DataCardFrame title="أداء المحتوى">
            <Tabs defaultValue="views" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="views">المشاهدات</TabsTrigger>
                <TabsTrigger value="downloads">التحميلات</TabsTrigger>
                <TabsTrigger value="citations">الاقتباسات</TabsTrigger>
              </TabsList>

              <TabsContent value="views" className="space-y-4">
                <div className="h-48 bg-[rgba(11,15,18,0.02)] rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 text-[#3DA8F5] mx-auto mb-2 opacity-40" />
                    <div className="text-xs text-[rgba(11,15,18,0.4)] font-arabic">رسم بياني للمشاهدات</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumericStatCard title="إجمالي المشاهدات" value={analytics.views} size="sm" accentColor="#3DA8F5" />
                  <NumericStatCard title="نمو شهري" value="+15%" size="sm" accentColor="#3DBE8B" />
                </div>
              </TabsContent>

              <TabsContent value="downloads" className="space-y-4">
                <div className="h-48 bg-[rgba(11,15,18,0.02)] rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 text-[#3DBE8B] mx-auto mb-2 opacity-40" />
                    <div className="text-xs text-[rgba(11,15,18,0.4)] font-arabic">رسم بياني للتحميلات</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumericStatCard title="إجمالي التحميلات" value={analytics.downloads} size="sm" accentColor="#3DBE8B" />
                  <NumericStatCard title="معدل التحويل" value="23%" size="sm" accentColor="#3DA8F5" />
                </div>
              </TabsContent>

              <TabsContent value="citations" className="space-y-4">
                <div className="h-48 bg-[rgba(11,15,18,0.02)] rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 text-[#8B5CF6] mx-auto mb-2 opacity-40" />
                    <div className="text-xs text-[rgba(11,15,18,0.4)] font-arabic">توزيع الاقتباسات</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumericStatCard title="إجمالي الاقتباسات" value={analytics.citations} size="sm" accentColor="#8B5CF6" />
                  <NumericStatCard title="متوسط لكل وثيقة" value="3.2" size="sm" accentColor="#F6C445" />
                </div>
              </TabsContent>
            </Tabs>
          </DataCardFrame>
        </AppGridItem>

        <AppGridItem colSpan={6}>
          {/* Geographic Distribution */}
          <DataCardFrame title="التوزيع الجغرافي">
            <div className="space-y-4">
              {analytics.geography.map((country, index) => {
                const pct = Math.round((country.views / analytics.views) * 100);
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold font-arabic">{country.country}</span>
                      <span className="text-xs text-[rgba(11,15,18,0.5)] tabular-nums">{country.views} مشاهدة</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                    <div className="text-[10px] text-[rgba(11,15,18,0.4)]">{pct}% من إجمالي المشاهدات</div>
                  </div>
                );
              })}
            </div>
          </DataCardFrame>
        </AppGridItem>
      </AppDashboardGrid>

      {/* Content Saturation */}
      <DataCardFrame title="تحليل تشبع المحتوى">
        <div className="space-y-4">
          {contentSaturation.map((item, index) => {
            const trend = TREND_MAP[item.trend];
            return (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold font-arabic">{item.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[rgba(11,15,18,0.5)] tabular-nums">{item.saturation}%</span>
                    <span
                      className="px-2 py-0.5 text-[10px] rounded-full font-medium font-arabic"
                      style={{ backgroundColor: `${trend.color}18`, color: trend.color, border: `1px solid ${trend.color}30` }}
                    >
                      {trend.label}
                    </span>
                  </div>
                </div>
                <Progress value={item.saturation} className="h-2" />
                <div className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic">
                  {item.saturation < 50 ? 'يحتاج لمزيد من المحتوى' : item.saturation < 80 ? 'مستوى متوسط من المحتوى' : 'مستوى مرتفع من المحتوى'}
                </div>
              </div>
            );
          })}
        </div>
      </DataCardFrame>

      {/* Top Performing Content */}
      <DataCardFrame title="المحتوى الأكثر أداءً">
        <div className="space-y-3">
          {topPerformingContent.map((content, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-[#DADCE0]">
              <div className="flex-1">
                <h4 className="text-sm font-bold font-arabic mb-2">{content.title}</h4>
                <div className="flex items-center gap-4 text-xs text-[rgba(11,15,18,0.5)]">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{content.views}</span>
                  <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{content.downloads}</span>
                  <span className="flex items-center gap-1"><Quote className="h-3.5 w-3.5" />{content.citations}</span>
                </div>
              </div>
              <NumericStatCard title="التفاعل" value={content.engagement} size="sm" accentColor="#3DBE8B" className="w-28" />
            </div>
          ))}
        </div>
      </DataCardFrame>

      {/* AI Recommendations */}
      <DataCardFrame title="توصيات تحسين الأداء">
        <div className="space-y-2">
          {[
            { color: '#3DA8F5', title: 'زيادة المحتوى في التسويق الرقمي الثقافي', desc: 'مستوى التشبع منخفض (35%) مع زيادة الطلب على هذا المحتوى' },
            { color: '#3DBE8B', title: 'تحسين توزيع المحتوى', desc: 'يمكن زيادة الوصول بنسبة 25% من خلال تحسين استراتيجية التوزيع' },
            { color: '#F6C445', title: 'تطوير المحتوى التفاعلي', desc: 'المحتوى التفاعلي يحقق معدل تفاعل أعلى بـ 40% من المحتوى التقليدي' },
          ].map((rec, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#DADCE0]" style={{ borderRightWidth: 3, borderRightColor: rec.color }}>
              <h4 className="text-sm font-bold font-arabic mb-0.5">{rec.title}</h4>
              <p className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">{rec.desc}</p>
            </div>
          ))}
        </div>
      </DataCardFrame>
    </div>
  );
};
