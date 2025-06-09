
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
      assignee: 'د. أحمد محمد',
      value: '15000',
      status: 'success',
      phase: 'التطوير',
      phaseColor: '#4ECDC4',
      daysLeft: 15,
      tasksCount: 12,
      description: 'تطوير موقع سوبرا الإلكتروني مع التركيز على تجربة المستخدم'
    },
    {
      id: '2',
      title: 'حملة التعريف بالعلامة',
      assignee: 'د. فاطمة علي',
      value: '8000',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#FFEAA7',
      daysLeft: 8,
      tasksCount: 15,
      description: 'حملة شاملة للتعريف بسوبرا وخدماتها المتميزة'
    },
    {
      id: '3',
      title: 'صفحات التواصل الاجتماعي',
      assignee: 'د. محمد سالم',
      value: '12000',
      status: 'success',
      phase: 'النشر',
      phaseColor: '#81ECEC',
      daysLeft: 22,
      tasksCount: 8,
      description: 'تطوير وإدارة صفحات سوبرا على منصات التواصل الاجتماعي'
    },
    {
      id: '4',
      title: 'المؤتمرات الثقافية',
      assignee: 'د. نورا أحمد',
      value: '25000',
      status: 'error',
      phase: 'متأخر',
      phaseColor: '#FF7675',
      daysLeft: 3,
      tasksCount: 20,
      description: 'تنظيم مؤتمرات سوبرا لقياس الجودة الثقافية للعلامة التجارية'
    },
    {
      id: '5',
      title: 'العلامة الثقافية المتطورة',
      assignee: 'د. خالد سعد',
      value: '18000',
      status: 'neutral',
      phase: 'دراسة',
      phaseColor: '#A29BFE',
      daysLeft: 30,
      tasksCount: 5,
      description: 'تطوير هوية ثقافية متميزة للعلامة التجارية'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#00B894';
      case 'warning':
        return '#FDCB6E';
      case 'error':
        return '#E84393';
      case 'neutral':
        return '#6C5CE7';
      default:
        return '#74B9FF';
    }
  };

  return (
    <div 
      className="h-full rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20 bg-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">المشاريع</h2>
            <div className="flex items-center gap-3">
              <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
                <RefreshCcw className="w-5 h-5 text-gray-700 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
                <ArrowUpDown className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
                <Plus className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
          <div className="text-lg font-medium text-gray-700">
            {projects.length} مشروع نشط
          </div>
        </div>

        {/* Projects List with Scroll */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => onProjectSelect(project)}
                className={`relative cursor-pointer hover:scale-[1.02] transition-all duration-300 ${
                  selectedProjectId === project.id && isCompressed ? 'opacity-100 scale-[1.02]' : 
                  isCompressed ? 'opacity-60' : 'opacity-100'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out both'
                }}
              >
                <div 
                  className="rounded-3xl p-6 border border-white/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    minHeight: '160px',
                  }}
                >
                  {/* Top Row - Days Left and Tasks */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Days Left Circle */}
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${project.phaseColor}, ${project.phaseColor}dd)`,
                        boxShadow: `0 4px 15px ${project.phaseColor}40`
                      }}
                    >
                      <div className="text-center">
                        <div className="text-xl">{project.daysLeft}</div>
                        <div className="text-xs opacity-80">يوم</div>
                      </div>
                    </div>

                    {/* Tasks Count */}
                    <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{project.tasksCount}</div>
                        <div className="text-xs text-gray-600">مهمة</div>
                      </div>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Bottom Row - Manager, Budget, Status */}
                  <div className="flex items-center justify-between">
                    {/* Project Manager */}
                    <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
                      <span className="text-sm font-medium text-gray-700">
                        {project.assignee}
                      </span>
                    </div>

                    {/* Budget */}
                    <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
                      <span className="text-sm font-bold text-gray-800">
                        {parseInt(project.value).toLocaleString()} ر.س
                      </span>
                    </div>

                    {/* Status Indicator */}
                    <div 
                      className="w-12 h-12 rounded-full shadow-lg border-4 border-white"
                      style={{ 
                        backgroundColor: getStatusColor(project.status),
                        boxShadow: `0 0 20px ${getStatusColor(project.status)}40`
                      }}
                    />
                  </div>

                  {/* Phase Badge */}
                  <div className="absolute top-4 left-4">
                    <div 
                      className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg"
                      style={{ 
                        backgroundColor: project.phaseColor,
                        boxShadow: `0 2px 10px ${project.phaseColor}40`
                      }}
                    >
                      {project.phase}
                    </div>
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
