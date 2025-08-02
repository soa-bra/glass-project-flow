
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Bell, BarChart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UnifiedSystemStats } from '@/components/ui/UnifiedSystemStats';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemBadge } from '@/components/ui/UnifiedSystemBadge';
import { mockBudgetData, mockCashFlowData } from './data';
import { formatCurrency } from './utils';
import { Alert } from './types';
import { SPACING, LAYOUT } from '@/components/shared/design-system/constants';

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
      description: 'إجمالي الإيرادات لهذا الشهر',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'النفقات الشهرية',
      value: '1.8',
      unit: 'مليون ر.س',
      description: 'إجمالي النفقات لهذا الشهر',
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'الربح الصافي',
      value: '700',
      unit: 'ألف ر.س',
      description: 'الأرباح بعد خصم النفقات',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'التدفق النقدي',
      value: '+12%',
      unit: 'نمو',
      description: 'مقارنة بالشهر السابق',
      trend: { value: 12, isPositive: true }
    }
  ];

  const getBadgeVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral' => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, index) => (
          <UnifiedSystemStats
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={`${stat.unit} - ${stat.description}`}
            trend={stat.trend}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Budget vs Actual Chart */}
        <UnifiedSystemCard
          title="الميزانية مقابل الفعلي (شهري)"
          icon={<BarChart />}
        >
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
        </UnifiedSystemCard>

        {/* Cash Flow Forecast */}
        <UnifiedSystemCard
          title="توقعات التدفق النقدي"
          icon={<TrendingUp />}
        >
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
        </UnifiedSystemCard>
      </div>

      {/* AI Alerts */}
      <UnifiedSystemCard
        title="تنبيهات الذكاء الاصطناعي"
        icon={<Bell />}
      >
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between p-3 border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                 alert.type === 'info' ? <Clock className="w-5 h-5" /> :
                 <CheckCircle className="w-5 h-5" />}
                <span className="font-arabic">{alert.message}</span>
              </div>
              <UnifiedSystemBadge variant={getBadgeVariant(alert.priority)}>
                {alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
              </UnifiedSystemBadge>
            </div>
          ))}
        </div>
      </UnifiedSystemCard>
    </div>
  );
};
