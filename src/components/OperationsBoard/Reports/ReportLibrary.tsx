import React from 'react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Search, Filter } from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  format: 'PDF' | 'PowerBI' | 'Excel' | 'Dashboard';
  lastUpdated: string;
  downloadCount: number;
  tags: string[];
}
interface ReportLibraryProps {
  templates: ReportTemplate[];
}

export const ReportLibrary: React.FC<ReportLibraryProps> = ({ templates }) => {
  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'PowerBI': return 'bg-yellow-100 text-yellow-800';
      case 'Excel': return 'bg-green-100 text-green-800';
      case 'Dashboard': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppCardSurface density="standard">
      <h3 className="text-right font-arabic flex items-center gap-2 text-lg font-semibold mb-4">
        <FileText className="w-5 h-5" />
        مكتبة التقارير
      </h3>
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <Input placeholder="ابحث في التقارير..." className="text-right" />
        </div>
        <Button variant="outline" size="icon" className="w-[37px] h-[37px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#000000]/50 bg-transparent">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="w-[37px] h-[37px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#000000]/50 bg-transparent">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {templates.map(template => (
          <div key={template.id} className="bg-gray-50 border border-[#DADCE0] rounded-2xl p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="text-right flex-1">
                <h4 className="font-medium text-sm">{template.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <BaseBadge variant="secondary" className={getFormatColor(template.format)}>{template.format}</BaseBadge>
                <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {template.tags.slice(0, 3).map((tag, idx) => (
                <BaseBadge key={idx} variant="outline" className="text-xs">{tag}</BaseBadge>
              ))}
              {template.tags.length > 3 && <BaseBadge variant="outline" className="text-xs">+{template.tags.length - 3}</BaseBadge>}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>آخر تحديث: {template.lastUpdated}</span>
              <span>{template.downloadCount} تحميل</span>
            </div>
          </div>
        ))}
      </div>
    </AppCardSurface>
  );
};

import { NumericStatCard } from '@/components/shared/visual-data';

interface ReportStatistics {
  totalReports: number;
  monthlyDownloads: number;
  customReports: number;
  scheduledReports: number;
  popularCategories: { category: string; count: number; }[];
}
interface ReportStatsProps {
  statistics: ReportStatistics;
}

export const ReportStats: React.FC<ReportStatsProps> = ({ statistics }) => {
  return (
    <AppDashboardGrid columns={12} density="default">
      <AppGridItem colSpan={3}>
        <NumericStatCard title="إجمالي التقارير" value={statistics.totalReports} unit="تقرير" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <NumericStatCard title="التحميلات الشهرية" value={statistics.monthlyDownloads} accentColor="#3DBE8B" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <NumericStatCard title="التقارير المخصصة" value={statistics.customReports} accentColor="#3DA8F5" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={3}>
        <NumericStatCard title="التقارير المجدولة" value={statistics.scheduledReports} size="sm" />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
