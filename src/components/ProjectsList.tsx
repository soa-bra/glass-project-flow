import { Project } from '@/pages/Index';
interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
}
const ProjectsList = ({
  onProjectSelect,
  isCompressed
}: ProjectsListProps) => {
  const projects: Project[] = [{
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    assignee: 'أحمد محمد',
    value: '15K',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#0099FF'
  }, {
    id: '2',
    title: 'حملة التعريف بسوءها وخدماتها',
    assignee: 'سارة أحمد',
    value: '8K',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#FBBF24'
  }, {
    id: '3',
    title: 'صفحات التواصل الاجتماعي',
    assignee: 'محمد علي',
    value: '12K',
    status: 'success',
    phase: 'النشر',
    phaseColor: '#34D399'
  }, {
    id: '4',
    title: 'المؤتمرات الثقافية للمهيل',
    assignee: 'فاطمة خالد',
    value: '25K',
    status: 'error',
    phase: 'متأخر',
    phaseColor: '#EF4444'
  }, {
    id: '5',
    title: 'العلامة الثقافية للمهيل',
    assignee: 'عبدالله سعد',
    value: '18K',
    status: 'neutral',
    phase: 'دراسة',
    phaseColor: '#6B7280'
  }, {
    id: '6',
    title: 'تطوير تطبيق الجوال',
    assignee: 'نورا حسن',
    value: '22K',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#A855F7'
  }, {
    id: '7',
    title: 'برنامج التدريب الصيفي',
    assignee: 'خالد العتيبي',
    value: '30K',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#F59E0B'
  }];
  return <div className="bg-[e3e3e3] rounded-lg mx-0 px-0 py-[16px] my-[47px] bg-stone-200">
      <div className="p-4 pt-2 h-full px-0 mx-[2px] rounded-lg bg-[e3e3e3] py-[50px]">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-soabra-text-primary mb-2 tracking-wide">المشاريع</h2>
          <div className="text-base text-soabra-text-secondary font-medium">
            {projects.length} مشروع نشط
          </div>
          
        </div>

        {/* Projects List */}
        <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-soabra-primary-blue/20 scrollbar-track-transparent px-0 py-[43px] my-[14px]">
          {projects.map((project, index) => <div key={project.id} onClick={() => onProjectSelect(project)} style={{
          animationDelay: `${index * 0.1}s`,
          animation: 'slideInRight 0.6s ease-out both'
        }} className="group bg-soabra-card-bg glass rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-soabra-primary-blue/10 hover:scale-[1.02] hover:-translate-y-1 border border-white/30 hover:border-white/50 backdrop-blur-sm px-[80px] mx-[35px] py-0 my-0 bg-stone-50">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 ml-4">
                  <h3 className="font-bold text-soabra-text-primary leading-tight text-base mb-2 group-hover:text-soabra-primary-blue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-soabra-text-secondary font-medium">
                    {project.assignee}
                  </p>
                </div>
                
                {/* Project Color Circle */}
                <div className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-white/50 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{
              backgroundColor: project.phaseColor
            }} />
              </div>

              {/* Project Details */}
              <div className="flex items-center justify-between mb-4">
                {/* Phase Badge */}
                <span className="text-sm px-3 py-2 rounded-2xl text-white font-bold shadow-md group-hover:shadow-lg transition-all duration-300" style={{
              backgroundColor: project.phaseColor
            }}>
                  {project.phase}
                </span>

                {/* Value */}
                <div className="text-lg font-bold text-soabra-text-primary group-hover:scale-110 transition-transform duration-300">
                  {project.value}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex justify-between items-center">
                <div className={`
                  w-3 h-3 rounded-full shadow-sm animate-pulse
                  ${project.status === 'success' ? 'bg-soabra-status-success' : ''}
                  ${project.status === 'warning' ? 'bg-soabra-status-warning' : ''}
                  ${project.status === 'error' ? 'bg-soabra-status-error' : ''}
                  ${project.status === 'neutral' ? 'bg-soabra-status-neutral' : ''}
                `} />
                
                {/* Progress Bar */}
                <div className="flex-1 mr-3 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 group-hover:animate-pulse" style={{
                backgroundColor: project.phaseColor,
                width: `${Math.random() * 60 + 40}%`
              }} />
                </div>
              </div>
            </div>)}
        </div>

        {/* Add Project Button */}
        <div className="mt-6">
          <button className="group w-full bg-gradient-to-l from-soabra-primary-blue to-soabra-primary-blue-hover text-white text-base font-bold py-4 rounded-3xl hover:shadow-2xl hover:shadow-soabra-primary-blue/30 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-95">
            <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
              إضافة مشروع جديد +
            </span>
          </button>
        </div>
      </div>
    </div>;
};
export default ProjectsList;