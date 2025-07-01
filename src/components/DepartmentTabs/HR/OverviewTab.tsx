import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Users, UserPlus, Calendar, TrendingUp, Award, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { mockHRStats, mockWorkforceAnalytics } from './data';

export const OverviewTab: React.FC = () => {
  const stats = mockHRStats;
  const analytics = mockWorkforceAnalytics;

  const kpiStats = [
    {
      title: 'إجمالي الموظفين',
      value: stats.totalEmployees,
      unit: 'موظف',
      description: 'العدد الكلي للموظفين'
    },
    {
      title: 'الموظفون النشطون',
      value: stats.activeEmployees,
      unit: 'نشط',
      description: 'الموظفون الحاضرون اليوم'
    },
    {
      title: 'معدل الحضور',
      value: `${stats.attendanceRate}%`,
      unit: 'حضور',
      description: 'نسبة الحضور الشهرية'
    }
  ];

  const quickActions = [
    { icon: UserPlus, label: 'إضافة موظف جديد', color: 'text-blue-600' },
    { icon: Calendar, label: 'مراجعة طلبات الإجازة', color: 'text-green-600' },
    { icon: Award, label: 'إجراء تقييم أداء', color: 'text-purple-600' },
    { icon: Users, label: 'إدارة التوظيف', color: 'text-orange-600' }
  ];

  const recentActivities = [
    { type: 'hire', message: 'تم توظيف أحمد العلي في قسم التقنية', time: 'منذ ساعتين' },
    { type: 'leave', message: 'طلب إجازة من سارة الزهراني - في انتظار الموافقة', time: 'منذ 4 ساعات' },
    { type: 'review', message: 'تم إكمال تقييم أداء خالد الشمري', time: 'منذ يوم واحد' },
    { type: 'training', message: 'تم تسجيل 5 موظفين في دورة الأمن السيبراني', time: 'منذ يومين' }
  ];

  const upcomingEvents = [
    { title: 'اجتماع مراجعة الأداء الربعي', date: '2025-01-05', type: 'meeting' },
    { title: 'بداية دورة مهارات القيادة', date: '2025-01-08', type: 'training' },
    { title: 'مقابلات للمرشحين الجدد', date: '2025-01-10', type: 'interview' },
    { title: 'ورشة عمل التطوير المهني', date: '2025-01-15', type: 'workshop' }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* باقي المحتوى */}
      
      {/* إحصائيات سريعة */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <Badge variant="default" className="text-xs">
              +{stats.newHires} موظف جديد هذا الشهر
            </Badge>
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الموظفون النشطون</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {stats.onLeave} في إجازة
            </Badge>
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">معدل الحضور</p>
              <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2">
            <Badge variant="default" className="text-xs">ممتاز</Badge>
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الوظائف المفتوحة</p>
              <p className="text-2xl font-bold text-orange-600">{stats.openPositions}</p>
            </div>
            <UserPlus className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {stats.pendingReviews} مراجعة معلقة
            </Badge>
          </div>
        </BaseCard>
      </div> */}

      {/* الإجراءات السريعة */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">الإجراءات السريعة</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 border-gray-200 hover:bg-gray-50"
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-sm font-arabic text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </BaseCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأنشطة الأخيرة */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">الأنشطة الأخيرة</h3>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'hire' ? 'bg-green-500' :
                  activity.type === 'leave' ? 'bg-yellow-500' :
                  activity.type === 'review' ? 'bg-blue-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-arabic">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* الأحداث القادمة */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">الأحداث القادمة</h3>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-arabic font-medium">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
                <Badge 
                  variant={
                    event.type === 'meeting' ? 'default' :
                    event.type === 'training' ? 'secondary' :
                    event.type === 'interview' ? 'outline' : 'default'
                  }
                  className="text-xs"
                >
                  {event.type === 'meeting' ? 'اجتماع' :
                   event.type === 'training' ? 'تدريب' :
                   event.type === 'interview' ? 'مقابلة' : 'ورشة'}
                </Badge>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>

      {/* توزيع القوى العاملة */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">توزيع القوى العاملة</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-3 font-arabic">التوزيع حسب القسم</h4>
            <div className="space-y-2">
              {analytics.departmentDistribution.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-arabic">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full" 
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-3 font-arabic">فجوات المهارات</h4>
            <div className="space-y-3">
              {analytics.skillsGaps.map((skill, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-arabic font-medium">{skill.skill}</span>
                    <Badge variant="destructive" className="text-xs">
                      فجوة {skill.gap.toFixed(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>الحالي: {skill.currentLevel}</span>
                    <span>المطلوب: {skill.requiredLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};
