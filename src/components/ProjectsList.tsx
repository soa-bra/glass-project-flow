
import { Project } from '@/types/project';
import { RotateCcw, Plus, ArrowUpDown, Building, Users, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
}

const ProjectsList = ({
  onProjectSelect,
  isCompressed
}: ProjectsListProps) => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'تطوير الموقع الإلكتروني',
      assignee: 'أحمد محمد',
      value: '15000',
      status: 'success',
      phase: 'التطوير',
      phaseColor: '#0099FF'
    },
    {
      id: '2',
      title: 'حملة التعريف بسوبرا وخدماتها',
      assignee: 'سارة أحمد',
      value: '8000',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#FBBF24'
    },
    {
      id: '3',
      title: 'صفحات التواصل الاجتماعي',
      assignee: 'محمد علي',
      value: '12000',
      status: 'success',
      phase: 'النشر',
      phaseColor: '#34D399'
    },
    {
      id: '4',
      title: 'المؤتمرات الثقافية للمهيل',
      assignee: 'فاطمة خالد',
      value: '25000',
      status: 'error',
      phase: 'متأخر',
      phaseColor: '#EF4444'
    },
    {
      id: '5',
      title: 'العلامة الثقافية للمهيل',
      assignee: 'عبدالله سعد',
      value: '18000',
      status: 'neutral',
      phase: 'دراسة',
      phaseColor: '#6B7280'
    },
    {
      id: '6',
      title: 'تطوير تطبيق الجوال',
      assignee: 'نورا حسن',
      value: '22000',
      status: 'success',
      phase: 'التطوير',
      phaseColor: '#A855F7'
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

  const getRandomDays = () => Math.floor(Math.random() * 30) + 1;
  const getRandomTasks = () => Math.floor(Math.random() * 20) + 1;

  return (
    <div className={`
      h-full bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300
      ${isCompressed ? 'opacity-70 scale-98' : 'opacity-100 scale-100'}
    `}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-soabra-text-primary flex items-center gap-2">
              <Building className="w-6 h-6 text-soabra-primary-blue" />
              المشاريع
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors group">
                <RotateCcw className="w-5 h-5 text-soabra-text-secondary group-hover:text-soabra-primary-blue group-hover:rotate-180 transition-all duration-300" />
              </button>
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors group">
                <ArrowUpDown className="w-5 h-5 text-soabra-text-secondary group-hover:text-soabra-primary-blue transition-all duration-300" />
              </button>
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors group">
                <Plus className="w-5 h-5 text-soabra-text-secondary group-hover:text-soabra-success transition-all duration-300" />
              </button>
            </div>
          </div>
          <div className="text-sm text-soabra-text-secondary flex items-center gap-2">
            <Users className="w-4 h-4" />
            {projects.length} مشروع نشط
          </div>
        </div>

        {/* Projects List with Scroll */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {projects.map(project => {
              const daysLeft = getRandomDays();
              const tasksCount = getRandomTasks();
              
              return (
                <div
                  key={project.id}
                  onClick={() => onProjectSelect(project)}
                  className="group relative h-[130px] w-full bg-white rounded-xl p-4 cursor-pointer shadow-sm border border-gray-200/50 hover:shadow-md hover:border-soabra-primary-blue/30 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Project Status Indicator */}
                  <div 
                    className="absolute top-0 right-0 w-full h-1 rounded-t-xl"
                    style={{ backgroundColor: project.phaseColor }}
                  />
                  
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-soabra-text-primary truncate mb-1 group-hover:text-soabra-primary-blue transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-soabra-text-secondary truncate">
                        تطوير وتنفيذ حلول رقمية متقدمة
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mr-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soabra-primary-blue/10 to-soabra-primary-blue/20 flex items-center justify-center border border-soabra-primary-blue/20">
                        <Calendar className="w-4 h-4 text-soabra-primary-blue" />
                      </div>
                      <span className="text-xs font-medium text-soabra-text-primary">{daysLeft} يوم</span>
                    </div>
                  </div>

                  {/* Content Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-soabra-text-secondary" />
                        <span className="text-sm font-medium text-soabra-text-secondary">{project.assignee}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-soabra-text-primary">
                        {parseInt(project.value).toLocaleString()} ر.س
                      </span>
                      <div 
                        className="w-3 h-3 rounded-full border border-white"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      />
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs px-2 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: project.phaseColor }}
                      >
                        {project.phase}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-soabra-text-secondary">
                      <span className="text-xs">{tasksCount} مهمة</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProjectsList;
