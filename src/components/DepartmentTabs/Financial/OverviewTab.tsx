
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

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <BaseCard variant="operations" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              الميزانية مقابل الفعلي (شهري)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={mockBudgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={value => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="الميزانية" />
                <Bar dataKey="actual" fill="#82ca9d" name="الفعلي" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </BaseCard>

        {/* Cash Flow Forecast */}
        <BaseCard variant="operations" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              توقعات التدفق النقدي
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={value => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="inflow" stroke="#8884d8" name="التدفق الداخل" />
                <Line type="monotone" dataKey="outflow" stroke="#82ca9d" name="التدفق الخارج" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </BaseCard>
      </div>

      {/* AI Alerts */}
      <BaseCard variant="operations" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            تنبيهات الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                  alert.type === 'info' ? 'bg-blue-50 border-blue-200' : 
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-600" />}
                  {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  <span className="font-medium">{alert.message}</span>
                  <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'secondary' : 'default'}>
                    {alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </BaseCard>
    </div>
  );
};
