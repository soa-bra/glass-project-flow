import React, { useState } from 'react';
import { HiPlus, HiStar, HiArrowLeft } from 'react-icons/hi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BulkActionsBar } from '@/components/ui/BulkActionsBar';
import TaskCard from './TaskCard';
import type { TaskCardProps } from './TaskCard/types';
import { useMultiSelection } from '@/hooks/useMultiSelection';

const tasks: TaskCardProps[] = [
  {
    id: 1,
    title: 'تصميم الواجهة',
    description: 'تطوير موقع سوبرا',
    status: 'وفق الخطة',
    statusColor: '#A1E8B8',
    date: '28 May',
    assignee: 'د. أسامة',
    members: 'غير مضيف',
    daysLeft: 1,
    priority: 'urgent-not-important' as const
  },
  {
    id: 2,
    title: 'كتابة الكود',
    description: 'تطوير موقع سوبرا',
    status: 'وفق الخطة',
    statusColor: '#A1E8B8',
    date: '29 May',
    assignee: 'د. أسامة',
    members: 'عضو',
    daysLeft: 1,
    priority: 'urgent-important' as const
  },
];

const TaskColumn: React.FC = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  const {
    selectedItems,
    isSelectionMode,
    activeColumn,
    toggleSelection,
    isSelected,
    bulkDelete,
    bulkArchive
  } = useMultiSelection();

  const handleTaskSelect = (taskId: string) => {
    toggleSelection(taskId, 'tasks');
  };

  const handleEdit = (taskId: string) => {
    console.log('تعديل المهمة:', taskId);
  };

  const handleArchive = (taskId: string) => {
    console.log('أرشفة المهمة:', taskId);
  };

  const handleDelete = (taskId: string) => {
    console.log('حذف المهمة:', taskId);
  };

  const isDimmed = (taskId: string) => {
    return isSelectionMode && activeColumn !== 'tasks';
  };

  return (
    <>
      <div
        className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
        style={{
          background: 'var(--backgrounds-project-column-bg)',
        }}
      >
        {/* رأس العمود */}
        <div className="flex-shrink-0 px-4 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">قائمة المهام</h2>
            <div className="flex gap-2 text-gray-600">
              <button><HiPlus onClick={() => setShowAddTaskModal(true)} /></button>
              <button><HiStar /></button>
              <button><HiArrowLeft /></button>
            </div>
          </div>
          <BulkActionsBar
            selectedCount={activeColumn === 'tasks' ? selectedItems.length : 0}
            onDelete={bulkDelete}
            onArchive={bulkArchive}
          />
        </div>

        {/* منطقة التمرير لبطاقات المهام */}
        <div className="flex-1 overflow-hidden rounded-t-3xl">
          <ScrollArea className="h-full w-full">
            <div className="space-y-4 pb-4 px-0 rounded-full mx-[10px]">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  {...task} 
                  isDimmed={isDimmed(task.id.toString())}
                  onSelect={() => handleTaskSelect(task.id.toString())}
                  onEdit={() => handleEdit(task.id.toString())}
                  onArchive={() => handleArchive(task.id.toString())}
                  onDelete={() => handleDelete(task.id.toString())}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default TaskColumn;
