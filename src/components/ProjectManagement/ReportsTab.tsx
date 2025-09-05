import React from 'react';
import { Download, Eye, FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ReportsTabProps {
  project: any;
}
export const ReportsTab: React.FC<ReportsTabProps> = ({
  project
}) => {
  const mockReports = [{
    id: '1',
    name: 'تقرير سير المشروع الشهري',
    type: 'progress',
    generatedDate: '2024-01-25',
    size: '2.1 MB',
    format: 'PDF',
    status: 'ready'
  }, {
    id: '2',
    name: 'تحليل الأداء المالي',
    type: 'financial',
    generatedDate: '2024-01-24',
    size: '1.8 MB',
    format: 'Excel',
    status: 'ready'
  }, {
    id: '3',
    name: 'تقرير كفاءة الفريق',
    type: 'team',
    generatedDate: '2024-01-23',
    size: '1.5 MB',
    format: 'PDF',
    status: 'ready'
  }, {
    id: '4',
    name: 'تقييم رضا العميل',
    type: 'client',
    generatedDate: '2024-01-22',
    size: '1.2 MB',
    format: 'PDF',
    status: 'ready'
  }];
  const reportStats = {
    totalReports: 15,
    thisMonth: 4,
    avgGenTime: '2.3',
    exportCount: 28
  };
  return <div className="space-y-6">
      {/* حالة التقارير */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">مركز التقارير</h3>
          <div className="bg-[#bdeed3] px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-black">محدث</span>
          </div>
        </div>
        <p className="text-sm font-medium text-black">جميع التقارير محدثة وجاهزة للتصدير - آخر تحديث منذ ساعة واحدة</p>
      </div>

      {/* إحصائيات التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي التقارير</h4>
          <p className="text-2xl font-bold text-black mb-1">{reportStats.totalReports}</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">تقرير متاح</span>
          </div>
        </div>
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">هذا الشهر</h4>
          <p className="text-2xl font-bold text-black mb-1">{reportStats.thisMonth}</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">تقارير جديدة</span>
          </div>
        </div>
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">متوسط التوليد</h4>
          <p className="text-2xl font-bold text-black mb-1">{reportStats.avgGenTime} دقيقة</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">زمن سريع</span>
          </div>
        </div>
        <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6 text-center">
          <h4 className="text-lg font-semibold text-black mb-2">مرات التصدير</h4>
          <p className="text-2xl font-bold text-black mb-1">{reportStats.exportCount}</p>
          <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">هذا الشهر</span>
          </div>
        </div>
      </div>

      {/* فئات التقارير */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
        <h3 className="text-lg font-semibold text-black mb-6">أنواع التقارير المتاحة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <BarChart3 className="w-5 h-5  mx-auto mb-2 text-black" />
            <h4 className="text-sm font-bold text-black mb-2">تقارير التقدم</h4>
            <div className="bg-[#f1b5b9] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">5 تقارير</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <PieChart className="w-5 h-5  mx-auto mb-2 text-black" />
            <h4 className="text-sm font-bold text-black mb-2">التقارير المالية</h4>
            <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">4 تقارير</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-black" />
            <h4 className="text-sm font-bold text-black mb-2">تقارير الفريق</h4>
            <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">3 تقارير</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <FileText className="w-5 h-5 mx-auto mb-2 text-black" />
            <h4 className="text-sm font-bold text-black mb-2">تقارير العملاء</h4>
            <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">3 تقارير</span>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة التقارير المتاحة */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">التقارير المتاحة للتصدير</h3>
          <Button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors">
            إنشاء تقرير جديد
          </Button>
        </div>
        <div className="space-y-3">
          {mockReports.map(report => <div key={report.id} className="bg-transparent border border-black/10 rounded-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-full">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{report.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">تاريخ الإنشاء: {report.generatedDate}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-600">الحجم: {report.size}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-600">النوع: {report.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="p-2">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="p-2">
                  <Download className="w-4 h-4" />
                </Button>
                <div className="bg-[#bdeed3] px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-black">جاهز</span>
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {/* إعدادات التقارير الآلية */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
        <h3 className="text-lg font-semibold text-black mb-6">الإعدادات والتقارير الآلية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-black">التقارير الدورية المجدولة</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-transparent border border-black/10 rounded-xl">
                <span className="text-sm font-medium text-black">تقرير التقدم الأسبوعي</span>
                <div className="bg-[#bdeed3] px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-black">مفعل</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-transparent border border-black/10 rounded-xl">
                <span className="text-sm font-medium text-black">التقرير المالي الشهري</span>
                <div className="bg-[#a4e2f6] px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-black">مفعل</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-transparent border border-black/10 rounded-xl">
                <span className="text-sm font-medium text-black">تقييم الفريق الشهري</span>
                <div className="bg-[#f1b5b9] px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-black">معطل</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-black">خيارات التصدير السريع</h4>
            <div className="space-y-2">
              <Button className="w-full bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                تصدير تقرير التقدم الحالي
              </Button>
              <Button className="w-full bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                تصدير البيانات المالية
              </Button>
              <Button className="w-full bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                تصدير تقرير الفريق
              </Button>
              <Button className="w-full bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors">
                تصدير تقرير شامل
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};