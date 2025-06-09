
import { Project } from '@/pages/Index';

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
      phaseColor: '#0099FF'
    },
    {
      id: '2',
      title: 'حملة التعريف بسوءها وخدماتها',
      assignee: 'سارة أحمد',
      value: '8K',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#FBBF24'
    },
    {
      id: '3',
      title: 'صفحات التواصل الاجتماعي',
      assignee: 'محمد علي',
      value: '12K',
      status: 'success',
      phase: 'النشر',
      phaseColor: '#34D399'
    },
    {
      id: '4',
      title: 'المؤتمرات الثقافية للمهيل',
      assignee: 'فاطمة خالد',
      value: '25K',
      status: 'error',
      phase: 'متأخر',
      phaseColor: '#EF4444'
    },
    {
      id: '5',
      title: 'العلامة الثقافية للمهيل',
      assignee: 'عبدالله سعد',
      value: '18K',
      status: 'neutral',
      phase: 'دراسة',
      phaseColor: '#6B7280'
    },
    {
      id: '6',
      title: 'تطوير تطبيق الجوال',
      assignee: 'نورا حسن',
      value: '22K',
      status: 'success',
      phase: 'التطوير',
      phaseColor: '#A855F7'
    },
    {
      id: '7',
      title: 'برنامج التدريب الصيفي',
      assignee: 'خالد العتيبي',
      value: '30K',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#F59E0B'
    }
  ];

  return (
    <div className="h-full bg-soabra-projects-bg rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-soabra-text-primary mb-2">المشاريع</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-soabra-text-secondary">
              {projects.length} مشروع نشط
            </span>
            <button className="px-4 py-2 bg-soabra-primary-blue text-white rounded-lg text-sm font-medium hover:bg-soabra-primary-blue-hover transition-colors">
              إضافة مشروع +
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => onProjectSelect(project)}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInRight 0.6s ease-out both'
              }}
              className="group bg-white rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-soabra-primary-blue/10 hover:scale-[1.02] border border-gray-100 hover:border-soabra-primary-blue/30"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-soabra-text-primary text-sm leading-tight mb-1 group-hover:text-soabra-primary-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-soabra-text-secondary">
                    {project.assignee}
                  </p>
                </div>
                
                {/* Project Color Circle */}
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform" 
                  style={{ backgroundColor: project.phaseColor }} 
                />
              </div>

              {/* Project Details */}
              <div className="flex items-center justify-between mb-3">
                {/* Phase Badge */}
                <span 
                  className="text-xs px-3 py-1 rounded-full text-white font-medium shadow-sm" 
                  style={{ backgroundColor: project.phaseColor }}
                >
                  {project.phase}
                </span>

                {/* Value */}
                <div className="text-sm font-bold text-soabra-text-primary">
                  {project.value}
                </div>
              </div>

              {/* Status and Progress */}
              <div className="flex items-center gap-3">
                <div className={`
                  w-2 h-2 rounded-full
                  ${project.status === 'success' ? 'bg-soabra-status-success' : ''}
                  ${project.status === 'warning' ? 'bg-soabra-status-warning' : ''}
                  ${project.status === 'error' ? 'bg-soabra-status-error' : ''}
                  ${project.status === 'neutral' ? 'bg-soabra-status-neutral' : ''}
                `} />
                
                {/* Progress Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{
                      backgroundColor: project.phaseColor,
                      width: `${Math.random() * 60 + 40}%`
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
