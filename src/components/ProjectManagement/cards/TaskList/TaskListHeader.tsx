import React, { useState } from 'react';
import { Plus, Filter, Sparkles, RefreshCw, ArrowUpDown } from 'lucide-react';
import { AddTaskModal } from '@/components/ProjectsColumn/AddTaskModal';
import { SmartTaskGenerationModal } from './SmartTaskGenerationModal';
import { TasksSortDialog } from './TasksSortDialog';
import type { TaskData } from '@/types';
interface TaskListHeaderProps {
  onTaskAdded: (task: TaskData) => void;
  onTasksGenerated: (tasks: TaskData[]) => void;
}
export const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  onTaskAdded,
  onTasksGenerated
}) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSmartGenerationModal, setShowSmartGenerationModal] = useState(false);
  const [showSortDialog, setShowSortDialog] = useState(false);
  const handleTaskAdded = (task: TaskData) => {
    onTaskAdded(task);
  };
  const handleTasksGenerated = (tasks: TaskData[]) => {
    onTasksGenerated(tasks);
  };
  const handleUpdateTasks = () => {
    // Refresh tasks functionality
    // يمكن إضافة منطق تحديث المهام هنا
  };
  const handleFilterTasks = () => {
    // Filter tasks functionality
    // يمكن إضافة منطق فلترة المهام هنا
  };

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    // Sort tasks functionality
    console.log('ترتيب المهام:', field, direction);
    // يمكن إضافة منطق ترتيب المهام هنا
  };
  return <>
      <div className="flex items-center justify-between mb-6 px-0 mx-[15px] my-[15px]">
        <h3 className="font-arabic" style={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#000000',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
          قائمة المهام
        </h3>
        <div className="flex items-center gap-2 mx-0">
          <button onClick={() => setShowSortDialog(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95" title="ترتيب المهام">
            <ArrowUpDown size={12} />
          </button>
          <button onClick={handleFilterTasks} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95">
            <Filter size={16} />
          </button>
          <button onClick={() => setShowSmartGenerationModal(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95">
            <Sparkles size={16} />
          </button>
          <button onClick={() => setShowAddTaskModal(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <AddTaskModal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} onTaskAdded={handleTaskAdded} />

      <SmartTaskGenerationModal isOpen={showSmartGenerationModal} onClose={() => setShowSmartGenerationModal(false)} onTasksGenerated={handleTasksGenerated} />
      
      <TasksSortDialog isOpen={showSortDialog} onClose={() => setShowSortDialog(false)} onSort={handleSort} />
      </>;
};