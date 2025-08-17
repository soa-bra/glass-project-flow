
import React, { useState, useEffect, useRef } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  Activity,
  Heart,
  MessageSquare,
  Download,
  RefreshCw
} from 'lucide-react';
import { mockCRMAnalytics, mockNPS } from './data';
import { SafeChart } from '@/components/ui/SafeChart';

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const isMountedRef = useRef(true);

  useEffect(() => {
    console.log('AnalyticsTab mounted');
    return () => {
      console.log('AnalyticsTab unmounting');
      isMountedRef.current = false;
    };
  }, []);

  // Enhanced mock data for analytics
  const customerGrowthData = [
    { month: 'يناير', new: 8, lost: 2, total: 142 },
    { month: 'فبراير', new: 12, lost: 1, total: 153 },
    { month: 'مارس', new: 9, lost: 3, total: 159 },
    { month: 'أبريل', new: 15, lost: 2, total: 172 },
    { month: 'مايو', new: 11, lost: 4, total: 179 },
    { month: 'يونيو', new: 13, lost: 1, total: 191 }
  ];

  const revenueBySegment = [
    { segment: 'عملاء الشركات الكبيرة', revenue: 4500000, customers: 15, color: '#1E40AF' },
    { segment: 'الشركات المتوسطة', revenue: 2800000, customers: 32, color: '#3B82F6' },
    { segment: 'الشركات الصغيرة', revenue: 1200000, customers: 89, color: '#60A5FA' },
    { segment: 'الشركات الناشئة', revenue: 450000, customers: 24, color: '#93C5FD' }
  ];

  const customerLifetimeValue = [
    { segment: 'مميز', clv: 850000, count: 12 },
    { segment: 'ذهبي', clv: 520000, count: 28 },
    { segment: 'فضي', clv: 280000, count: 67 },
    { segment: 'برونزي', clv: 120000, count: 89 }
  ];

  const salesPerformance = [
    { month: 'يناير', target: 1000000, actual: 950000, opportunities: 23 },
    { month: 'فبراير', target: 1100000, actual: 1180000, opportunities: 28 },
    { month: 'مارس', target: 1200000, actual: 1220000, opportunities: 31 },
    { month: 'أبريل', target: 1150000, actual: 1190000, opportunities: 27 },
    { month: 'مايو', target: 1300000, actual: 1250000, opportunities: 35 },
    { month: 'يونيو', target: 1400000, actual: 1450000, opportunities: 42 }
  ];

  const customerSatisfactionTrend = [
    { month: 'يناير', nps: 76, satisfaction: 4.2, complaints: 12 },
    { month: 'فبراير', nps: 78, satisfaction: 4.3, complaints: 8 },
    { month: 'مارس', nps: 74, satisfaction: 4.1, complaints: 15 },
    { month: 'أبريل', nps: 82, satisfaction: 4.5, complaints: 6 },
    { month: 'مايو', nps: 79, satisfaction: 4.4, complaints: 9 },
    { month: 'يونيو', nps: 81, satisfaction: 4.6, complaints: 5 }
  ];

  const churnAnalysis = [
    { reason: 'السعر', percentage: 35, count: 14 },
    { reason: 'جودة الخدمة', percentage: 28, count: 11 },
    { reason: 'عدم الاستخدام', percentage: 20, count: 8 },
    { reason: 'منافس أفضل', percentage: 12, count: 5 },
    { reason: 'أخرى', percentage: 5, count: 2 }
  ];

  const conversionFunnel = [
    { stage: 'زوار الموقع', count: 12500, rate: 100 },
    { stage: 'استفسارات', count: 1250, rate: 10 },
    { stage: 'عروض أسعار', count: 375, rate: 30 },
    { stage: 'مفاوضات', count: 188, rate: 50 },
    { stage: 'صفقات مغلقة', count: 94, rate: 50 }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="1month">الشهر الماضي</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="1year">السنة الماضية</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="revenue">الإيرادات</option>
            <option value="customers">العملاء</option>
            <option value="satisfaction">الرضا</option>
            <option value="conversion">التحويل</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-arabic">
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث البيانات
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-arabic">
            <Download className="ml-2 h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold font-arabic text-gray-900">{mockCRMAnalytics.totalCustomers}</h3>
          <p className="text-gray-600 font-arabic text-sm">إجمالي العملاء</p>
          <div className="mt-1 text-xs text-green-600 font-arabic">
            +{mockCRMAnalytics.newCustomersThisMonth} هذا الشهر
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold font-arabic text-gray-900">
            {(mockCRMAnalytics.monthlyRevenue / 1000000).toFixed(1)}م
          </h3>
          <p className="text-gray-600 font-arabic text-sm">الإيرادات الشهرية</p>
          <div className="mt-1 text-xs text-blue-600 font-arabic">
            +12% عن الماضي
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold font-arabic text-gray-900">{mockCRMAnalytics.conversionRate}%</h3>
          <p className="text-gray-600 font-arabic text-sm">معدل التحويل</p>
          <div className="mt-1 text-xs text-green-600 font-arabic">
            +3.2% عن الماضي
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold font-arabic text-gray-900">{mockNPS.score}</h3>
          <p className="text-gray-600 font-arabic text-sm">درجة NPS</p>
          <div className="mt-1 text-xs text-green-600 font-arabic">
            +5 نقاط
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold font-arabic text-gray-900">{mockCRMAnalytics.churnRate}%</h3>
          <p className="text-gray-600 font-arabic text-sm">معدل الفقدان</p>
          <div className="mt-1 text-xs text-red-600 font-arabic">
            -0.8% عن الماضي
          </div>
        </GenericCard>
      </div>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
            <TrendingUp className="ml-2 h-5 w-5" />
            نمو العملاء
          </h3>
          <SafeChart width="100%" height={300}>
            <AreaChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="font-arabic" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="total" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="إجمالي" />
              <Area type="monotone" dataKey="new" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="جديد" />
            </AreaChart>
          </SafeChart>
        </GenericCard>

        {/* Sales Performance */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
            <Target className="ml-2 h-5 w-5" />
            أداء المبيعات
          </h3>
          <SafeChart width="100%" height={300}>
            <BarChart data={salesPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="font-arabic" />
              <YAxis />
              <Tooltip formatter={(value) => [`${(value as number / 1000000).toFixed(1)}م ر.س`, '']} />
              <Bar dataKey="target" fill="#E5E7EB" name="المستهدف" />
              <Bar dataKey="actual" fill="#3B82F6" name="الفعلي" />
            </BarChart>
          </SafeChart>
        </GenericCard>
      </div>

      {/* Revenue and Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Segment */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
            <DollarSign className="ml-2 h-5 w-5" />
            الإيرادات حسب الشريحة
          </h3>
          <SafeChart width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBySegment}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="revenue"
                label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueBySegment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${(value as number / 1000000).toFixed(1)}م ر.س`, 'الإيرادات']} />
            </PieChart>
          </SafeChart>
        </GenericCard>

        {/* Customer Satisfaction Trend */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
            <Heart className="ml-2 h-5 w-5" />
            اتجاه رضا العملاء
          </h3>
          <SafeChart width="100%" height={300}>
            <LineChart data={customerSatisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="font-arabic" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[1, 5]} />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="nps" stroke="#10B981" strokeWidth={3} name="NPS" />
              <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#3B82F6" strokeWidth={3} name="الرضا" />
            </LineChart>
          </SafeChart>
        </GenericCard>
      </div>

      {/* Conversion Funnel and Churn Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
            <Activity className="ml-2 h-5 w-5" />
            مسار التحويل
          </h3>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-arabic text-sm font-semibold">{stage.stage}</span>
                    <span className="font-arabic text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                </div>
                <div className="mr-4 text-sm font-arabic text-gray-600">
                  {stage.rate}%
                </div>
              </div>
            ))}
          </div>
        </GenericCard>

        {/* Churn Analysis */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
            <Users className="ml-2 h-5 w-5" />
            تحليل أسباب فقدان العملاء
          </h3>
          <SafeChart width="100%" height={300}>
            <BarChart data={churnAnalysis} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="reason" type="category" className="font-arabic" />
              <Tooltip />
              <Bar dataKey="percentage" fill="#EF4444" />
            </BarChart>
          </SafeChart>
        </GenericCard>
      </div>

      {/* AI Insights and Recommendations */}
      <GenericCard>
        <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
          <MessageSquare className="ml-2 h-5 w-5" />
          رؤى الذكاء الاصطناعي والتوصيات
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h4 className="font-semibold font-arabic text-blue-800 mb-2">فرصة نمو</h4>
            <p className="text-blue-700 font-arabic text-sm">
              العملاء في الشريحة الفضية يظهرون استعداداً للترقية. يُنصح بحملة تسويقية مستهدفة لـ 67 عميل.
            </p>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 className="font-semibold font-arabic text-yellow-800 mb-2">تحذير مخاطر</h4>
            <p className="text-yellow-700 font-arabic text-sm">
              5 عملاء مميزين يظهرون علامات عدم رضا. يُنصح بالتدخل الفوري لتجنب الفقدان.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <h4 className="font-semibold font-arabic text-green-800 mb-2">أداء متميز</h4>
            <p className="text-green-700 font-arabic text-sm">
              تحسن معدل التحويل بنسبة 15% هذا الربع. استمر في استراتيجية التسويق الحالية.
            </p>
          </div>
        </div>
      </GenericCard>
    </div>
  );
};
