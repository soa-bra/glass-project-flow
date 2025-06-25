
import React, { useState } from 'react';
import { Plus, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { AddTaskModal } from '@/components/ProjectsColumn/AddTaskModal';
import { SmartTaskGenerationModal } from './SmartTaskGenerationModal';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  daysLeft: number;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

interface TaskListHeaderProps {
  tasks?: Task[];
  onTasksChange?: (tasks: Task[]) => void;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({ tasks = [], onTasksChange }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSmartGenerationModal, setShowSmartGenerationModal] = useState(false);

  const handleTaskAdded = (task: any) => {
    console.log('تم إضافة مهمة جديدة:', task);
    
    if (onTasksChange) {
      const newTask: Task = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: 'وفق الخطة',
        statusColor: '#A1E8B8',
        date: new Date(task.dueDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
        assignee: task.assignee || 'غير محدد',
        members: 'غير مضيف',
        daysLeft: Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        priority: task.priority === 'high' ? 'urgent-important' : 
                 task.priority === 'medium' ? 'urgent-not-important' : 'not-urgent-not-important'
      };
      
      onTasksChange([...tasks, newTask]);
    }
  };

  const handleTasksGenerated = (generatedTasks: any[]) => {
    console.log('تم توليد مهام جديدة:', generatedTasks);
    
    if (onTasksChange) {
      const newTasks: Task[] = generatedTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: 'وفق الخطة',
        statusColor: '#A1E8B8',
        date: new Date(task.dueDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
        assignee: task.assignee || 'غير محدد',
        members: 'غير مضيف',
        daysLeft: Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        priority: task.priority === 'high' ? 'urgent-important' : 
                 task.priority === 'medium' ? 'urgent-not-important' : 'not-urgent-not-important'
      }));
      
      onTasksChange([...tasks, ...newTasks]);
    }
  };

  const handleUpdateTasks = () => {
    console.log('تحديث المهام');
    // يمكن إضافة منطق تحديث المهام هنا
  };

  const handleFilterTasks = () => {
    console.log('فلترة المهام');
    // يمكن إضافة منطق فلترة المهام هنا
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 my-[10px]">
        <h3 className="font-arabic" style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#000000',
          fontFamily: 'IBM Plex Sans Arabic'
        }}>
          قائمة المهام
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdateTasks}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/20 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleFilterTasks}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/20 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95"
          >
            <Filter size={16} />
          </button>
          <button
            onClick={() => setShowSmartGenerationModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/20 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95"
          >
            <Sparkles size={16} />
          </button>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/20 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onTaskAdded={handleTaskAdded}
      />

      <SmartTaskGenerationModal
        isOpen={showSmartGenerationModal}
        onClose={() => setShowSmartGenerationModal(false)}
        onTasksGenerated={handleTasksGenerated}
      />
    </>
  );
};
