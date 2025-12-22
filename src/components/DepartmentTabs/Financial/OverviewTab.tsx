
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Bell, BarChart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { BaseCard, BaseListItem } from '@/components/shared';
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

  const getBadgeVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  return (
    <div className={`space-y-6 ${SPACING.SECTION_MARGIN}`}>
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <div className={LAYOUT.TWO_COLUMN_GRID} style={{ gap: '1.5rem' }}>
        {/* Budget vs Actual Chart */}
        <BaseCard
          title="الميزانية مقابل الفعلي (شهري)"
          icon={<BarChart className={LAYOUT.ICON_SIZE} />}
          className="p-6"
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
        </BaseCard>

        {/* Cash Flow Forecast */}
        <BaseCard
          title="توقعات التدفق النقدي"
          icon={<TrendingUp className={LAYOUT.ICON_SIZE} />}
          className="p-6"
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
        </BaseCard>
      </div>

      {/* AI Alerts */}
      <BaseCard
        title="تنبيهات الذكاء الاصطناعي"
        icon={<Bell className={LAYOUT.ICON_SIZE} />}
        className="p-6"
      >
        <div className="space-y-3">
          {alerts.map(alert => (
            <BaseListItem
              key={alert.id}
              icon={
                alert.type === 'warning' ? <AlertTriangle className={LAYOUT.ICON_SIZE} /> :
                alert.type === 'info' ? <Clock className={LAYOUT.ICON_SIZE} /> :
                <CheckCircle className={LAYOUT.ICON_SIZE} />
              }
              badge={{
                text: alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض',
                variant: getBadgeVariant(alert.priority)
              }}
            >
              {alert.message}
            </BaseListItem>
          ))}
        </div>
      </BaseCard>
    </div>
  );
};
