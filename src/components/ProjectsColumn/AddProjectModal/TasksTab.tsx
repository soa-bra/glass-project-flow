
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Edit, Trash2 } from 'lucide-react';
import type { TaskData } from '@/types';

interface TasksTabProps {
  tasks: TaskData[];
  onAddTask: () => void;
  onGenerateSmartTasks?: () => void;
  onEditTask?: (task: TaskData, index: number) => void;
  onDeleteTask?: (index: number) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({ 
  tasks, 
  onAddTask, 
  onGenerateSmartTasks,
  onEditTask,
  onDeleteTask 
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
              <div key={index} className="p-4 rounded-3xl bg-white/30 border border-black/20 text-black hover:bg-white/40 font-arabic transition-colors relative group">
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  {onEditTask && (
                    <button
                      onClick={() => onEditTask(task, index)}
                      className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      title="تعديل المهمة"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                  {onDeleteTask && (
                    <button
                      onClick={() => onDeleteTask(index)}
                      className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                      title="حذف المهمة"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <h4 className="font-bold font-arabic text-right pr-16">{task.title}</h4>
                <p className="text-sm text-black/60 font-arabic text-right mt-1 pr-16">{task.description}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-black/50 font-arabic">
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
