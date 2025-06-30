
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Target, Mail, Users, MapPin, Megaphone, Plus, Play, Pause, Settings } from 'lucide-react';

export const CampaignsChannelsTab: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const campaigns = [
    {
      id: '1',
      name: 'حملة إطلاق المنتج الجديد',
      type: 'إعلانات مدفوعة',
      status: 'نشطة',
      budget: 15000,
      spent: 8500,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      performance: 'ممتاز'
    },
    {
      id: '2',
      name: 'حملة العروض الصيفية',
      type: 'بريد إلكتروني',
      status: 'مجدولة',
      budget: 8000,
      spent: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      performance: 'جديد'
    },
    {
      id: '3',
      name: 'فعالية المعرض التجاري',
      type: 'فعاليات',
      status: 'مكتملة',
      budget: 12000,
      spent: 11500,
      startDate: '2023-12-01',
      endDate: '2023-12-03',
      performance: 'جيد'
    }
  ];

  const channels = [
    { name: 'وسائل التواصل الاجتماعي', icon: Users, campaigns: 5, budget: 25000, performance: 'ممتاز' },
    { name: 'البريد الإلكتروني', icon: Mail, campaigns: 3, budget: 12000, performance: 'جيد' },
    { name: 'الإعلانات المدفوعة', icon: Target, campaigns: 4, budget: 35000, performance: 'ممتاز' },
    { name: 'الفعاليات الميدانية', icon: MapPin, campaigns: 2, budget: 18000, performance: 'متوسط' },
    { name: 'المطبوعات والإعلام', icon: Megaphone, campaigns: 3, budget: 15000, performance: 'جيد' }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="campaigns" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="campaigns" className="rounded-md">إدارة الحملات</TabsTrigger>
          <TabsTrigger value="channels" className="rounded-md">القنوات التسويقية</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Calendar & Controls */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                تقويم الحملات
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 ml-2" />
                حملة جديدة
              </Button>
            </div>
          }>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedCampaign(campaign.id)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.type}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.status === 'نشطة' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'مجدولة' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>الميزانية:</span>
                      <span className="font-medium">{campaign.budget.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المصروف:</span>
                      <span className="font-medium">{campaign.spent.toLocaleString()} ر.س</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" 
                           style={{width: `${(campaign.spent / campaign.budget) * 100}%`}}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-500">
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'نشطة' ? (
                        <Button size="sm" variant="outline"><Pause className="w-3 h-3" /></Button>
                      ) : (
                        <Button size="sm" variant="outline"><Play className="w-3 h-3" /></Button>
                      )}
                      <Button size="sm" variant="outline"><Settings className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>

          {/* Campaign Workflow */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">سير عمل الحملة</h3>
          }>
            <div className="flex justify-between items-center">
              {['الفكرة', 'التخطيط', 'الإنتاج', 'المراجعة', 'الاعتماد', 'الإطلاق', 'التقييم'].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index <= 3 ? 'bg-green-600 text-white' : 
                    index === 4 ? 'bg-blue-600 text-white' : 
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center">{step}</span>
                  {index < 6 && <div className="w-8 h-0.5 bg-gray-300 mt-2"></div>}
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => {
              const IconComponent = channel.icon;
              return (
                <BaseCard key={channel.name} size="md">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">{channel.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>الحملات النشطة:</span>
                          <span className="font-medium">{channel.campaigns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الميزانية الإجمالية:</span>
                          <span className="font-medium">{channel.budget.toLocaleString()} ر.س</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          channel.performance === 'ممتاز' ? 'bg-green-100 text-green-800' :
                          channel.performance === 'جيد' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          الأداء: {channel.performance}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">إدارة القناة</Button>
                  </div>
                </BaseCard>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
