import React from 'react';
import { Eye, Users, FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
interface DepartmentOverviewProps {
  departmentTitle: string;
}
export const GeneralOverviewTab: React.FC<DepartmentOverviewProps> = ({
  departmentTitle
}) => {
  // بيانات تجريبية عامة
  const departmentStats = [{
    title: 'المهام النشطة',
    value: '24',
    change: 8.5,
    trend: 'up' as const,
    icon: FileText,
    color: 'text-blue-600'
  }, {
    title: 'أعضاء الفريق',
    value: '12',
    change: 2.1,
    trend: 'up' as const,
    icon: Users,
    color: 'text-green-600'
  }, {
    title: 'معدل الإنجاز',
    value: '87%',
    change: 5.3,
    trend: 'up' as const,
    icon: TrendingUp,
    color: 'text-purple-600'
  }, {
    title: 'المهام المتأخرة',
    value: '3',
    change: -12.5,
    trend: 'down' as const,
    icon: Clock,
    color: 'text-red-600'
  }];
  const recentActivities = [{
    action: 'تم إكمال مهمة المراجعة المالية',
    time: 'منذ ساعتين',
    priority: 'high' as const
  }, {
    action: 'إضافة عضو جديد للفريق',
    time: 'منذ 4 ساعات',
    priority: 'medium' as const
  }, {
    action: 'تحديث تقرير الأداء الشهري',
    time: 'منذ يوم واحد',
    priority: 'low' as const
  }, {
    action: 'مراجعة الميزانية المعتمدة',
    time: 'منذ يومين',
    priority: 'high' as const
  }];
  const upcomingTasks = [{
    task: 'اجتماع المراجعة الأسبوعية',
    dueDate: 'غداً - 10:00 ص',
    progress: 0
  }, {
    task: 'إعداد التقرير الشهري',
    dueDate: 'خلال 3 أيام',
    progress: 45
  }, {
    task: 'مراجعة الخطة الاستراتيجية',
    dueDate: 'خلال أسبوع',
    progress: 75
  }];
  return <div className="space-y-6 p-6 bg-transparent">
      {/* إحصائيات الإدارة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departmentStats.map((stat, index) => <BaseCard key={index} variant="operations" size="sm" className="text-center">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{stat.value}</h3>
            <p className="text-sm text-gray-600 font-arabic">{stat.title}</p>
          </BaseCard>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأنشطة الحديثة */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">الأنشطة الحديثة</h3>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                <div className="flex-1">
                  <p className="font-medium font-arabic text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant={activity.priority === 'high' ? 'destructive' : activity.priority === 'medium' ? 'secondary' : 'default'} className="text-xs">
                  {activity.priority === 'high' ? 'عالي' : activity.priority === 'medium' ? 'متوسط' : 'منخفض'}
                </Badge>
              </div>)}
          </div>
        </BaseCard>

        {/* المهام القادمة */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">المهام القادمة</h3>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => <div key={index} className="p-3 rounded-lg bg-transparent">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium font-arabic text-sm">{task.task}</h4>
                  <span className="text-xs text-gray-600">{task.dueDate}</span>
                </div>
                {task.progress > 0 && <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="h-2 flex-1" />
                    <span className="text-xs text-gray-600">{task.progress}%</span>
                  </div>}
              </div>)}
          </div>
        </BaseCard>
      </div>

      {/* التنبيهات والملاحظات */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">التنبيهات والملاحظات</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 font-arabic mb-1">تذكير مهم</h4>
            <p className="text-sm text-yellow-700">اجتماع المراجعة الأسبوعية غداً الساعة 10:00 صباحاً</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 font-arabic mb-1">معلومة</h4>
            <p className="text-sm text-blue-700">تم تحديث نظام إدارة المهام إلى الإصدار الجديد</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 font-arabic mb-1">إنجاز</h4>
            <p className="text-sm text-green-700">تم تحقيق 90% من أهداف هذا الشهر</p>
          </div>
        </div>
      </BaseCard>
    </div>;
};