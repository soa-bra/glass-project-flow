import React, { useState } from 'react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { FileSpreadsheet } from 'lucide-react';

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
export const ReportStats: React.FC<ReportStatsProps> = () => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};

export const CustomReportWizard: React.FC = () => {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');

  return (
    <AppCardSurface density="standard">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-5 h-5" />
        <h3 className="text-lg font-semibold text-right font-arabic">إنشاء تقرير مخصص</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اسم التقرير</label>
          <Input value={reportName} onChange={e => setReportName(e.target.value)} placeholder="أدخل اسم التقرير" className="text-right" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">نوع التقرير</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">تقرير مالي</SelectItem>
              <SelectItem value="performance">تقرير أداء</SelectItem>
              <SelectItem value="project">تقرير مشاريع</SelectItem>
              <SelectItem value="hr">تقرير موارد بشرية</SelectItem>
              <SelectItem value="marketing">تقرير تسويقي</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الوصف</label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف موجز للتقرير" rows={3} className="text-right" />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 rounded-full text-base bg-black">إنشاء التقرير</Button>
          <Button variant="outline" className="rounded-full">معاينة</Button>
        </div>
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-2 text-right">الفئات الشائعة:</h4>
          <div className="flex flex-wrap gap-2">
            {['تقارير الأداء', 'تقارير العلامة التجارية', 'دراسات السوق'].map(category => (
              <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-secondary/80">{category}</Badge>
            ))}
          </div>
        </div>
      </div>
    </AppCardSurface>
  );
};
