import React, { useState } from 'react';
import { Plus, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { AddTaskModal } from '@/components/ProjectsColumn/AddTaskModal';
import { SmartTaskGenerationModal } from './SmartTaskGenerationModal';

interface TaskListHeaderProps {
  onTaskAdded: (task: any) => void;
  onTasksGenerated: (tasks: any[]) => void;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({ 
  onTaskAdded, 
  onTasksGenerated 
}) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSmartGenerationModal, setShowSmartGenerationModal] = useState(false);

  const handleTaskAdded = (task: any) => {
    console.log('تم إضافة مهمة جديدة:', task);
    onTaskAdded(task);
  };

  const handleTasksGenerated = (tasks: any[]) => {
    console.log('تم توليد مهام جديدة:', tasks);
    onTasksGenerated(tasks);
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
