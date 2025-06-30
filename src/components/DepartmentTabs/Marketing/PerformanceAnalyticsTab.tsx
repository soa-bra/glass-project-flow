
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Target, DollarSign, MousePointer, Users, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export const PerformanceAnalyticsTab: React.FC = () => {
  const performanceMetrics = [
    { metric: 'تكلفة النقرة (CPC)', value: '2.5 ر.س', change: '+5%', trend: 'up' },
    { metric: 'تكلفة الاكتساب (CPA)', value: '85 ر.س', change: '-12%', trend: 'down' },
    { metric: 'معدل التحويل', value: '3.8%', change: '+8%', trend: 'up' },
    { metric: 'العائد على الإنفاق (ROAS)', value: '4.2x', change: '+15%', trend: 'up' }
  ];

  const channelPerformance = [
    { channel: 'وسائل التواصل الاجتماعي', impressions: '125,000', clicks: '4,250', conversions: '162', roas: '4.8x' },
    { channel: 'الإعلانات المدفوعة', impressions: '89,000', clicks: '2,670', conversions: '134', roas: '3.9x' },
    { channel: 'البريد الإلكتروني', impressions: '45,000', clicks: '1,800', conversions: '98', roas: '5.2x' },
    { channel: 'الفعاليات', impressions: '12,000', clicks: '480', conversions: '36', roas: '2.8x' }
  ];

  const attributionData = [
    { touchpoint: 'وسائل التواصل الاجتماعي', firstTouch: '35%', lastTouch: '28%', contribution: '31%' },
    { touchpoint: 'البحث المدفوع', firstTouch: '25%', lastTouch: '35%', contribution: '30%' },
    { touchpoint: 'البريد الإلكتروني', firstTouch: '20%', lastTouch: '22%', contribution: '21%' },
    { touchpoint: 'الإحالات', firstTouch: '20%', lastTouch: '15%', contribution: '18%' }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="dashboard" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="dashboard" className="rounded-md">لوحة الأداء</TabsTrigger>
          <TabsTrigger value="channels" className="rounded-md">تحليل القنوات</TabsTrigger>
          <TabsTrigger value="attribution" className="rounded-md">إسناد الإيراد</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Real-time Performance Metrics */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                مؤشرات الأداء اللحظية
              </h3>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {item.change}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{item.metric}</div>
                </div>
              ))}
            </div>
          </BaseCard>

          {/* Performance Charts */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">الاتجاهات الزمنية</h3>
          }>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">رسم بياني تفاعلي للأداء</p>
                <p className="text-sm">سيتم عرض الرسوم البيانية التفاعلية هنا</p>
              </div>
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          {/* Channel Analysis */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              تحليل أداء القنوات
            </h3>
          }>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">القناة</th>
                    <th className="text-right p-3">الظهور</th>
                    <th className="text-right p-3">النقرات</th>
                    <th className="text-right p-3">التحويلات</th>
                    <th className="text-right p-3">ROAS</th>
                    <th className="text-right p-3">الأداء</th>
                  </tr>
                </thead>
                <tbody>
                  {channelPerformance.map((channel, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{channel.channel}</td>
                      <td className="p-3">{channel.impressions}</td>
                      <td className="p-3">{channel.clicks}</td>
                      <td className="p-3">{channel.conversions}</td>
                      <td className="p-3 font-bold text-green-600">{channel.roas}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{
                              width: `${parseFloat(channel.roas) * 20}%`
                            }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{Math.round(parseFloat(channel.roas) * 20)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BaseCard>

          {/* Conversion Funnel */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">قمع التحويل</h3>
          }>
            <div className="space-y-4">
              {['الزوار', 'المهتمون', 'العملاء المحتملون', 'العملاء'].map((stage, index) => {
                const values = [10000, 3500, 1200, 480];
                const percentages = [100, 35, 12, 4.8];
                return (
                  <div key={stage} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{stage}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-6">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{width: `${percentages[index]}%`}}
                        >
                          {values[index].toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">{percentages[index]}%</div>
                  </div>
                );
              })}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          {/* Multi-Touch Attribution */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              نموذج الإسناد متعدد النقاط
            </h3>
          }>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">نقطة التفاعل</th>
                    <th className="text-right p-3">اللمسة الأولى</th>
                    <th className="text-right p-3">اللمسة الأخيرة</th>
                    <th className="text-right p-3">المساهمة الإجمالية</th>
                    <th className="text-right p-3">التوصية</th>
                  </tr>
                </thead>
                <tbody>
                  {attributionData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.touchpoint}</td>
                      <td className="p-3">{item.firstTouch}</td>
                      <td className="p-3">{item.lastTouch}</td>
                      <td className="p-3 font-bold">{item.contribution}</td>
                      <td className="p-3">
                        <Button size="sm" variant="outline">
                          <TrendingUp className="w-3 h-3 ml-1" />
                          تحسين
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BaseCard>

          {/* AI Insights */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">رؤى الذكاء الاصطناعي</h3>
          }>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🎯 توصية تحسين الميزانية</h4>
                <p className="text-sm text-blue-700">
                  بناءً على تحليل الإسناد، يُنصح بزيادة الاستثمار في البريد الإلكتروني بنسبة 25% وتقليل الإنفاق على الفعاليات بنسبة 15% لتحسين العائد الإجمالي.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">📈 فرصة نمو محددة</h4>
                <p className="text-sm text-green-700">
                  تم اكتشاف نمط إيجابي في التحويلات عندما يتفاعل العملاء مع وسائل التواصل الاجتماعي أولاً ثم البريد الإلكتروني. يُنصح بإنشاء حملات متكاملة.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ تنبيه الأداء</h4>
                <p className="text-sm text-yellow-700">
                  انخفاض في أداء الإعلانات المدفوعة خلال الأسبوع الماضي. يُنصح بمراجعة استهداف الجمهور وإعادة تحسين الكلمات المفتاحية.
                </p>
              </div>
            </div>
          </BaseCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
