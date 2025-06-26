
import React from 'react';
import { Button } from '@/components/ui/button';
import type { TaskData } from '@/types';

interface TasksTabProps {
  tasks: TaskData[];
  onAddTask: () => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({ tasks, onAddTask }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={onAddTask}
            className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full"
          >
            إضافة مهمة +
          </Button>
          <h3 className="text-lg font-bold font-arabic">مهام المشروع</h3>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-arabic">
            لا توجد مهام مضافة بعد
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 border border-white/40 rounded-lg" style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}>
                <h4 className="font-bold font-arabic text-right">{task.title}</h4>
                <p className="text-sm text-gray-600 font-arabic text-right mt-1">{task.description}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500 font-arabic">
                  <span>الأولوية: {task.priority}</span>
                  <span>المكلف: {task.assignee || 'غير محدد'}</span>
                  <span>تاريخ الاستحقاق: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
