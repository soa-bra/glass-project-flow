
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Bell, BarChart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseCard } from '@/components/ui/BaseCard';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { mockBudgetData, mockCashFlowData } from './data';
import { formatCurrency } from './utils';
import { Alert } from './types';

export const OverviewTab: React.FC = () => {
  const [alerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'warning',
      message: 'تجاوز ميزانية التسويق بنسبة 15%',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: 'موعد دفع الرواتب خلال 3 أيام',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      message: 'تم استلام دفعة من مشروع XYZ',
      priority: 'low'
    }
  ]);

  const kpiStats = [
    {
      title: 'الإيرادات الشهرية',
      value: '2.5',
      unit: 'مليون ر.س',
      description: 'إجمالي الإيرادات لهذا الشهر'
    },
    {
      title: 'النفقات الشهرية',
      value: '1.8',
      unit: 'مليون ر.س',
      description: 'إجمالي النفقات لهذا الشهر'
    },
    {
      title: 'الربح الصافي',
      value: '700',
      unit: 'ألف ر.س',
      description: 'الأرباح بعد خصم النفقات'
    },
    {
      title: 'التدفق النقدي',
      value: '+12%',
      unit: 'نمو',
      description: 'مقارنة بالشهر السابق'
    }
  ];

  const getAlertBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#f1b5b9] text-black';
      case 'medium': return 'bg-[#fbe2aa] text-black';
      case 'low': return 'bg-[#bdeed3] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
              <BarChart className="h-5 w-5 text-black" />
              الميزانية مقابل الفعلي (شهري)
            </h3>
          </div>
          <div className="px-0">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={mockBudgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.1} />
                <XAxis dataKey="month" stroke="#000000" tick={{ fill: '#000000', fontSize: 12 }} />
                <YAxis stroke="#000000" tick={{ fill: '#000000', fontSize: 12 }} />
                <Tooltip 
                  formatter={value => formatCurrency(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    color: '#000000'
                  }}
                  labelStyle={{ color: '#000000' }}
                />
                <Legend wrapperStyle={{ color: '#000000' }} />
                <Bar dataKey="budget" fill="#bdeed3" name="الميزانية" />
                <Bar dataKey="actual" fill="#a4e2f6" name="الفعلي" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Forecast */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-black" />
              توقعات التدفق النقدي
            </h3>
          </div>
          <div className="px-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.1} />
                <XAxis dataKey="month" stroke="#000000" tick={{ fill: '#000000', fontSize: 12 }} />
                <YAxis stroke="#000000" tick={{ fill: '#000000', fontSize: 12 }} />
                <Tooltip 
                  formatter={value => formatCurrency(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    color: '#000000'
                  }}
                  labelStyle={{ color: '#000000' }}
                />
                <Legend wrapperStyle={{ color: '#000000' }} />
                <Line type="monotone" dataKey="inflow" stroke="#d9d2fd" strokeWidth={3} name="التدفق الداخل" />
                <Line type="monotone" dataKey="outflow" stroke="#f1b5b9" strokeWidth={3} name="التدفق الخارج" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Alerts */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
            <Bell className="h-5 w-5 text-black" />
            تنبيهات الذكاء الاصطناعي
          </h3>
        </div>
        <div className="px-0">
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className="p-4 rounded-3xl bg-transparent border border-black/10"
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-black" />}
                  {alert.type === 'info' && <Clock className="h-5 w-5 text-black" />}
                  {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-black" />}
                  <span className="text-sm font-medium text-black font-arabic">{alert.message}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getAlertBadgeColor(alert.priority)}`}>
                    {alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
