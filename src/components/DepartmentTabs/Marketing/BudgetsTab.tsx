
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { DollarSign, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const BudgetsTab: React.FC = () => {
  const budgetOverview = {
    totalBudget: 500000,
    spent: 342000,
    remaining: 158000,
    utilizationRate: 68.4
  };

  const channelBudgets = [
    {
      channel: 'الإعلانات الرقمية',
      allocated: 200000,
      spent: 156000,
      remaining: 44000,
      status: 'on-track'
    },
    {
      channel: 'وسائل التواصل الاجتماعي',
      allocated: 150000,
      spent: 128000,
      remaining: 22000,
      status: 'warning'
    },
    {
      channel: 'الفعاليات والمؤتمرات',
      allocated: 100000,
      spent: 45000,
      remaining: 55000,
      status: 'under-utilized'
    },
    {
      channel: 'العلاقات العامة',
      allocated: 50000,
      spent: 13000,
      remaining: 37000,
      status: 'under-utilized'
    }
  ];

  const budgetAlerts = [
    {
      type: 'warning',
      message: 'وسائل التواصل الاجتماعي تقترب من حد الميزانية (85%)',
      severity: 'medium'
    },
    {
      type: 'info',
      message: 'فائض في ميزانية الفعاليات يمكن إعادة توزيعه',
      severity: 'low'
    },
    {
      type: 'success',
      message: 'الإعلانات الرقمية ضمن الحدود المستهدفة',
      severity: 'low'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge variant="default" className="text-xs">ضمن الخطة</Badge>;
      case 'warning':
        return <Badge variant="destructive" className="text-xs">تحذير</Badge>;
      case 'under-utilized':
        return <Badge variant="secondary" className="text-xs">غير مستغل</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">غير معروف</Badge>;
    }
  };

  return (
    <div className="mb-6">
      {/* نظرة عامة على الميزانية */}
      <div className="mb-6">
        <BaseCard variant="operations">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-6 w-6 text-black" />
            <h3 className="text-xl font-bold text-black font-arabic">نظرة عامة على الميزانية</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#a4e2f6] rounded-lg">
              <h4 className="text-2xl font-bold text-black mb-1">
                {budgetOverview.totalBudget.toLocaleString()} ر.س
              </h4>
              <p className="text-sm text-black font-arabic">إجمالي الميزانية</p>
            </div>
            
            <div className="text-center p-4 bg-[#f1b5b9] rounded-lg">
              <h4 className="text-2xl font-bold text-black mb-1">
                {budgetOverview.spent.toLocaleString()} ر.س
              </h4>
              <p className="text-sm text-black font-arabic">المنفق</p>
            </div>
            
            <div className="text-center p-4 bg-[#bdeed3] rounded-lg">
              <h4 className="text-2xl font-bold text-black mb-1">
                {budgetOverview.remaining.toLocaleString()} ر.س
              </h4>
              <p className="text-sm text-black font-arabic">المتبقي</p>
            </div>
            
            <div className="text-center p-4 bg-[#d9d2fd] rounded-lg">
              <h4 className="text-2xl font-bold text-black mb-1">
                {budgetOverview.utilizationRate}%
              </h4>
              <p className="text-sm text-black font-arabic">معدل الاستخدام</p>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* ميزانيات القنوات */}
      <div className="mb-6">
        <BaseCard variant="operations">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-black" />
              <h3 className="text-xl font-bold text-black font-arabic">ميزانيات القنوات</h3>
            </div>
            <button className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-full transition-all font-arabic">
              إعادة توزيع الميزانية
            </button>
          </div>
          
          <div className="space-y-4">
            {channelBudgets.map((channel, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium font-arabic text-black">{channel.channel}</h4>
                    {getStatusBadge(channel.status)}
                  </div>
                  <div className="text-sm text-black">
                    {((channel.spent / channel.allocated) * 100).toFixed(1)}% مستخدم
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-black font-arabic">المخصص: </span>
                    <span className="font-bold text-black">{channel.allocated.toLocaleString()} ر.س</span>
                  </div>
                  <div>
                    <span className="text-black font-arabic">المنفق: </span>
                    <span className="font-bold text-black">{channel.spent.toLocaleString()} ر.س</span>
                  </div>
                  <div>
                    <span className="text-black font-arabic">المتبقي: </span>
                    <span className="font-bold text-black">{channel.remaining.toLocaleString()} ر.س</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${(channel.spent / channel.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>

      {/* تنبيهات الميزانية */}
      <div className="mb-6">
        <BaseCard variant="operations">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-black" />
            <h3 className="text-xl font-bold text-black font-arabic">تنبيهات الميزانية</h3>
          </div>
          
          <div className="space-y-3">
            {budgetAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'medium' ? 'bg-[#fbe2aa] border-[#fbe2aa]' :
                alert.severity === 'low' ? 'bg-[#a4e2f6] border-[#a4e2f6]' :
                'bg-[#bdeed3] border-[#bdeed3]'
              }`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-arabic text-black">{alert.message}</p>
                  <Badge 
                    variant={
                      alert.severity === 'medium' ? 'destructive' :
                      alert.severity === 'low' ? 'secondary' : 'default'
                    }
                    className="text-xs"
                  >
                    {alert.type === 'warning' ? 'تحذير' : 
                     alert.type === 'info' ? 'معلومة' : 'نجح'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>
    </div>
  );
};
