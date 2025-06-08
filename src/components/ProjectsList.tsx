
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
  ];

  return (
    <div className={`
      ${isCompressed ? 'w-[15%]' : 'w-1/5'} 
      bg-soabra-projects-bg border-l border-gray-200 z-projects transition-all duration-300
    `}>
      <div className="p-4">
        <h2 className="text-heading-sub mb-4">المشاريع</h2>
        <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onProjectSelect(project)}
              className="project-card rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] z-project-cards"
            >
              {/* Project Title */}
              <h3 className="text-lg font-medium text-soabra-text-primary mb-2 leading-tight">
                {project.title}
              </h3>
              
              {/* Assignee */}
              <p className="text-sm text-soabra-text-secondary mb-3">
                المكلف: {project.assignee}
              </p>
              
              {/* Bottom Row: Value Badge + Status Dot */}
              <div className="flex items-center justify-between">
                {/* Value Badge */}
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-700">
                    {project.value}
                  </span>
                </div>
                
                {/* Status Dot */}
                <div className={`
                  w-3 h-3 rounded-full
                  ${project.status === 'success' ? 'status-dot-success' : ''}
                  ${project.status === 'warning' ? 'status-dot-warning' : ''}
                  ${project.status === 'error' ? 'status-dot-error' : ''}
                  ${project.status === 'neutral' ? 'status-dot-neutral' : ''}
                `} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
