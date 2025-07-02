import React from 'react';
import { Calendar, AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';

export interface ProjectsData {
  gantt: Array<{
    id: string;
    name: string;
    progress: number;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: 'on-track' | 'at-risk' | 'delayed';
  }>;
  milestones: Array<{
    id: string;
    title: string;
    project: string;
    dueDate: string;
    daysOverdue: number;
    status: 'overdue' | 'upcoming';
  }>;
}

interface ProjectsTabProps {
  data: ProjectsData;
  loading: boolean;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ data, loading }) => {
  const mockData: ProjectsData = {
    gantt: [
      {
        id: '1',
        name: 'مشروع تطوير التطبيق',
        progress: 75,
        dueDate: '2024-02-15',
        priority: 'high',
        status: 'on-track'
      },
      {
        id: '2',
        name: 'حملة التسويق الرقمي',
        progress: 45,
        dueDate: '2024-02-20',
        priority: 'medium',
        status: 'at-risk'
      },
      {
        id: '3',
        name: 'تطوير الموقع الإلكتروني',
        progress: 30,
        dueDate: '2024-01-30',
        priority: 'high',
        status: 'delayed'
      }
    ],
    milestones: [
      {
        id: '1',
        title: 'إطلاق النسخة التجريبية',
        project: 'مشروع تطوير التطبيق',
        dueDate: '2024-01-25',
        daysOverdue: 5,
        status: 'overdue'
      },
      {
        id: '2',
        title: 'مراجعة التصميم النهائي',
        project: 'تطوير الموقع الإلكتروني',
        dueDate: '2024-01-28',
        daysOverdue: 2,
        status: 'overdue'
      }
    ]
  };

  const currentData = data.gantt?.length > 0 ? data : mockData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-[#bdeed3] text-black';
      case 'at-risk': return 'bg-[#fbe2aa] text-black';
      case 'delayed': return 'bg-[#f1b5b9] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 font-arabic">
      {/* مؤشرات KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">24</h3>
          <p className="text-sm text-black">مشاريع نشطة</p>
        </div>
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">87%</h3>
          <p className="text-sm text-black">الالتزام بالوقت</p>
        </div>
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">92%</h3>
          <p className="text-sm text-black">الالتزام بالميزانية</p>
        </div>
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">3</h3>
          <p className="text-sm text-black">مشاريع متأخرة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gantt مصغر للمشاريع الحرجة */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            المشاريع الحرجة (أعلى 10)
          </h3>
          <div className="space-y-4">
            {currentData.gantt.map((project) => (
              <div key={project.id} className="p-4 bg-white rounded-2xl border border-black/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-black text-sm">{project.name}</h4>
                  <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status === 'on-track' ? 'في المسار' : 
                     project.status === 'at-risk' ? 'معرض للخطر' : 'متأخر'}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                    {project.priority === 'high' ? 'عالي' : 
                     project.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                  <span className="text-xs text-gray-500">{project.dueDate}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full transition-all" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-1 block">{project.progress}% مكتمل</span>
              </div>
            ))}
          </div>
        </div>

        {/* قائمة المعالم المتأخرة */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            المعالم المتأخرة
          </h3>
          <div className="space-y-4">
            {currentData.milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 bg-white rounded-2xl border border-black/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-black text-sm mb-1">{milestone.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{milestone.project}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">تاريخ الاستحقاق: {milestone.dueDate}</span>
                      <div className="px-3 py-1 bg-[#f1b5b9] text-black rounded-full text-xs">
                        متأخر {milestone.daysOverdue} أيام
                      </div>
                    </div>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};