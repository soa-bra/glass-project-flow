
import { Project } from '@/pages/Index';
import { RefreshCw, Plus, Filter } from 'lucide-react';

interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
}

const ProjectsList = ({ onProjectSelect, isCompressed }: ProjectsListProps) => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'تطوير الموقع الإلكتروني',
      assignee: 'أحمد محمد',
      value: '15K',
      status: 'success',
      phase: 'التطوير',
      phaseColor: '#0099FF',
      daysLeft: 12,
      tasksCount: 8
    },
    {
      id: '2',
      title: 'حملة التعريف بسوءها وخدماتها',
      assignee: 'سارة أحمد',
      value: '8K',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#FBBF24',
      daysLeft: 5,
      tasksCount: 15
    },
    {
      id: '3',
      title: 'صفحات التواصل الاجتماعي',
      assignee: 'محمد علي',
      value: '12K',
      status: 'success',
      phase: 'النشر',
      phaseColor: '#34D399',
      daysLeft: 20,
      tasksCount: 6
    },
    {
      id: '4',
      title: 'المؤتمرات الثقافية للمهيل',
      assignee: 'فاطمة خالد',
      value: '25K',
      status: 'error',
      phase: 'متأخر',
      phaseColor: '#EF4444',
      daysLeft: -3,
      tasksCount: 12
    },
    {
      id: '5',
      title: 'العلامة الثقافية للمهيل',
      assignee: 'عبدالله سعد',
      value: '18K',
      status: 'neutral',
      phase: 'دراسة',
      phaseColor: '#6B7280',
      daysLeft: 30,
      tasksCount: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#34D399';
      case 'warning': return '#FBBF24';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="h-full bg-soabra-projects-bg rounded-t-2xl overflow-hidden" style={{ height: '90%' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-medium text-soabra-text-primary">المشاريع</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-soabra-text-primary" />
              </button>
              <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-soabra-text-primary" />
              </button>
              <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
                <Plus className="w-4 h-4 text-soabra-text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects List - Scrollable */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => onProjectSelect(project)}
              className="bg-soabra-card-bg rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md border border-gray-200/30"
            >
              {/* Top Row: Days Left Circle + Title + Tasks Icon */}
              <div className="flex items-start justify-between mb-3">
                {/* Days Left Circle */}
                <div className="w-10 h-10 rounded-full bg-soabra-projects-bg flex items-center justify-center text-xs font-bold text-soabra-text-primary border border-gray-300">
                  {project.daysLeft > 0 ? project.daysLeft : Math.abs(project.daysLeft)}
                </div>
                
                {/* Title and Description */}
                <div className="flex-1 mx-3">
                  <h3 className="font-medium text-lg text-soabra-text-primary leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-soabra-text-secondary">
                    {project.assignee}
                  </p>
                </div>
                
                {/* Tasks Count Icon */}
                <div className="flex items-center gap-1 text-xs text-soabra-text-secondary">
                  <span>📋</span>
                  <span>{project.tasksCount}</span>
                </div>
              </div>

              {/* Bottom Row: Manager Bubble + Value Bubble + Status Circle */}
              <div className="flex items-center justify-between">
                {/* Manager Bubble */}
                <div className="px-3 py-1 bg-soabra-projects-bg rounded-full text-xs text-soabra-text-primary border border-gray-300">
                  {project.assignee.split(' ')[0]}
                </div>
                
                {/* Value Bubble */}
                <div className="w-10 h-10 bg-soabra-projects-bg rounded-full flex items-center justify-center text-xs font-bold text-soabra-text-primary border border-gray-300">
                  {project.value}
                </div>
                
                {/* Status Circle */}
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getStatusColor(project.status) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
