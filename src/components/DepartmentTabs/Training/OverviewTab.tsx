import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Award, TrendingUp, Clock, Target, AlertTriangle, DollarSign } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { 
  mockTrainingMetrics, 
  mockSkillGapAlerts, 
  mockEnrollments, 
  mockTrainingSessions 
} from './data';

export const OverviewTab: React.FC = () => {
  const metrics = mockTrainingMetrics;

  const kpiStats = [
    {
      title: 'إجمالي الدورات',
      value: metrics.totalCourses,
      unit: 'دورة',
      description: 'الدورات المتاحة حالياً'
    },
    {
      title: 'المتدربون النشطون',
      value: metrics.activeLearners,
      unit: 'متدرب',
      description: 'المتدربون المسجلون حالياً'
    },
    {
      title: 'معدل الإنجاز',
      value: `${metrics.completionRate}%`,
      unit: 'إنجاز',
      description: 'نسبة إكمال الدورات'
    },
    {
      title: 'الشهادات الصادرة',
      value: metrics.certificatesIssued,
      unit: 'شهادة',
      description: 'الشهادات المُصدرة هذا الشهر'
    }
  ];

  const alerts = mockSkillGapAlerts;
  const recentEnrollments = mockEnrollments.slice(0, 5);
  const upcomingSessions = mockTrainingSessions.filter(s => s.status === 'scheduled').slice(0, 3);

  const StatCard = ({ title, value, icon: Icon, trend, color = "bg-blue-500" }: any) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color} text-white`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend > 0 ? '+' : ''}{trend}% من الشهر الماضي
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* Monthly Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="التسجيلات الجديدة"
          value={metrics.monthlyStats.newEnrollments}
          icon={TrendingUp}
          color="bg-cyan-500"
        />
        <StatCard
          title="الدورات المكتملة"
          value={metrics.monthlyStats.coursesCompleted}
          icon={BookOpen}
          color="bg-emerald-500"
        />
        <StatCard
          title="الساعات التدريبية"
          value={metrics.totalHoursDelivered}
          icon={Clock}
          color="bg-indigo-500"
        />
        <StatCard
          title="الإيرادات"
          value={`${(metrics.monthlyStats.revenue / 1000).toFixed(0)}k ر.س`}
          icon={DollarSign}
          color="bg-rose-500"
        />
      </div>

      {/* Kirkpatrick Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            مؤشرات كيركباتريك للتقييم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">رد الفعل</span>
                <span className="text-sm text-gray-600">{metrics.kirkpatrickMetrics.reaction}/5</span>
              </div>
              <Progress value={(metrics.kirkpatrickMetrics.reaction / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">التعلم</span>
                <span className="text-sm text-gray-600">{metrics.kirkpatrickMetrics.learning}/5</span>
              </div>
              <Progress value={(metrics.kirkpatrickMetrics.learning / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">السلوك</span>
                <span className="text-sm text-gray-600">{metrics.kirkpatrickMetrics.behavior}/5</span>
              </div>
              <Progress value={(metrics.kirkpatrickMetrics.behavior / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">النتائج</span>
                <span className="text-sm text-gray-600">{metrics.kirkpatrickMetrics.results}/5</span>
              </div>
              <Progress value={(metrics.kirkpatrickMetrics.results / 5) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              تنبيهات فجوات المهارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{alert.area}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.businessImpact}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'secondary' : 'outline'
                      }>
                        {alert.severity === 'critical' ? 'حرج' :
                         alert.severity === 'high' ? 'عالي' :
                         alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {alert.affectedEmployees.length} موظف متأثر
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>الجلسات القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-600">{session.instructor}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(session.scheduledAt).toLocaleDateString('ar-SA')}
                      </span>
                      <Badge variant="outline">
                        {session.type === 'workshop' ? 'ورشة عمل' :
                         session.type === 'live' ? 'جلسة مباشرة' : 'ندوة'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {session.registeredCount}/{session.maxAttendees}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>التسجيلات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">موظف {enrollment.studentId}</h4>
                      <p className="text-sm text-gray-600">دورة {enrollment.courseId}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    enrollment.status === 'completed' ? 'default' :
                    enrollment.status === 'in_progress' ? 'secondary' :
                    enrollment.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {enrollment.status === 'completed' ? 'مكتمل' :
                     enrollment.status === 'in_progress' ? 'قيد التقدم' :
                     enrollment.status === 'failed' ? 'فاشل' :
                     enrollment.status === 'dropped' ? 'منسحب' : 'مسجل'}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">{enrollment.progress}%</div>
                    <Progress value={enrollment.progress} className="h-1 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
