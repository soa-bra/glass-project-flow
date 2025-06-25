
import React, { useState } from 'react';
import { Plus, MoreHorizontal, Sparkles } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';
import { AddTaskModal } from '@/components/ProjectsColumn/AddTaskModal';
import { SmartTaskGenerationModal } from './SmartTaskGenerationModal';

export const TaskListHeader: React.FC = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSmartGenerationModal, setShowSmartGenerationModal] = useState(false);

  const handleTaskAdded = (task: any) => {
    console.log('تم إضافة مهمة جديدة:', task);
    // يمكن إضافة المنطق لتحديث قائمة المهام هنا
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
          <CircularIconButton 
            icon={Plus} 
            size="sm" 
            variant="default" 
            className="hover:scale-105 transition-transform" 
            onClick={() => setShowAddTaskModal(true)}
          />
          <CircularIconButton 
            icon={Sparkles} 
            size="sm" 
            variant="default" 
            className="hover:scale-105 transition-transform" 
            onClick={() => setShowSmartGenerationModal(true)}
          />
          <CircularIconButton 
            icon={MoreHorizontal} 
            size="sm" 
            variant="default" 
            className="hover:scale-105 transition-transform" 
          />
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
        onTasksGenerated={handleTaskAdded}
      />
    </>
  );
};
