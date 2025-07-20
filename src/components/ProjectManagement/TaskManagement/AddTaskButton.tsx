import React, { useState } from 'react';
import { AddTaskModal } from '@/components/ProjectsColumn/AddTaskModal';
import type { TaskData } from '@/types';

interface AddTaskButtonProps {
  column: string;
  projectId?: string;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ column, projectId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleTaskAdded = (task: TaskData) => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full p-4 bg-transparent border border-dashed border-black/20 rounded-3xl text-sm font-medium text-gray-400 hover:border-black/40 hover:text-black transition-colors flex items-center justify-center gap-2"
      >
        <span>+</span>
        إضافة مهمة
      </button>

      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTaskAdded={handleTaskAdded}
        isEditMode={false}
      />
    </>
  );
};