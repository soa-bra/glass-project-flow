
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, Scale, Shield, Clock, TrendingUp } from 'lucide-react';

export const LegalOverviewTab: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <FileText className="w-8 h-8 mx-auto text-blue-600" />
            <div className="text-2xl font-bold text-gray-800">127</div>
            <div className="text-sm text-gray-600">العقود النشطة</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto text-red-600" />
            <div className="text-2xl font-bold text-gray-800">3</div>
            <div className="text-sm text-gray-600">قضايا عالية المخاطر</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <Scale className="w-8 h-8 mx-auto text-green-600" />
            <div className="text-2xl font-bold text-gray-800">95%</div>
            <div className="text-sm text-gray-600">نسبة الامتثال</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <Shield className="w-8 h-8 mx-auto text-purple-600" />
            <div className="text-2xl font-bold text-gray-800">42</div>
            <div className="text-sm text-gray-600">التراخيص الفعالة</div>
          </div>
        </BaseCard>
      </div>

      {/* Recent Activities & Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard size="lg" header={
          <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            المهام العاجلة
          </h3>
        }>
          <div className="space-y-3">
            {[
              { task: 'مراجعة عقد شراكة مع شركة ABC', deadline: '3 أيام', priority: 'عالية' },
              { task: 'تجديد ترخيص النشاط التجاري', deadline: '7 أيام', priority: 'متوسطة' },
              { task: 'إعداد مذكرة قانونية للمشروع الجديد', deadline: '10 أيام', priority: 'عادية' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.task}</div>
                  <div className="text-sm text-gray-600">باقي {item.deadline}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  item.priority === 'عالية' ? 'bg-red-100 text-red-800' :
                  item.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        <BaseCard size="lg" header={
          <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            الإحصائيات الشهرية
          </h3>
        }>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">العقود المبرمة هذا الشهر</span>
              <span className="font-bold text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">القضايا المحلولة</span>
              <span className="font-bold text-green-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">التراخيص المجددة</span>
              <span className="font-bold text-purple-600">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الاستشارات المقدمة</span>
              <span className="font-bold text-orange-600">23</span>
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
            <FileText className="w-5 h-5" />
            <span className="text-sm">عقد جديد</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex-col gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">طلب ترخيص</span>
          </Button>
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white flex-col gap-2">
            <Scale className="w-5 h-5" />
            <span className="text-sm">قضية جديدة</span>
          </Button>
          <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white flex-col gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">تقرير مخاطر</span>
          </Button>
        </div>
      </BaseCard>
    </div>
  );
};
