import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { NumericStatCard } from '@/components/shared/visual-data';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { UserPlus, Calendar, Award, Users } from 'lucide-react';
import { mockHRStats, mockWorkforceAnalytics } from './data';

export const OverviewTab: React.FC = () => {
  const stats = mockHRStats;
  const analytics = mockWorkforceAnalytics;

  const kpiStats = [
    { title: 'إجمالي الموظفين', value: stats.totalEmployees, unit: 'موظف', description: 'العدد الكلي للموظفين' },
    { title: 'الموظفون النشطون', value: stats.activeEmployees, unit: 'نشط', description: 'الموظفون الحاضرون اليوم' },
    { title: 'معدل الحضور', value: `${stats.attendanceRate}%`, unit: 'حضور', description: 'نسبة الحضور الشهرية' },
  ];

  const quickActions = [
    { icon: UserPlus, label: 'إضافة موظف جديد', color: '#a4e2f6' },
    { icon: Calendar, label: 'مراجعة طلبات الإجازة', color: '#bdeed3' },
    { icon: Award, label: 'إجراء تقييم أداء', color: '#d9d2fd' },
    { icon: Users, label: 'إدارة التوظيف', color: '#fbe2aa' },
  ];

  const recentActivities = [
    { type: 'hire', message: 'تم توظيف أحمد العلي في قسم التقنية', time: 'منذ ساعتين' },
    { type: 'leave', message: 'طلب إجازة من سارة الزهراني - في انتظار الموافقة', time: 'منذ 4 ساعات' },
    { type: 'review', message: 'تم إكمال تقييم أداء خالد الشمري', time: 'منذ يوم واحد' },
    { type: 'training', message: 'تم تسجيل 5 موظفين في دورة الأمن السيبراني', time: 'منذ يومين' },
  ];

  const upcomingEvents = [
    { title: 'اجتماع مراجعة الأداء الربعي', date: '2025-01-05', type: 'meeting' },
    { title: 'بداية دورة مهارات القيادة', date: '2025-01-08', type: 'training' },
    { title: 'مقابلات للمرشحين الجدد', date: '2025-01-10', type: 'interview' },
    { title: 'ورشة عمل التطوير المهني', date: '2025-01-15', type: 'workshop' },
  ];

  const typeColors: Record<string, string> = {
    hire: '#bdeed3',
    leave: '#fbe2aa',
    review: '#a4e2f6',
    training: '#d9d2fd',
  };

  return (
    <div className="space-y-5 bg-transparent">
      <KPIStatsSection stats={kpiStats} />

      {/* Quick Actions */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          الإجراءات السريعة
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="h-20 flex flex-col items-center justify-center gap-2 rounded-[18px] border border-[#DADCE0] hover:border-[rgba(11,15,18,0.2)] transition-colors"
            >
              <action.icon className="h-5 w-5" style={{ color: action.color }} />
              <span className="text-[11px] font-arabic text-[rgba(11,15,18,0.60)]">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
            الأنشطة الأخيرة
          </span>
          <div className="space-y-2 mt-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: typeColors[activity.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-arabic text-[rgba(11,15,18,0.70)]">{activity.message}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.30)] mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
            الأحداث القادمة
          </span>
          <div className="space-y-2 mt-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                <div>
                  <p className="text-[12px] font-arabic font-medium text-[rgba(11,15,18,0.70)]">{event.title}</p>
                  <p className="text-[10px] text-[rgba(11,15,18,0.30)]">{event.date}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#DADCE0] text-[rgba(11,15,18,0.50)] font-arabic">
                  {event.type === 'meeting' ? 'اجتماع' : event.type === 'training' ? 'تدريب' : event.type === 'interview' ? 'مقابلة' : 'ورشة'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workforce Distribution */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          توزيع القوى العاملة
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="text-[12px] font-medium mb-3 font-arabic text-[rgba(11,15,18,0.60)]">التوزيع حسب القسم</h4>
            <div className="space-y-2.5">
              {analytics.departmentDistribution.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-[11px] font-arabic text-[rgba(11,15,18,0.60)]">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[rgba(11,15,18,0.04)] rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${dept.percentage}%`, backgroundColor: '#a4e2f6' }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#0B0F12] w-6 text-left">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[12px] font-medium mb-3 font-arabic text-[rgba(11,15,18,0.60)]">فجوات المهارات</h4>
            <div className="space-y-2.5">
              {analytics.skillsGaps.map((skill, index) => (
                <div key={index} className="p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-arabic font-medium text-[rgba(11,15,18,0.70)]">{skill.skill}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(241,181,185,0.15)] text-[rgba(11,15,18,0.60)] font-arabic">
                      فجوة {skill.gap.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[rgba(11,15,18,0.40)]">
                    <span>الحالي: {skill.currentLevel}</span>
                    <span>المطلوب: {skill.requiredLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
