
import { Project } from '@/types/project';
import { RotateCcw, Plus, ArrowUpDown, Building, Users, Calendar, Clock, TrendingUp } from 'lucide-react';
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
      phaseColor: '#3B82F6'
    },
    {
      id: '2',
      title: 'حملة التعريف بسوبرا وخدماتها',
      assignee: 'سارة أحمد',
      value: '8000',
      status: 'warning',
      phase: 'التخطيط',
      phaseColor: '#F59E0B'
    },
    {
      id: '3',
      title: 'صفحات التواصل الاجتماعي',
      assignee: 'محمد علي',
      value: '12000',
      status: 'success',
      phase: 'النشر',
      phaseColor: '#10B981'
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
      phaseColor: '#8B5CF6'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      case 'neutral':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getRandomDays = () => Math.floor(Math.random() * 30) + 1;
  const getRandomTasks = () => Math.floor(Math.random() * 20) + 1;
  const getRandomProgress = () => Math.floor(Math.random() * 100);

  return (
    <div className={`
      h-full bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden transition-all duration-300
      ${isCompressed ? 'opacity-80 scale-98' : 'opacity-100 scale-100'}
    `}>
      <div className="h-full flex flex-col">
        {/* Enhanced Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              المشاريع
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-all duration-300" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <ArrowUpDown className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
              </button>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{projects.length}</div>
              <div className="text-xs opacity-80">مشروع نشط</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs opacity-80">في الموعد</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-xs opacity-80">متأخر</div>
            </div>
          </div>
        </div>

        {/* Enhanced Projects List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {projects.map(project => {
              const daysLeft = getRandomDays();
              const tasksCount = getRandomTasks();
              const progress = getRandomProgress();
              
              return (
                <div
                  key={project.id}
                  onClick={() => onProjectSelect(project)}
                  className="group relative bg-white rounded-xl p-5 cursor-pointer shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Progress bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-xl overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: project.phaseColor 
                      }}
                    />
                  </div>
                  
                  {/* Header with title and status */}
                  <div className="flex items-start justify-between mb-4 pt-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{project.assignee}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      />
                      <span className="text-sm font-bold text-gray-800">
                        {parseInt(project.value).toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{daysLeft} يوم</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckSquare className="w-3 h-3" />
                      <span>{tasksCount} مهمة</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>{progress}%</span>
                    </div>
                  </div>

                  {/* Phase badge */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xs px-3 py-1 rounded-full text-white font-medium shadow-sm"
                      style={{ backgroundColor: project.phaseColor }}
                    >
                      {project.phase}
                    </span>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs text-blue-600 font-medium">عرض التفاصيل ←</div>
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
