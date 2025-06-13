
import React from 'react';
import { Project } from '@/types/project';
import { Calendar, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface OverviewTabProps {
  project: Project;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ project }) => {
  const budgetPercentage = (project.budget.spent / project.budget.total) * 100;
  const isOverBudget = budgetPercentage > 100;

  return (
    <div className="space-y-6">
      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">{project.daysLeft}</span>
          </div>
          <p className="text-sm text-gray-600">يوم متبقي</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">{project.progress}%</span>
          </div>
          <p className="text-sm text-gray-600">نسبة الإنجاز</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-800">{project.team.length}</span>
          </div>
          <p className="text-sm text-gray-600">عضو فريق</p>
        </div>

        <div className={`
          bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20
          ${isOverBudget ? 'ring-2 ring-red-400/50' : ''}
        `}>
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className={`w-8 h-8 ${isOverBudget ? 'text-red-600' : 'text-yellow-600'}`} />
            <span className="text-2xl font-bold text-gray-800">{budgetPercentage.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-gray-600">من الميزانية</p>
        </div>
      </div>

      {/* الأحداث القادمة */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">الأحداث القادمة</h3>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-8 min-w-max">
            {project.timeline.slice(0, 5).map((event, index) => (
              <div key={event.id} className="flex flex-col items-center min-w-fit">
                {/* التاريخ */}
                <div className="text-sm font-medium text-gray-700 mb-3 whitespace-nowrap">
                  {new Date(event.date).toLocaleDateString('ar-SA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                
                {/* الدائرة */}
                <div className={`
                  w-6 h-6 rounded-full border-2 border-white shadow-sm
                  ${event.status === 'completed' ? 'bg-green-500' : 
                    event.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'}
                `} />
                
                {/* الخط */}
                {index < project.timeline.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 mt-3" />
                )}
                
                {/* العنوان */}
                <div className="text-center mt-3 max-w-32">
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {event.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الميزانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`
          bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20
          ${isOverBudget 
            ? 'bg-gradient-to-br from-red-50/20 to-red-100/20' 
            : 'bg-gradient-to-br from-green-50/20 to-green-100/20'
          }
        `}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">الميزانية</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي الميزانية</span>
              <span className="font-bold text-gray-800">
                {project.budget.total.toLocaleString()} ر.س
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المبلغ المنفق</span>
              <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                {project.budget.spent.toLocaleString()} ر.س
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  isOverBudget 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* إحصائيات المهام */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">إحصائيات المهام</h3>
          <div className="space-y-4">
            {[
              { label: 'المكتملة', count: project.tasks.filter(t => t.status === 'completed').length, color: 'green' },
              { label: 'قيد التنفيذ', count: project.tasks.filter(t => t.status === 'in-progress').length, color: 'blue' },
              { label: 'متأخرة', count: project.tasks.filter(t => t.status === 'overdue').length, color: 'red' },
              { label: 'في الانتظار', count: project.tasks.filter(t => t.status === 'pending').length, color: 'yellow' }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
