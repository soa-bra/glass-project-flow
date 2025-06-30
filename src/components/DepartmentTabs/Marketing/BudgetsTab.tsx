
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DollarSign, AlertTriangle, TrendingUp, Target, Bell, Plus, Settings, BarChart3 } from 'lucide-react';

export const BudgetsTab: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const campaignBudgets = [
    {
      id: '1',
      name: 'حملة إطلاق المنتج الجديد',
      totalBudget: 15000,
      spent: 8500,
      remaining: 6500,
      dailyLimit: 500,
      status: 'نشطة',
      channel: 'وسائل التواصل الاجتماعي'
    },
    {
      id: '2',
      name: 'حملة العروض الصيفية',
      totalBudget: 8000,
      spent: 7200,
      remaining: 800,
      dailyLimit: 200,
      status: 'تحذير',
      channel: 'الإعلانات المدفوعة'
    },
    {
      id: '3',
      name: 'فعالية المعرض التجاري',
      totalBudget: 12000,
      spent: 11500,
      remaining: 500,
      dailyLimit: 0,
      status: 'مكتملة',
      channel: 'فعاليات'
    }
  ];

  const channelBudgets = [
    { channel: 'وسائل التواصل الاجتماعي', budget: 25000, spent: 18500, remaining: 6500, performance: 'ممتاز' },
    { channel: 'الإعلانات المدفوعة', budget: 35000, spent: 28200, remaining: 6800, performance: 'جيد' },
    { channel: 'البريد الإلكتروني', budget: 12000, spent: 8500, remaining: 3500, performance: 'ممتاز' },
    { channel: 'الفعاليات', budget: 18000, spent: 15800, remaining: 2200, performance: 'متوسط' }
  ];

  const budgetAlerts = [
    { type: 'تجاوز', message: 'حملة العروض الصيفية تجاوزت 90% من الميزانية', severity: 'high' },
    { type: 'تحذير', message: 'الإعلانات المدفوعة تحتاج مراجعة حدود الإنفاق اليومي', severity: 'medium' },
    { type: 'معلومات', message: 'ميزانية البريد الإلكتروني تحت الاستغلال الأمثل', severity: 'low' }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="campaigns" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="campaigns" className="rounded-md">ميزانية الحملات</TabsTrigger>
          <TabsTrigger value="channels" className="rounded-md">ميزانية القنوات</TabsTrigger>
          <TabsTrigger value="alerts" className="rounded-md">التنبيهات والتحكم</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Budget Overview */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                ميزانيات الحملات
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 ml-2" />
                إضافة ميزانية
              </Button>
            </div>
          }>
            <div className="space-y-4">
              {campaignBudgets.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.channel}</p>
                    </div>
                    <div className={`px-3 py-1 rounded text-sm font-medium ${
                      campaign.status === 'نشطة' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'تحذير' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{campaign.totalBudget.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">الميزانية الإجمالية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{campaign.spent.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">المصروف</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{campaign.remaining.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">المتبقي</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{campaign.dailyLimit}</div>
                      <div className="text-xs text-gray-600">الحد اليومي</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>التقدم</span>
                      <span>{Math.round((campaign.spent / campaign.totalBudget) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          (campaign.spent / campaign.totalBudget) > 0.9 ? 'bg-red-600' :
                          (campaign.spent / campaign.totalBudget) > 0.7 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{width: `${(campaign.spent / campaign.totalBudget) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-3 h-3 ml-1" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <BarChart3 className="w-3 h-3 ml-1" />
                      تقرير
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          {/* Channel Budget Distribution */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              توزيع ميزانية القنوات
            </h3>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channelBudgets.map((channel, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800">{channel.channel}</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      channel.performance === 'ممتاز' ? 'bg-green-100 text-green-800' :
                      channel.performance === 'جيد' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {channel.performance}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>الميزانية:</span>
                      <span className="font-medium">{channel.budget.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المصروف:</span>
                      <span className="font-medium">{channel.spent.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المتبقي:</span>
                      <span className="font-medium text-green-600">{channel.remaining.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{width: `${(channel.spent / channel.budget) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full">
                    <TrendingUp className="w-3 h-3 ml-1" />
                    تحليل ROI
                  </Button>
                </div>
              ))}
            </div>
          </BaseCard>

          {/* Budget Reallocation Suggestions */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">توصيات إعادة التوزيع</h3>
          }>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🎯 توصية الذكاء الاصطناعي</h4>
                <p className="text-sm text-blue-700 mb-3">
                  بناءً على الأداء الحالي، يُنصح بنقل 15% من ميزانية الفعاليات إلى البريد الإلكتروني لتحسين العائد الإجمالي بنسبة 23%.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">تطبيق التوصية</Button>
                  <Button size="sm" variant="outline">عرض التفاصيل</Button>
                </div>
              </div>
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Budget Alerts */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              تنبيهات الميزانية
            </h3>
          }>
            <div className="space-y-3">
              {budgetAlerts.map((alert, index) => (
                <div key={index} className={`p-4 border rounded-lg ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          alert.severity === 'high' ? 'text-red-800' :
                          alert.severity === 'medium' ? 'text-yellow-800' :
                          'text-blue-800'
                        }`}>
                          {alert.type}
                        </div>
                        <div className={`text-sm ${
                          alert.severity === 'high' ? 'text-red-700' :
                          alert.severity === 'medium' ? 'text-yellow-700' :
                          'text-blue-700'
                        }`}>
                          {alert.message}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">إجراء</Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>

          {/* Spending Controls */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">ضوابط الإنفاق</h3>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">الحدود اليومية</h4>
                {['وسائل التواصل الاجتماعي', 'الإعلانات المدفوعة', 'البريد الإلكتروني'].map((channel, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">{channel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">500 ر.س</span>
                      <Button size="sm" variant="outline">تعديل</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">تنبيهات التجاوز</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">تنبيه عند 75% من الميزانية</span>
                    <div className="w-8 h-4 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">تنبيه عند 90% من الميزانية</span>
                    <div className="w-8 h-4 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">إيقاف تلقائي عند 100%</span>
                    <div className="w-8 h-4 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
