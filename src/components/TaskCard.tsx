
import React, { useState } from 'react';
import TaskCardLayout from './TaskCard/TaskCardLayout';
import TaskCardHeader from './TaskCard/TaskCardHeader';
import TaskCardFooter from './TaskCard/TaskCardFooter';
import { AddTaskModal } from './ProjectsColumn/AddTaskModal';
import type { TaskCardProps } from './TaskCard/types';
import type { TaskData } from '@/types';

interface ExtendedTaskCardProps extends TaskCardProps {
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onTaskUpdated?: (task: TaskData) => void;
}

const TaskCard: React.FC<ExtendedTaskCardProps> = ({
  id,
  title,
  description,
  status,
  statusColor,
  date,
  assignee,
  members,
  daysLeft,
  priority,
  isSelected = false,
  isSelectionMode = false,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
  onTaskUpdated
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // إنشاء كائن بيانات المهمة للتعديل
  const taskData: TaskData = {
    id: typeof id === 'string' ? parseInt(id) : id,
    title,
    description: description || '',
    dueDate: date,
    assignee: assignee || '',
    priority: priority || 'urgent-important',
    attachments: [],
    stage: 'planning',
    createdAt: new Date().toISOString()
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // منع انتشار الحدث إذا تم النقر على قائمة النقاط الثلاث في الوضع العادي
    if (!isSelectionMode && (e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    
    if (onSelect) {
      onSelect(id.toString());
    }
  };

  const handleEdit = (taskId: string, taskData?: any) => {
    console.log('فتح لوحة تعديل المهمة:', taskId);
    setShowEditModal(true);
  };

  const handleTaskUpdate = (updatedTask: TaskData) => {
    console.log('تم تحديث المهمة:', updatedTask);
    onTaskUpdated?.(updatedTask);
    setShowEditModal(false);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <TaskCardLayout id={id.toString()}>
          <TaskCardHeader
            daysLeft={daysLeft}
            title={title}
            description={description}
            priority={priority}
          />
          
          <TaskCardFooter
            status={status}
            statusColor={statusColor}
            date={date}
            assignee={assignee}
            members={members}
            taskId={id.toString()}
            taskData={taskData}
            isSelected={isSelected}
            isSelectionMode={isSelectionMode}
            onSelect={onSelect}
            onEdit={handleEdit}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        </TaskCardLayout>
      </div>

      {/* لوحة تعديل المهمة */}
      <AddTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onTaskAdded={() => {}} // لن يتم استخدامها في وضع التعديل
        onTaskUpdated={handleTaskUpdate}
        editingTask={taskData}
        isEditMode={true}
      />
    </>
  );
};

export default TaskCard;
