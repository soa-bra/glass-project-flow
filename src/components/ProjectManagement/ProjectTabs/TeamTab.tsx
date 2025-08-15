import React from 'react';
import { BaseProjectTabLayout } from '../BaseProjectTabLayout';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Users, UserPlus, Star, Clock } from 'lucide-react';

interface TeamTabProps {
  teamData?: { name: string; avatar?: string }[];
}

export const TeamTab: React.FC<TeamTabProps> = ({ teamData }) => {
  const teamStats = [
    {
      title: 'أعضاء الفريق',
      value: '8',
      unit: 'عضو',
      description: 'العدد الإجمالي للفريق'
    },
    {
      title: 'معدل الأداء',
      value: '94',
      unit: '%',
      description: 'متوسط أداء الفريق'
    },
    {
      title: 'المهام المكتملة',
      value: '156',
      unit: 'مهمة',
      description: 'منذ بداية المشروع'
    },
    {
      title: 'ساعات العمل',
      value: '1,240',
      unit: 'ساعة',
      description: 'إجمالي ساعات العمل'
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'محمد أحمد',
      role: 'مطور ويب رئيسي',
      performance: 96,
      tasksCompleted: 45,
      hoursWorked: 320,
      status: 'active',
      expertise: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      name: 'فاطمة علي',
      role: 'مصممة UI/UX',
      performance: 98,
      tasksCompleted: 38,
      hoursWorked: 290,
      status: 'active',
      expertise: ['Figma', 'Adobe XD', 'Prototyping']
    },
    {
      id: 3,
      name: 'عبدالله سالم',
      role: 'مطور خلفي',
      performance: 92,
      tasksCompleted: 41,
      hoursWorked: 315,
      status: 'active',
      expertise: ['Python', 'Django', 'PostgreSQL']
    },
    {
      id: 4,
      name: 'نورا محمد',
      role: 'محللة جودة',
      performance: 90,
      tasksCompleted: 32,
      hoursWorked: 235,
      status: 'busy',
      expertise: ['Testing', 'Automation', 'QA']
    }
  ];

  return (
    <BaseProjectTabLayout
      value="team"
      title="إدارة الفريق"
      icon={<Users className="w-4 h-4" />}
      kpiStats={teamStats}
    >
      {/* Team Actions */}
      <BaseCard title="إدارة أعضاء الفريق" icon={<UserPlus className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <BaseActionButton 
            variant="primary" 
            icon={<UserPlus className="w-4 h-4" />}
          >
            إضافة عضو جديد
          </BaseActionButton>
          <BaseActionButton 
            variant="outline" 
            icon={<Users className="w-4 h-4" />}
          >
            إدارة الأدوار
          </BaseActionButton>
          <BaseActionButton 
            variant="secondary" 
            icon={<Star className="w-4 h-4" />}
          >
            تقييم الأداء
          </BaseActionButton>
          <BaseActionButton 
            variant="ghost" 
            icon={<Clock className="w-4 h-4" />}
          >
            تقرير الساعات
          </BaseActionButton>
        </div>
      </BaseCard>

      {/* Team Members List */}
      <BaseCard title="أعضاء الفريق" icon={<Users className="w-4 h-4" />}>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{member.name}</h4>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                </div>
                <BaseBadge 
                  variant={member.status === 'active' ? 'success' : 'warning'}
                  size="sm"
                >
                  {member.status === 'active' ? 'متاح' : 'مشغول'}
                </BaseBadge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500">معدل الأداء</p>
                  <p className="text-lg font-bold text-green-600">{member.performance}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">المهام المكتملة</p>
                  <p className="text-lg font-bold text-blue-600">{member.tasksCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">ساعات العمل</p>
                  <p className="text-lg font-bold text-purple-600">{member.hoursWorked}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">المهارات:</p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, index) => (
                    <BaseBadge key={index} variant="info" size="sm">
                      {skill}
                    </BaseBadge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Team Performance Chart */}
      <BaseCard title="مؤشرات أداء الفريق" icon={<Star className="w-4 h-4" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">توزيع الأدوار</h4>
              <div className="space-y-2">
                {[
                  { role: 'مطورين', count: 3, color: 'bg-blue-500' },
                  { role: 'مصممين', count: 2, color: 'bg-green-500' },
                  { role: 'محللين', count: 2, color: 'bg-purple-500' },
                  { role: 'مديرين', count: 1, color: 'bg-orange-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-700">{item.role}</span>
                    <span className="text-sm font-bold text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">الإنجازات الأسبوعية</h4>
              <div className="space-y-2">
                {[
                  { week: 'الأسبوع الحالي', tasks: 28, color: 'bg-green-500' },
                  { week: 'الأسبوع السابق', tasks: 31, color: 'bg-blue-500' },
                  { week: 'منذ أسبوعين', tasks: 25, color: 'bg-gray-400' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.week}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{item.tasks}</span>
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </BaseProjectTabLayout>
  );
};