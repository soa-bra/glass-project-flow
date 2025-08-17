
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { SafeChart } from '@/components/ui/SafeChart';
import { Users, TrendingUp, Heart, MessageSquare, Target, DollarSign, Clock, Award } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { mockCRMAnalytics, mockNPS } from './data';

export const OverviewTab: React.FC = () => {
  const funnelData = mockCRMAnalytics.salesFunnel;
  const npsData = mockNPS;
  
  const satisfactionColors = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];
  const satisfactionData = [
    { name: 'ممتاز', value: mockCRMAnalytics.customerSatisfaction.excellent, color: '#10B981' },
    { name: 'جيد', value: mockCRMAnalytics.customerSatisfaction.good, color: '#3B82F6' },
    { name: 'مقبول', value: mockCRMAnalytics.customerSatisfaction.fair, color: '#F59E0B' },
    { name: 'ضعيف', value: mockCRMAnalytics.customerSatisfaction.poor, color: '#EF4444' }
  ];

  const monthlyTrend = [
    { month: 'يناير', customers: 142, revenue: 1100000 },
    { month: 'فبراير', customers: 148, revenue: 1180000 },
    { month: 'مارس', customers: 151, revenue: 1220000 },
    { month: 'أبريل', customers: 154, revenue: 1190000 },
    { month: 'مايو', customers: 156, revenue: 1250000 },
    { month: 'يونيو', customers: 158, revenue: 1300000 }
  ];

  const kpiStats = [
    {
      title: 'إجمالي العملاء',
      value: mockCRMAnalytics.totalCustomers,
      unit: 'عميل',
      description: 'العملاء المسجلون حالياً'
    },
    {
      title: 'معدل التحويل',
      value: `${mockCRMAnalytics.conversionRate}%`,
      unit: 'تحويل',
      description: 'نسبة تحويل الفرص'
    },
    {
      title: 'درجة NPS',
      value: npsData.score,
      unit: 'نقطة',
      description: 'مؤشر رضا العملاء'
    },
    {
      title: 'الإيرادات الشهرية',
      value: `${(mockCRMAnalytics.monthlyRevenue / 1000000).toFixed(1)}`,
      unit: 'مليون ر.س',
      description: 'إجمالي الإيرادات'
    }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <GenericCard>
          <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
            <TrendingUp className="ml-2 h-5 w-5" />
            مسار المبيعات
          </h3>
          <SafeChart width="100%" height={300}>
            <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" className="font-arabic" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'count' ? 'العدد' : 'القيمة']} />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </SafeChart>
        </GenericCard>

        {/* Customer Satisfaction */}
        <GenericCard>
          <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
            <Award className="ml-2 h-5 w-5" />
            توزيع رضا العملاء
          </h3>
          <SafeChart width="100%" height={300}>
            <PieChart>
              <Pie
                data={satisfactionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {satisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </SafeChart>
        </GenericCard>
      </div>

      {/* Monthly Trends */}
      <GenericCard>
        <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
          <LineChart className="ml-2 h-5 w-5" />
          الاتجاهات الشهرية
        </h3>
        <SafeChart width="100%" height={300}>
          <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" className="font-arabic" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={3} name="العملاء" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="الإيرادات" />
          </LineChart>
        </SafeChart>
      </GenericCard>

      {/* AI Insights */}
      <GenericCard>
        <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
          <MessageSquare className="ml-2 h-5 w-5" />
          رؤى الذكاء الاصطناعي
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div className="mr-3">
                <h4 className="font-semibold font-arabic text-blue-800">توقع نمو المبيعات</h4>
                <p className="text-blue-700 font-arabic">
                  بناءً على الاتجاهات الحالية، متوقع زيادة الإيرادات بنسبة 15% في الربع القادم
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="mr-3">
                <h4 className="font-semibold font-arabic text-yellow-800">تحليل المشاعر</h4>
                <p className="text-yellow-700 font-arabic">
                  85% من التفاعلات الأخيرة إيجابية، مع تحسن ملحوظ في رضا العملاء عن الدعم التقني
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <Award className="h-5 w-5 text-green-400" />
              </div>
              <div className="mr-3">
                <h4 className="font-semibold font-arabic text-green-800">فرص الاحتفاظ</h4>
                <p className="text-green-700 font-arabic">
                  تم تحديد 3 عملاء معرضين لخطر المغادرة - يُنصح بالتواصل الاستباقي
                </p>
              </div>
            </div>
          </div>
        </div>
      </GenericCard>
    </div>
  );
};
