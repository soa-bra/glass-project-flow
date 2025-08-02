import React, { useState } from 'react';
import { BarChart, Download, Calendar, Filter } from 'lucide-react';

const mockReports = [
  {
    id: 'RPT-001',
    title: 'تقرير العقود الشهري',
    description: 'تقرير شامل عن حالة العقود والاتفاقيات',
    type: 'monthly',
    category: 'contracts',
    lastGenerated: '2024-06-30',
    format: 'PDF',
    status: 'ready'
  },
  {
    id: 'RPT-002',
    title: 'تقرير الامتثال الربع سنوي',
    description: 'تحليل مستوى الامتثال للمتطلبات القانونية',
    type: 'quarterly',
    category: 'compliance',
    lastGenerated: '2024-06-30',
    format: 'Excel',
    status: 'ready'
  }
];

export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-large font-semibold text-black font-arabic mx-[30px]">التقارير القانونية</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium mx-[25px] flex items-center gap-2 hover:bg-black/90 transition-colors">
          <BarChart className="w-4 h-4" />
          إنشاء تقرير مخصص
        </button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">إحصائيات التقارير</h3>
        </div>
        <div className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <BarChart className="h-6 w-6 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">24</div>
              <div className="text-sm text-black font-arabic">التقارير المتاحة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <Calendar className="h-6 w-6 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">12</div>
              <div className="text-sm text-black font-arabic">تقارير هذا الشهر</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <Download className="h-6 w-6 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">156</div>
              <div className="text-sm text-black font-arabic">مرات التحميل</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <Filter className="h-6 w-6 text-black mx-auto mb-2" />
              <div className="text-2xl font-bold text-black">4</div>
              <div className="text-sm text-black font-arabic">تقارير مجدولة</div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة التقارير */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">التقارير المتاحة</h3>
        </div>
        <div className="px-0">
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-transparent border border-black/10 rounded-full flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-medium text-black font-arabic">{report.title}</h4>
                    <p className="text-sm text-black/70 font-arabic">{report.description}</p>
                    <div className="text-xs text-black/70 font-arabic mt-1">
                      آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-black/90 transition-colors font-arabic">
                  تحميل
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};