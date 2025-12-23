/**
 * BaseStatsCard Storybook - توثيق تفاعلي لمكون BaseStatsCard
 */

import React, { useState } from 'react';
import { BaseStatsCard } from '@/components/shared/BaseStatsCard';
import { TrendingUp, Users, Briefcase, DollarSign, Clock, CheckCircle } from 'lucide-react';

// ===== التحكم التفاعلي =====

export const InteractivePlayground = () => {
  const [columns, setColumns] = useState<2 | 4>(2);
  const [statsCount, setStatsCount] = useState(4);

  const allStats = [
    { title: 'المشاريع النشطة', value: 24, description: '+3 هذا الأسبوع' },
    { title: 'المهام المكتملة', value: 156, description: 'من أصل 200' },
    { title: 'أعضاء الفريق', value: 12, description: 'فريق التطوير' },
    { title: 'الإيرادات', value: '50,000 ر.س', description: 'هذا الشهر' },
    { title: 'ساعات العمل', value: '320 س', description: 'متوسط شهري' },
    { title: 'رضا العملاء', value: '94%', description: 'تقييم ممتاز' },
  ];

  const stats = allStats.slice(0, statsCount);

  return (
    <div className="p-8 space-y-8 bg-panel min-h-screen" dir="rtl">
      <h1 className="text-display-m font-bold text-ink">BaseStatsCard Playground</h1>
      
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-2xl border border-border">
        <div className="space-y-2">
          <label className="text-label font-medium text-ink-60">Columns</label>
          <select 
            value={columns} 
            onChange={(e) => setColumns(Number(e.target.value) as 2 | 4)}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          >
            <option value={2}>2 أعمدة</option>
            <option value={4}>4 أعمدة</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-label font-medium text-ink-60">عدد الإحصائيات</label>
          <select 
            value={statsCount} 
            onChange={(e) => setStatsCount(Number(e.target.value))}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          >
            {[2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} إحصائيات</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="p-8 bg-white rounded-2xl border border-border">
        <BaseStatsCard stats={stats} columns={columns} />
      </div>

      {/* Code Preview */}
      <div className="p-4 bg-ink text-white rounded-xl font-mono text-sm overflow-x-auto">
        <pre>{`<BaseStatsCard
  columns={${columns}}
  stats={${JSON.stringify(stats, null, 2)}}
/>`}</pre>
      </div>
    </div>
  );
};

// ===== أمثلة واقعية =====

export const ProjectDashboard = () => {
  const stats = [
    { title: 'المشاريع النشطة', value: 24, description: '+3 هذا الأسبوع' },
    { title: 'المهام المكتملة', value: 156, description: '78% معدل الإنجاز' },
    { title: 'أعضاء الفريق', value: 12, description: '3 جدد هذا الشهر' },
    { title: 'ساعات العمل', value: '1,240', description: 'إجمالي الشهر' },
  ];

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">لوحة المشاريع</h2>
      
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-subtitle font-semibold text-ink mb-4">نظرة عامة</h3>
        <BaseStatsCard stats={stats} columns={4} />
      </div>
    </div>
  );
};

export const FinancialOverview = () => {
  const stats = [
    { title: 'الإيرادات الشهرية', value: '150,000 ر.س', description: '+12% عن الشهر السابق' },
    { title: 'المصروفات', value: '45,000 ر.س', description: 'ضمن الميزانية' },
    { title: 'صافي الربح', value: '105,000 ر.س', description: 'نمو 15%' },
    { title: 'الفواتير المعلقة', value: '8', description: 'بقيمة 25,000 ر.س' },
  ];

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">النظرة المالية</h2>
      
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-subtitle font-semibold text-ink mb-4">الأداء المالي</h3>
        <BaseStatsCard stats={stats} columns={2} />
      </div>
    </div>
  );
};

export const HRMetrics = () => {
  const stats = [
    { title: 'إجمالي الموظفين', value: 48 },
    { title: 'الحضور اليوم', value: 45, description: '94%' },
    { title: 'الإجازات النشطة', value: 3 },
    { title: 'معدل الرضا', value: '87%', description: 'استبيان الشهر' },
  ];

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">مؤشرات الموارد البشرية</h2>
      
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="text-subtitle font-semibold text-ink mb-4">الإحصائيات</h3>
        <BaseStatsCard stats={stats} columns={4} />
      </div>
    </div>
  );
};

export const MinimalExample = () => {
  const stats = [
    { title: 'المستخدمون', value: 1234 },
    { title: 'الطلبات', value: 567 },
  ];

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">مثال بسيط</h2>
      
      <div className="bg-white rounded-2xl border border-border p-6">
        <BaseStatsCard stats={stats} columns={2} />
      </div>
    </div>
  );
};

// ===== Default Export =====

const BaseStatsCardStories = {
  InteractivePlayground,
  ProjectDashboard,
  FinancialOverview,
  HRMetrics,
  MinimalExample,
};

export default BaseStatsCardStories;
