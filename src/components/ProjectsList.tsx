import { Project } from '@/types/project';
import { RefreshCcw, Plus, ArrowUpDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    value: '15000',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#0099FF'
  }, {
    id: '2',
    title: 'حملة التعريف بسوءها وخدماتها',
    assignee: 'سارة أحمد',
    value: '8000',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#FBBF24'
  }, {
    id: '3',
    title: 'صفحات التواصل الاجتماعي',
    assignee: 'محمد علي',
    value: '12000',
    status: 'success',
    phase: 'النشر',
    phaseColor: '#34D399'
  }, {
    id: '4',
    title: 'المؤتمرات الثقافية للمهيل',
    assignee: 'فاطمة خالد',
    value: '25000',
    status: 'error',
    phase: 'متأخر',
    phaseColor: '#EF4444'
  }, {
    id: '5',
    title: 'العلامة الثقافية للمهيل',
    assignee: 'عبدالله سعد',
    value: '18000',
    status: 'neutral',
    phase: 'دراسة',
    phaseColor: '#6B7280'
  }, {
    id: '6',
    title: 'تطوير تطبيق الجوال',
    assignee: 'نورا حسن',
    value: '22000',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#A855F7'
  }];
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
  return <div className="h-full bg-soabra-projects-bg rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-projects glass my-[99px] px-0 mx-[6px]">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-soabra-text-primary">المشاريع</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <RefreshCcw className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <ArrowUpDown className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <Plus className="w-5 h-5 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
              </button>
            </div>
          </div>
          <div className="text-sm text-soabra-text-secondary">
            {projects.length} مشروع نشط
          </div>
        </div>

        {/* Projects List with Scroll */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 py-0 px-[15px]">
            {projects.map(project => {
            const daysLeft = getRandomDays();
            const tasksCount = getRandomTasks();
            return <div key={project.id} onClick={() => onProjectSelect(project)} className="h-20 bg-soabra-card-bg project-card rounded-xl p-4 cursor-pointer hover:opacity-90 hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm glass-hover py-[63px]">
                  <div className="flex items-center justify-between h-full">
                    {/* Left side - Days remaining circle */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/30 border-2 border-soabra-primary-blue/30 
                                    flex items-center justify-center backdrop-blur-sm">
                        <span className="text-xs font-bold text-soabra-text-primary">{daysLeft}</span>
                      </div>
                      
                      {/* Project info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-soabra-text-primary truncate mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-soabra-text-secondary truncate">
                          تطوير موقع سوبرا بمنصات التواصل الاجتماعي
                        </p>
                      </div>
                    </div>

                    {/* Right side - Tasks, Manager, Budget, Status */}
                    <div className="flex items-center gap-2">
                      {/* Tasks count circle */}
                      <div className="w-12 h-12 rounded-full bg-white/30 border-2 border-gray-300/50 
                                    flex items-center justify-center backdrop-blur-sm">
                        <span className="text-xs font-bold text-soabra-text-primary">{tasksCount}</span>
                      </div>

                      {/* Project Manager bubble */}
                      <div className="w-20 h-8 bg-white/40 rounded-full px-3 py-1 
                                    flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <span className="text-xs font-medium text-soabra-text-primary truncate">
                          {project.assignee}
                        </span>
                      </div>

                      {/* Budget bubble */}
                      <div className="w-16 h-8 bg-white/40 rounded-full px-2 py-1 
                                    flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <span className="text-xs font-bold text-soabra-text-primary">
                          {parseInt(project.value).toLocaleString()}
                        </span>
                      </div>

                      {/* Status circle */}
                      <div className="w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm" style={{
                    backgroundColor: getStatusColor(project.status)
                  }}>
                      </div>
                    </div>
                  </div>
                </div>;
          })}
          </div>
        </ScrollArea>
      </div>
    </div>;
};
export default ProjectsList;
