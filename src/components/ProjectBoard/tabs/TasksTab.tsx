
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface TasksTabProps {
  project: ProjectCardProps;
}

const TasksTab: React.FC<TasksTabProps> = ({ project }) => {
  const tasks = [
    { id: 1, title: 'تصميم الواجهة الرئيسية', status: 'todo', priority: 'high' },
    { id: 2, title: 'تطوير API', status: 'inProgress', priority: 'medium' },
    { id: 3, title: 'اختبار الأداء', status: 'done', priority: 'low' },
  ];

  const columns = [
    { id: 'todo', title: 'قائمة المهام', color: 'bg-gray-100' },
    { id: 'inProgress', title: 'قيد التنفيذ', color: 'bg-blue-100' },
    { id: 'done', title: 'مكتملة', color: 'bg-green-100' },
  ];

  return (
    <div className="h-full">
      <div className="grid grid-cols-3 gap-6 h-full">
        {columns.map(column => (
          <div key={column.id} className="rounded-3xl backdrop-blur-3xl bg-white/40 p-4">
            <h3 className="font-bold font-arabic text-gray-800 mb-4">{column.title}</h3>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div key={task.id} className="p-3 rounded-2xl bg-white/40">
                    <div className="font-arabic text-gray-800 mb-2">{task.title}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block font-arabic ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTab;
