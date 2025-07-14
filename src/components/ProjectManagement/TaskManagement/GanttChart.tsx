import React from 'react';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  status: 'todo' | 'in-progress' | 'completed';
  dependencies?: string[];
}

interface GanttChartProps {
  projectId: string;
  filters?: {
    assignee: string;
    priority: string;
    status: string;
    search: string;
  };
}

export const GanttChart: React.FC<GanttChartProps> = ({ projectId, filters }) => {
  // Mock data for demonstration
  const tasks: Task[] = [
    {
      id: '1',
      name: 'تحليل المتطلبات',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      progress: 100,
      assignee: 'أحمد محمد',
      status: 'completed'
    },
    {
      id: '2',
      name: 'تصميم الواجهات',
      startDate: '2024-01-08',
      endDate: '2024-01-20',
      progress: 75,
      assignee: 'فاطمة علي',
      status: 'in-progress'
    },
    {
      id: '3',
      name: 'تطوير النظام',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      progress: 45,
      assignee: 'محمد حسن',
      status: 'in-progress'
    },
    {
      id: '4',
      name: 'اختبار النظام',
      startDate: '2024-02-10',
      endDate: '2024-02-25',
      progress: 0,
      assignee: 'سارة أحمد',
      status: 'todo'
    },
    {
      id: '5',
      name: 'النشر والتشغيل',
      startDate: '2024-02-20',
      endDate: '2024-03-01',
      progress: 0,
      assignee: 'عمر خالد',
      status: 'todo'
    }
  ];

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#bdeed3]';
      case 'in-progress':
        return 'bg-[#a4e2f6]';
      case 'todo':
        return 'bg-[#f1b5b9]';
      default:
        return 'bg-gray-200';
    }
  };

  const getProgressColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#bdeed3]';
      case 'in-progress':
        return 'bg-[#a4e2f6]';
      case 'todo':
        return 'bg-[#d9d2fd]';
      default:
        return 'bg-gray-300';
    }
  };

  // Calculate date range for the timeline
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-03-01');
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const calculatePosition = (taskStartDate: string, taskEndDate: string) => {
    const taskStart = new Date(taskStartDate);
    const taskEnd = new Date(taskEndDate);
    const left = ((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    const width = ((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  // Generate timeline headers
  const timelineHeaders = [];
  for (let i = 0; i < totalDays; i += 7) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    timelineHeaders.push(date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }));
  }

  return (
    <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-black mb-6">مخطط جانت - جدولة المهام</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex mb-4">
            <div className="w-64 flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-9 border-b border-black/10 pb-2">
              {timelineHeaders.map((header, index) => (
                <div key={index} className="text-xs text-center text-black font-medium">
                  {header}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map((task) => {
              const position = calculatePosition(task.startDate, task.endDate);
              
              return (
                <div key={task.id} className="flex items-center">
                  {/* Task Info */}
                  <div className="w-64 flex-shrink-0 pr-4">
                    <div className="bg-white rounded-2xl p-3 border border-black/10">
                      <h4 className="text-sm font-semibold text-black mb-1">{task.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{task.assignee}</p>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium text-black ${getStatusColor(task.status)}`}>
                          {task.status === 'completed' ? 'مكتملة' : task.status === 'in-progress' ? 'قيد التنفيذ' : 'لم تبدأ'}
                        </div>
                        <span className="text-xs text-gray-600">{task.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-8">
                    <div 
                      className="absolute top-1 h-6 rounded-full border border-black/10 bg-white"
                      style={position}
                    >
                      <div 
                        className={`h-full rounded-full ${getProgressColor(task.status)}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-black/10">
        <h4 className="text-sm font-semibold text-black mb-3">المفتاح:</h4>
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#bdeed3]"></div>
            <span className="text-black">مكتملة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#a4e2f6]"></div>
            <span className="text-black">قيد التنفيذ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#f1b5b9]"></div>
            <span className="text-black">لم تبدأ</span>
          </div>
        </div>
      </div>
    </div>
  );
};