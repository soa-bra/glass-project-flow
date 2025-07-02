
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Bell, BarChart, TrendingUp, Download } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseCard } from '@/components/ui/BaseCard';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { mockBudgetData, mockCashFlowData } from './data';
import { formatCurrency } from './utils';
import { Alert } from './types';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

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

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black font-arabic">
              الميزانية مقابل الفعلي (شهري)
            </h3>
            <CircularIconButton 
              icon={Download}
              size="sm"
              className="w-8 h-8 bg-transparent border border-black/20 text-black"
            />
          </div>
          <div className="bg-transparent">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={mockBudgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  stroke="#000000"
                  className="text-sm font-medium font-arabic"
                />
                <YAxis 
                  stroke="#000000"
                  className="text-sm font-medium"
                />
                <Tooltip 
                  formatter={value => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#f2ffff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    color: '#000000'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#000000' }}
                />
                <Bar dataKey="budget" fill="#bdeed3" name="الميزانية" />
                <Bar dataKey="actual" fill="#a4e2f6" name="الفعلي" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Forecast */}
        <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black font-arabic">
              توقعات التدفق النقدي
            </h3>
            <CircularIconButton 
              icon={Download}
              size="sm"
              className="w-8 h-8 bg-transparent border border-black/20 text-black"
            />
          </div>
          <div className="bg-transparent">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  stroke="#000000"
                  className="text-sm font-medium font-arabic"
                />
                <YAxis 
                  stroke="#000000"
                  className="text-sm font-medium"
                />
                <Tooltip 
                  formatter={value => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#f2ffff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    color: '#000000'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#000000' }}
                />
                <Line type="monotone" dataKey="inflow" stroke="#bdeed3" strokeWidth={3} name="التدفق الداخل" />
                <Line type="monotone" dataKey="outflow" stroke="#f1b5b9" strokeWidth={3} name="التدفق الخارج" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Alerts */}
      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black font-arabic">
            تنبيهات الذكاء الاصطناعي
          </h3>
          <CircularIconButton 
            icon={Bell}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
        <div className="space-y-3 bg-transparent">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className="p-4 rounded-2xl border border-black/10 bg-transparent"
            >
              <div className="flex items-center gap-3">
                {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-black" />}
                {alert.type === 'info' && <Clock className="h-5 w-5 text-black" />}
                {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-black" />}
                <span className="text-sm font-medium text-black font-arabic">{alert.message}</span>
                <div className={`px-3 py-1 rounded-full text-xs font-normal text-black ${
                  alert.priority === 'high' ? 'bg-[#f1b5b9]' : 
                  alert.priority === 'medium' ? 'bg-[#fbe2aa]' : 
                  'bg-[#bdeed3]'
                }`}>
                  {alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
