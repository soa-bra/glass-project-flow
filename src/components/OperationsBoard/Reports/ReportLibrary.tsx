import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
export const ReportLibrary: React.FC<ReportLibraryProps> = ({
  templates
}) => {
  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'PowerBI':
        return 'bg-yellow-100 text-yellow-800';
      case 'Excel':
        return 'bg-green-100 text-green-800';
      case 'Dashboard':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <Card className="rounded-[40px] bg-[#ffffff] border-[#DADCE0]">
      <CardHeader>
        <CardTitle className="text-right font-arabic flex items-center gap-2">
          <FileText className="w-5 h-5" />
          مكتبة التقارير
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input placeholder="ابحث في التقارير..." className="text-right rounded-[40px] bg-[#ffffff] border-[#DADCE0]" />
          </div>
          <Button variant="outline" size="icon" className="w-[37px] h-[37px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#000000]/50 bg-transparent">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-[37px] h-[37px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#000000]/50 bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {templates.map(template => <div key={template.id} className="bg-white/20 rounded-2xl p-4 hover:bg-white/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="text-right flex-1">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getFormatColor(template.format)}>
                    {template.format}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>)}
                {template.tags.length > 3 && <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>آخر تحديث: {template.lastUpdated}</span>
                <span>{template.downloadCount} تحميل</span>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
interface ReportStatistics {
  totalReports: number;
  monthlyDownloads: number;
  customReports: number;
  scheduledReports: number;
  popularCategories: {
    category: string;
    count: number;
  }[];
}
interface ReportStatsProps {
  statistics: ReportStatistics;
}
export const ReportStats: React.FC<ReportStatsProps> = ({
  statistics
}) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">إجمالي التقارير</p>
              <p className="text-2xl font-bold">{statistics.totalReports}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">التحميلات الشهرية</p>
              <p className="text-2xl font-bold">{statistics.monthlyDownloads}</p>
            </div>
            <Download className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">التقارير المخصصة</p>
              <p className="text-2xl font-bold">{statistics.customReports}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">التقارير المجدولة</p>
              <p className="text-2xl font-bold">{statistics.scheduledReports}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>;
};