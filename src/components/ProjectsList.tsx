
import { Project } from '@/pages/Index';
import { RefreshCcw, Plus, ArrowUpDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
  selectedProjectId?: string;
}

const ProjectsList = ({
  onProjectSelect,
  isCompressed,
  selectedProjectId
}: ProjectsListProps) => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'تطوير الموقع الإلكتروني',
      assignee: 'د. أسامة',
      value: '15000',
      status: 'success',
      phase: 'التطوير',
      phaseColor: '#0099FF',
      daysLeft: 15,
      tasksCount: 12,
      description: 'تطوير موقع سوبرا'
    },
    {
      id: '2',
      title: 'حملة التعريف',
      assignee: 'د. أسامة',
      value: '8000',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#FBBF24',
      daysLeft: 8,
      tasksCount: 15,
      description: 'حملة التعريف بسوبرا وخدماتها'
    },
    {
      id: '3',
      title: 'صفحات التواصل',
      assignee: 'د. أسامة',
      value: '12000',
      status: 'success',
      phase: 'النشر',
      phaseColor: '#34D399',
      daysLeft: 22,
      tasksCount: 8,
      description: 'تطوير صفحات سوبرا بمنصات التواصل الاجتماعي'
    },
    {
      id: '4',
      title: 'المؤتمرات الثقافية',
      assignee: 'د. أسامة',
      value: '25000',
      status: 'error',
      phase: 'متأخر',
      phaseColor: '#EF4444',
      daysLeft: 3,
      tasksCount: 20,
      description: 'تطوير مؤتمرات سوبرا لقياس الجودات الثقافية للعلامة'
    },
    {
      id: '5',
      title: 'العلامة الثقافية',
      assignee: 'د. أسامة',
      value: '18000',
      status: 'neutral',
      phase: 'دراسة',
      phaseColor: '#6B7280',
      daysLeft: 30,
      tasksCount: 5,
      description: 'تقديم خدمة تطوير العلامة الثقافية لصالح Velva'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#5DDC82';
      case 'warning':
        return '#ECFF8C';
      case 'error':
        return '#F23D3D';
      case 'neutral':
        return '#EDEDEE';
      default:
        return '#EDEDEE';
    }
  };

  return (
    <div className="h-full bg-soabra-projects-bg rounded-t-2xl shadow-lg border border-gray-100 overflow-hidden z-projects glass"
         style={{ 
           background: '#E3E3E3',
           borderBottomLeftRadius: '0',
           borderBottomRightRadius: '0'
         }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-soabra-text-primary">المشاريع</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                  <RefreshCcw className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                  <ArrowUpDown className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                  <Plus className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
                </div>
              </button>
            </div>
          </div>
          <div className="text-sm text-soabra-text-secondary">
            {projects.length} مشروع نشط
          </div>
        </div>

        {/* Projects List with Scroll */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => onProjectSelect(project)}
                className={`h-[140px] bg-soabra-card-bg project-card rounded-xl p-4 cursor-pointer hover:opacity-90 hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm glass-hover ${
                  selectedProjectId === project.id && isCompressed ? 'opacity-100' : 
                  isCompressed ? 'opacity-50' : 'opacity-100'
                }`}
                style={{
                  background: '#F2F2F2',
                  backgroundImage: `
                    radial-gradient(circle at 2px 2px, rgba(0,0,0,0.015) 1px, transparent 0),
                    linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%)
                  `,
                  backgroundSize: '24px 24px, 12px 12px'
                }}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* First Row */}
                  <div className="flex items-start justify-between">
                    {/* Days Left Circle */}
                    <div className="w-12 h-12 rounded-full border-2 border-soabra-primary-blue/30 flex items-center justify-center backdrop-blur-sm bg-white/30">
                      <span className="text-xs font-bold text-soabra-text-primary">{project.daysLeft}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0 mx-3">
                      <h3 className="text-lg font-semibold text-soabra-text-primary truncate mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-soabra-text-secondary truncate">
                        {project.description}
                      </p>
                    </div>

                    {/* Tasks Count Circle */}
                    <div className="w-12 h-12 rounded-full border-2 border-gray-300/50 flex items-center justify-center backdrop-blur-sm bg-white/30">
                      <span className="text-xs font-bold text-soabra-text-primary">{project.tasksCount}</span>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="flex items-center justify-between">
                    {/* Project Manager Bubble */}
                    <div className="w-[120px] h-10 bg-white/40 rounded-full px-3 py-1 flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <span className="text-xs font-medium text-soabra-text-primary truncate">
                        {project.assignee}
                      </span>
                    </div>

                    {/* Budget Bubble */}
                    <div className="w-16 h-10 bg-white/40 rounded-full px-2 py-1 flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <span className="text-xs font-bold text-soabra-text-primary">
                        {parseInt(project.value).toLocaleString()}
                      </span>
                    </div>

                    {/* Status Circle */}
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProjectsList;
