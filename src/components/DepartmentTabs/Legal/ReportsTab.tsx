
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { BarChart, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';

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
  },
  {
    id: 'RPT-003',
    title: 'تقرير المخاطر القانونية',
    description: 'تقييم المخاطر والتهديدات القانونية',
    type: 'monthly',
    category: 'risks',
    lastGenerated: '2024-06-25',
    format: 'PDF',
    status: 'ready'
  },
  {
    id: 'RPT-004',
    title: 'تقرير التراخيص والتجديدات',
    description: 'حالة التراخيص والملكية الفكرية',
    type: 'monthly',
    category: 'licenses',
    lastGenerated: '2024-06-28',
    format: 'PDF',
    status: 'generating'
  }
];

export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredReports = mockReports.filter(report => {
    const matchesPeriod = selectedPeriod === 'all' || report.type === selectedPeriod;
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesPeriod && matchesCategory;
  });

  return (
    <div className="h-full overflow-auto">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="all">جميع الفترات</option>
            <option value="monthly">شهري</option>
            <option value="quarterly">ربع سنوي</option>
            <option value="yearly">سنوي</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">جميع الفئات</option>
            <option value="contracts">العقود</option>
            <option value="compliance">الامتثال</option>
            <option value="risks">المخاطر</option>
            <option value="licenses">التراخيص</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          إنشاء تقرير مخصص
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">24</div>
          <div className="text-sm text-gray-600">التقارير المتاحة</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-600">تقارير هذا الشهر</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Download className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">156</div>
          <div className="text-sm text-gray-600">مرات التحميل</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">4</div>
          <div className="text-sm text-gray-600">تقارير مجدولة</div>
        </BaseCard>
      </div>

      {/* Reports List */}
      <BaseCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">التقارير المتاحة</h3>
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar-SA')}</span>
                    <span>التنسيق: {report.format}</span>
                    <span>النوع: {report.type === 'monthly' ? 'شهري' : report.type === 'quarterly' ? 'ربع سنوي' : 'سنوي'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status === 'ready' ? 'جاهز' : 'قيد الإنشاء'}
                </span>
                {report.status === 'ready' && (
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    تحميل
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <BaseCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">توزيع العقود حسب الحالة</h3>
          <div className="flex items-center justify-center">
            <PieChart className="w-32 h-32 text-blue-600" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>موقعة: 45</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>في الانتظار: 12</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>منتهية: 8</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>قيد المراجعة: 5</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">اتجاهات الامتثال</h3>
          <div className="flex items-center justify-center">
            <TrendingUp className="w-32 h-32 text-green-600" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">معدل الامتثال الحالي</div>
            <div className="text-xs text-green-600 mt-1">↑ 5% من الشهر الماضي</div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};
