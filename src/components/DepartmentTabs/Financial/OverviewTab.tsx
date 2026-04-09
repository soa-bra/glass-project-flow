import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { BaseListItem } from '@/components/shared';
import { mockBudgetData, mockCashFlowData } from './data';
import { formatCurrency } from './utils';
import { Alert } from './types';
import { SPACING } from '@/components/shared/design-system/constants';

const tooltipStyle = {
  backgroundColor: '#0B0F12',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontSize: 13,
  padding: '8px 12px',
};

export const OverviewTab: React.FC = () => {
  const [alerts] = useState<Alert[]>([
    { id: 1, type: 'warning', message: 'تجاوز ميزانية التسويق بنسبة 15%', priority: 'high' },
    { id: 2, type: 'info', message: 'موعد دفع الرواتب خلال 3 أيام', priority: 'medium' },
    { id: 3, type: 'success', message: 'تم استلام دفعة من مشروع XYZ', priority: 'low' },
  ]);

  const kpiStats = [
    { title: 'الإيرادات الشهرية', value: '2.5', unit: 'مليون ر.س', description: 'إجمالي الإيرادات لهذا الشهر' },
    { title: 'النفقات الشهرية', value: '1.8', unit: 'مليون ر.س', description: 'إجمالي النفقات لهذا الشهر' },
    { title: 'الربح الصافي', value: '700', unit: 'ألف ر.س', description: 'الأرباح بعد خصم النفقات' },
    { title: 'التدفق النقدي', value: '+12%', unit: 'نمو', description: 'مقارنة بالشهر السابق' },
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
    <div className={`space-y-5 ${SPACING.SECTION_MARGIN}`}>
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataCardFrame title="الميزانية مقابل الفعلي">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={mockBudgetData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={value => formatCurrency(Number(value))} labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Bar dataKey="budget" fill="rgba(189,238,211,0.4)" radius={[999, 999, 999, 999]} barSize={20} />
                <Bar dataKey="actual" fill="#bdeed3" radius={[999, 999, 999, 999]} barSize={20} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </DataCardFrame>

        <DataCardFrame title="توقعات التدفق النقدي">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockCashFlowData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(11,15,18,0.35)' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={value => formatCurrency(Number(value))} labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Line type="monotone" dataKey="inflow" stroke="#d9d2fd" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="outflow" stroke="#f1b5b9" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-[#d9d2fd]" />
              <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">التدفق الداخل</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-[#f1b5b9]" />
              <span className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">التدفق الخارج</span>
            </div>
          </div>
        </DataCardFrame>
      </div>

      {/* Alerts */}
      <DataCardFrame title="تنبيهات الذكاء الاصطناعي" icon={<Bell className="h-4 w-4" />}>
        <div className="space-y-2">
          {alerts.map(alert => (
            <BaseListItem
              key={alert.id}
              badge={{
                text: alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض',
                variant: getBadgeVariant(alert.priority),
              }}
            >
              {alert.message}
            </BaseListItem>
          ))}
        </div>
      </DataCardFrame>
    </div>
  );
};
