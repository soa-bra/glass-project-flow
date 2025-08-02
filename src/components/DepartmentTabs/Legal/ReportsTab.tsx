import React, { useState } from 'react';
import { BarChart, Download, Calendar, Filter } from 'lucide-react';
const mockReports = [{
  id: 'RPT-001',
  title: 'تقرير العقود الشهري',
  description: 'تقرير شامل عن حالة العقود والاتفاقيات',
  type: 'monthly',
  category: 'contracts',
  lastGenerated: '2024-06-30',
  format: 'PDF',
  status: 'ready'
}, {
  id: 'RPT-002',
  title: 'تقرير الامتثال الربع سنوي',
  description: 'تحليل مستوى الامتثال للمتطلبات القانونية',
  type: 'quarterly',
  category: 'compliance',
  lastGenerated: '2024-06-30',
  format: 'Excel',
  status: 'ready'
}];
export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">التقارير القانونية</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
            <BarChart className="w-4 h-4" />
          </div>
          إنشاء تقرير مخصص
        </button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">إحصائيات التقارير</h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <BarChart className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">24</div>
              <div className="text-sm font-medium text-black font-arabic">التقارير المتاحة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">12</div>
              <div className="text-sm font-medium text-black font-arabic">تقارير هذا الشهر</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Download className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">156</div>
              <div className="text-sm font-medium text-black font-arabic">مرات التحميل</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Filter className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">4</div>
              <div className="text-sm font-medium text-black font-arabic">تقارير مجدولة</div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة التقارير */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-1">
          <h3 className="h-11 w-11 text-xl font-semibold text-black font-arabic">التقارير المتاحة</h3>
        </div>
        <div>
          <div className="space-y-4">
            {mockReports.map(report => <div key={report.id} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-transparent border border-black/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                      <BarChart className="w-4 h-4 text-black" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-black font-arabic">{report.title}</h4>
                    <p className="text-sm font-normal text-black font-arabic">{report.description}</p>
                    <div className="text-xs font-normal text-black font-arabic mt-1">
                      آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-colors font-arabic">
                  تحميل
                </button>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};