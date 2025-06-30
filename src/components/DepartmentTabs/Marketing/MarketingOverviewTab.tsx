
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, DollarSign, MousePointer, Eye, Users, Activity, BarChart3 } from 'lucide-react';

export const MarketingOverviewTab: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <TrendingUp className="w-8 h-8 mx-auto text-green-600" />
            <div className="text-2xl font-bold text-gray-800">4.2x</div>
            <div className="text-sm text-gray-600">العائد على الإنفاق الإعلاني (ROAS)</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <Target className="w-8 h-8 mx-auto text-blue-600" />
            <div className="text-2xl font-bold text-gray-800">85 ر.س</div>
            <div className="text-sm text-gray-600">تكلفة اكتساب العميل (CPA)</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <MousePointer className="w-8 h-8 mx-auto text-purple-600" />
            <div className="text-2xl font-bold text-gray-800">3.4%</div>
            <div className="text-sm text-gray-600">معدل النقر إلى الظهور (CTR)</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <DollarSign className="w-8 h-8 mx-auto text-orange-600" />
            <div className="text-2xl font-bold text-gray-800">2.5 ر.س</div>
            <div className="text-sm text-gray-600">تكلفة النقرة (CPC)</div>
          </div>
        </BaseCard>
      </div>

      {/* Performance Overview & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard size="lg" header={
          <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            أداء الحملات النشطة
          </h3>
        }>
          <div className="space-y-4">
            {[
              { name: 'حملة إطلاق المنتج الجديد', channel: 'وسائل التواصل الاجتماعي', budget: '15,000', spent: '8,500', performance: 'ممتاز' },
              { name: 'حملة العروض الصيفية', channel: 'البريد الإلكتروني', budget: '8,000', spent: '6,200', performance: 'جيد' },
              { name: 'حملة الفعاليات الميدانية', channel: 'فعاليات', budget: '12,000', spent: '4,500', performance: 'متوسط' }
            ].map((campaign, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">{campaign.name}</div>
                    <div className="text-sm text-gray-600">{campaign.channel}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    campaign.performance === 'ممتاز' ? 'bg-green-100 text-green-800' :
                    campaign.performance === 'جيد' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.performance}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الميزانية: {campaign.budget} ر.س</span>
                  <span>المصروف: {campaign.spent} ر.س</span>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        <BaseCard size="lg" header={
          <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            إحصائيات القنوات
          </h3>
        }>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">وسائل التواصل الاجتماعي</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="font-bold text-blue-600">65%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">البريد الإلكتروني</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="font-bold text-green-600">45%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الإعلانات المدفوعة</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
                <span className="font-bold text-purple-600">35%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الفعاليات</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                <span className="font-bold text-orange-600">25%</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Quick Actions */}
      <BaseCard size="lg" header={
        <h3 className="text-lg font-arabic font-bold text-gray-800">الإجراءات السريعة</h3>
      }>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex-col gap-2">
            <Target className="w-5 h-5" />
            <span className="text-sm">حملة جديدة</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex-col gap-2">
            <Eye className="w-5 h-5" />
            <span className="text-sm">تحليل الأداء</span>
          </Button>
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white flex-col gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">إدارة الجمهور</span>
          </Button>
          <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white flex-col gap-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">إدارة الميزانية</span>
          </Button>
        </div>
      </BaseCard>
    </div>
  );
};
