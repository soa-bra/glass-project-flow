
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
    <div className={`
      ${isCompressed ? 'w-[20%]' : 'w-[25%]'} 
      bg-soabra-projects-bg transition-all duration-300 h-full border-x border-gray-200
    `}>
      <div className="p-4 h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-soabra-text-primary">المشاريع</h2>
          <div className="text-sm text-soabra-text-secondary mt-1">
            {projects.length} مشروع نشط
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onProjectSelect(project)}
              className="bg-soabra-card-bg rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-100"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 ml-3">
                  <h3 className="font-medium text-soabra-text-primary leading-tight text-sm mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-soabra-text-secondary">
                    {project.assignee}
                  </p>
                </div>
                
                {/* Project Color Circle */}
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.phaseColor }}
                />
              </div>

              {/* Project Details */}
              <div className="flex items-center justify-between">
                {/* Phase Badge */}
                <span 
                  className="text-xs px-2 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: project.phaseColor }}
                >
                  {project.phase}
                </span>

                {/* Value */}
                <div className="text-sm font-semibold text-soabra-text-primary">
                  {project.value}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-3 flex justify-end">
                <div className={`
                  w-2 h-2 rounded-full
                  ${project.status === 'success' ? 'bg-soabra-status-success' : ''}
                  ${project.status === 'warning' ? 'bg-soabra-status-warning' : ''}
                  ${project.status === 'error' ? 'bg-soabra-status-error' : ''}
                  ${project.status === 'neutral' ? 'bg-soabra-status-neutral' : ''}
                `} />
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Button */}
        <div className="mt-4">
          <button className="w-full bg-soabra-primary-blue text-white text-sm py-3 rounded-lg hover:bg-soabra-primary-blue-hover transition-colors">
            إضافة مشروع جديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
