
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Calendar, Users, TrendingUp } from 'lucide-react';

interface ProjectData {
  id: number;
  name: string;
  progress: number;
  dueDate: string;
  team: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  color: string;
}

interface ProjectProgressWidgetProps {
  className?: string;
}

export const ProjectProgressWidget: React.FC<ProjectProgressWidgetProps> = ({
  className = ''
}) => {
  const projects: ProjectData[] = [
    {
      id: 1,
      name: 'تطوير تطبيق الجوال',
      progress: 85,
      dueDate: '2024-07-15',
      team: 8,
      status: 'on-track',
      color: '#10B981'
    },
    {
      id: 2,
      name: 'موقع الشركة الجديد',
      progress: 65,
      dueDate: '2024-07-20',
      team: 5,
      status: 'at-risk',
      color: '#F59E0B'
    },
    {
      id: 3,
      name: 'نظام إدارة العملاء',
      progress: 45,
      dueDate: '2024-07-10',
      team: 12,
      status: 'delayed',
      color: '#EF4444'
    },
    {
      id: 4,
      name: 'تحديث قاعدة البيانات',
      progress: 90,
      dueDate: '2024-07-25',
      team: 6,
      status: 'on-track',
      color: '#3B82F6'
    }
  ];

  const getStatusText = (status: ProjectData['status']) => {
    switch (status) {
      case 'on-track': return 'في المسار';
      case 'at-risk': return 'معرض للخطر';
      case 'delayed': return 'متأخر';
      default: return '';
    }
  };

  const getStatusColor = (status: ProjectData['status']) => {
    switch (status) {
      case 'on-track': return '#10B981';
      case 'at-risk': return '#F59E0B';
      case 'delayed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <TrendingUp size={16} className="text-purple-600" />
        </div>
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          تقدم المشاريع
        </h3>
      </header>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="p-3 bg-white/50 rounded-2xl border border-white/60"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#23272f] truncate flex-1">
                {project.name}
              </h4>
              <span 
                className="text-xs px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {getStatusText(project.status)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">التقدم</span>
                <span className="font-bold text-[#23272f]">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${project.progress}%`,
                    backgroundColor: project.color
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(project.dueDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{project.team} أعضاء</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GenericCard>
  );
};
