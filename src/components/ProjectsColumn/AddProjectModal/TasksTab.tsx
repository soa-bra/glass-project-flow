
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import type { TaskData } from '@/types';

interface TasksTabProps {
  tasks: TaskData[];
  onAddTask: () => void;
  onGenerateSmartTasks?: () => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({ 
  tasks, 
  onAddTask, 
  onGenerateSmartTasks 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={onAddTask}
              className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Plus size={16} className="ml-1" />
              إضافة مهمة
            </Button>
            {onGenerateSmartTasks && (
              <Button
                onClick={onGenerateSmartTasks}
                variant="outline"
                className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
              >
                <Sparkles size={16} className="ml-1" />
                توليد ذكي
              </Button>
            )}
          </div>
          <h3 className="text-lg font-bold font-arabic">مهام المشروع</h3>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-arabic">
            لا توجد مهام مضافة بعد
            <div className="text-sm mt-2">
              يمكنك إضافة مهام يدوياً أو استخدام التوليد الذكي
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="p-4 border border-white/40 rounded-lg" style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}>
                <h4 className="font-bold font-arabic text-right">{task.title}</h4>
                <p className="text-sm text-gray-600 font-arabic text-right mt-1">{task.description}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500 font-arabic">
                  <span>المكلف: {task.assignee}</span>
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
