
import React from 'react';
import { Eye, Users, FileText, Clock, TrendingUp, AlertTriangle, Calendar, Award, Settings, BarChart, Globe, Shield, Database, Zap } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

interface DepartmentOverviewProps {
  departmentTitle: string;
}

export const GeneralOverviewTab: React.FC<DepartmentOverviewProps> = ({
  departmentTitle
}) => {
  const kpiStats = [
    {
      title: 'المهام النشطة',
      value: 24,
      unit: 'مهمة',
      description: 'المهام الجارية حالياً'
    },
    {
      title: 'أعضاء الفريق',
      value: 12,
      unit: 'عضو',
      description: 'أعضاء الفريق النشطون'
    },
    {
      title: 'معدل الإنجاز',
      value: '87%',
      unit: 'إنجاز',
      description: 'نسبة إنجاز المهام'
    }
  ];

  const departmentStats = [
    {
      title: 'المهام النشطة',
      value: '24',
      change: 8.5,
      trend: 'up' as const,
      icon: FileText,
      color: 'text-black'
    },
    {
      title: 'أعضاء الفريق',
      value: '12',
      change: 2.1,
      trend: 'up' as const,
      icon: Users,
      color: 'text-black'
    },
    {
      title: 'معدل الإنجاز',
      value: '87%',
      change: 5.3,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-black'
    },
    {
      title: 'المهام المتأخرة',
      value: '3',
      change: -12.5,
      trend: 'down' as const,
      icon: Clock,
      color: 'text-black'
    }
  ];

  const recentActivities = [
    {
      action: 'تم إكمال مهمة المراجعة المالية',
      time: 'منذ ساعتين',
      priority: 'high' as const
    },
    {
      action: 'إضافة عضو جديد للفريق',
      time: 'منذ 4 ساعات',
      priority: 'medium' as const
    },
    {
      action: 'تحديث تقرير الأداء الشهري',
      time: 'منذ يوم واحد',
      priority: 'low' as const
    },
    {
      action: 'مراجعة الميزانية المعتمدة',
      time: 'منذ يومين',
      priority: 'high' as const
    }
  ];

  const upcomingTasks = [
    {
      task: 'اجتماع المراجعة الأسبوعية',
      dueDate: 'غداً - 10:00 ص',
      progress: 0
    },
    {
      task: 'إعداد التقرير الشهري',
      dueDate: 'خلال 3 أيام',
      progress: 45
    },
    {
      task: 'مراجعة الخطة الاستراتيجية',
      dueDate: 'خلال أسبوع',
      progress: 75
    }
  ];

  const additionalStats = [
    {
      title: 'الاجتماعات المجدولة',
      value: '8',
      change: 15.2,
      trend: 'up' as const,
      icon: Calendar,
      color: 'text-black'
    },
    {
      title: 'المشاريع المميزة',
      value: '5',
      change: 10.0,
      trend: 'up' as const,
      icon: Award,
      color: 'text-black'
    },
    {
      title: 'الإعدادات المحدثة',
      value: '2',
      change: -5.0,
      trend: 'down' as const,
      icon: Settings,
      color: 'text-black'
    },
    {
      title: 'التقارير الشهرية',
      value: '15',
      change: 8.7,
      trend: 'up' as const,
      icon: BarChart,
      color: 'text-black'
    }
  ];

  const fifthRowStats = [
    {
      title: 'الشبكات المتصلة',
      value: '12',
      change: 18.3,
      trend: 'up' as const,
      icon: Globe,
      color: 'text-black'
    },
    {
      title: 'مستوى الأمان',
      value: '96%',
      change: 4.2,
      trend: 'up' as const,
      icon: Shield,
      color: 'text-black'
    },
    {
      title: 'قواعد البيانات',
      value: '7',
      change: 12.8,
      trend: 'up' as const,
      icon: Database,
      color: 'text-black'
    },
    {
      title: 'الأداء المحسن',
      value: '94%',
      change: 6.5,
      trend: 'up' as const,
      icon: Zap,
      color: 'text-black'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#f1b5b9] text-black';
      case 'medium': return 'bg-[#fbe2aa] text-black';
      case 'low': return 'bg-[#bdeed3] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* إحصائيات الإدارة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departmentStats.map((stat, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                stat.trend === 'up' ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{stat.value}</h3>
            <p className="text-sm font-normal text-black font-arabic">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأنشطة الحديثة */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
              <Eye className="h-5 w-5 text-black" />
              الأنشطة الحديثة
            </h3>
          </div>
          <div className="px-0">
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-3xl bg-transparent border border-black/10">
                  <div className="flex-1">
                    <p className="font-medium font-arabic text-sm text-black">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getPriorityColor(activity.priority)}`}>
                    {activity.priority === 'high' ? 'عالي' : activity.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* المهام القادمة */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
              <Clock className="h-5 w-5 text-black" />
              المهام القادمة
            </h3>
          </div>
          <div className="px-0">
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="p-3 rounded-3xl bg-transparent border border-black/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium font-arabic text-sm text-black">{task.task}</h4>
                    <span className="text-xs text-gray-400">{task.dueDate}</span>
                  </div>
                  {task.progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#a4e2f6] h-2 rounded-full" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{task.progress}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* التنبيهات والملاحظات */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-black" />
            التنبيهات والملاحظات
          </h3>
        </div>
        <div className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-[#fbe2aa] border border-black/10 rounded-3xl">
              <h4 className="font-medium text-black font-arabic mb-1">تذكير مهم</h4>
              <p className="text-sm text-black">اجتماع المراجعة الأسبوعية غداً الساعة 10:00 صباحاً</p>
            </div>
            <div className="p-4 bg-[#a4e2f6] border border-black/10 rounded-3xl">
              <h4 className="font-medium text-black font-arabic mb-1">معلومة</h4>
              <p className="text-sm text-black">تم تحديث نظام إدارة المهام إلى الإصدار الجديد</p>
            </div>
            <div className="p-4 bg-[#bdeed3] border border-black/10 rounded-3xl">
              <h4 className="font-medium text-black font-arabic mb-1">إنجاز</h4>
              <p className="text-sm text-black">تم تحقيق 90% من أهداف هذا الشهر</p>
            </div>
          </div>
        </div>
      </div>

      {/* الصف الرابع - إحصائيات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalStats.map((stat, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                stat.trend === 'up' ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{stat.value}</h3>
            <p className="text-sm font-normal text-black font-arabic">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* الصف الخامس - إحصائيات تقنية إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fifthRowStats.map((stat, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                stat.trend === 'up' ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{stat.value}</h3>
            <p className="text-sm font-normal text-black font-arabic">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
