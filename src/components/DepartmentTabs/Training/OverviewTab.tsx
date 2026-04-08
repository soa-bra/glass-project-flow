import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BaseBox } from '@/components/ui/BaseBox';
import { Users, BookOpen, Award, TrendingUp, Clock, Target, AlertTriangle, DollarSign } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { NumericStatCard } from '@/components/shared/visual-data';
import { 
  mockTrainingMetrics, 
  mockSkillGapAlerts, 
  mockEnrollments, 
  mockTrainingSessions 
} from './data';

export const OverviewTab: React.FC = () => {
  const metrics = mockTrainingMetrics;

  const kpiStats = [
    { title: 'إجمالي الدورات', value: metrics.totalCourses, unit: 'دورة', description: 'الدورات المتاحة حالياً' },
    { title: 'المتدربون النشطون', value: metrics.activeLearners, unit: 'متدرب', description: 'المتدربون المسجلون حالياً' },
    { title: 'معدل الإنجاز', value: `${metrics.completionRate}%`, unit: 'إنجاز', description: 'نسبة إكمال الدورات' },
    { title: 'الشهادات الصادرة', value: metrics.certificatesIssued, unit: 'شهادة', description: 'الشهادات المُصدرة هذا الشهر' },
  ];

  const alerts = mockSkillGapAlerts;
  const recentEnrollments = mockEnrollments.slice(0, 5);
  const upcomingSessions = mockTrainingSessions.filter(s => s.status === 'scheduled').slice(0, 3);

  return (
    <div className="space-y-5">
      <KPIStatsSection stats={kpiStats} />

      {/* Monthly Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NumericStatCard title="التسجيلات الجديدة" value={metrics.monthlyStats.newEnrollments} description="هذا الشهر" accentColor="#a4e2f6" />
        <NumericStatCard title="الدورات المكتملة" value={metrics.monthlyStats.coursesCompleted} description="هذا الشهر" accentColor="#bdeed3" />
        <NumericStatCard title="الساعات التدريبية" value={metrics.totalHoursDelivered} description="إجمالي الساعات" accentColor="#d9d2fd" />
        <NumericStatCard title="الإيرادات" value={`${(metrics.monthlyStats.revenue / 1000).toFixed(0)}k ر.س`} description="هذا الشهر" accentColor="#fbe2aa" />
      </div>

      {/* Kirkpatrick Metrics */}
      <BaseBox title="مؤشرات كيركباتريك للتقييم">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'رد الفعل', value: metrics.kirkpatrickMetrics.reaction },
            { label: 'التعلم', value: metrics.kirkpatrickMetrics.learning },
            { label: 'السلوك', value: metrics.kirkpatrickMetrics.behavior },
            { label: 'النتائج', value: metrics.kirkpatrickMetrics.results },
          ].map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-medium text-[rgba(11,15,18,0.60)] font-arabic">{m.label}</span>
                <span className="text-xs font-bold text-[#0B0F12]">{m.value}/5</span>
              </div>
              <div className="w-full h-2 bg-[rgba(11,15,18,0.04)] rounded-full">
                <div className="h-2 rounded-full bg-[#bdeed3] transition-all" style={{ width: `${(m.value / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </BaseBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skill Gap Alerts */}
        <BaseBox title="تنبيهات فجوات المهارات">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12]">{alert.area}</h4>
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mt-1">{alert.businessImpact}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <BaseBadge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'error' : 'secondary'} size="sm">
                      {alert.severity === 'critical' ? 'حرج' : alert.severity === 'high' ? 'عالي' : alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                    </BaseBadge>
                    <span className="text-[10px] text-[rgba(11,15,18,0.35)]">{alert.affectedEmployees.length} موظف متأثر</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseBox>

        {/* Upcoming Sessions */}
        <BaseBox title="الجلسات القادمة">
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12]">{session.title}</h4>
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">{session.instructor}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-[rgba(11,15,18,0.35)]">
                      {new Date(session.scheduledAt).toLocaleDateString('ar-SA')}
                    </span>
                    <BaseBadge variant="outline" size="sm">
                      {session.type === 'workshop' ? 'ورشة عمل' : session.type === 'live' ? 'جلسة مباشرة' : 'ندوة'}
                    </BaseBadge>
                    <span className="text-[10px] text-[rgba(11,15,18,0.35)]">{session.registeredCount}/{session.maxAttendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseBox>
      </div>

      {/* Recent Enrollments */}
      <BaseBox title="التسجيلات الأخيرة">
        <div className="space-y-3">
          {recentEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
              <div className="flex-1">
                <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12]">موظف {enrollment.studentId}</h4>
                <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">دورة {enrollment.courseId}</p>
              </div>
              <div className="flex items-center gap-3">
                <BaseBadge
                  variant={enrollment.status === 'completed' ? 'success' : enrollment.status === 'in_progress' ? 'info' : enrollment.status === 'failed' ? 'error' : 'outline'}
                  size="sm"
                >
                  {enrollment.status === 'completed' ? 'مكتمل' : enrollment.status === 'in_progress' ? 'قيد التقدم' : enrollment.status === 'failed' ? 'فاشل' : enrollment.status === 'dropped' ? 'منسحب' : 'مسجل'}
                </BaseBadge>
                <div className="text-right">
                  <div className="text-[12px] font-bold text-[#0B0F12]">{enrollment.progress}%</div>
                  <div className="w-16 h-1.5 bg-[rgba(11,15,18,0.04)] rounded-full mt-0.5">
                    <div className="h-full rounded-full bg-[#bdeed3] transition-all" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseBox>
    </div>
  );
};
