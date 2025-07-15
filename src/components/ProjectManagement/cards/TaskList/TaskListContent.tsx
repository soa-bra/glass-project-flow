
import React, { useState, useEffect, useImperativeHandle } from 'react';
import type { TaskData } from '@/types';
import type { TaskCardProps } from '@/components/TaskCard/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import TaskCard from '@/components/TaskCard';
import { useTaskSelection } from '@/hooks/useTaskSelection';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { mapToTaskCardProps, mapFromTaskData } from '@/types/task';

export interface TaskListContentRef {
  addTask: (task: TaskData) => void;
  addTasks: (tasks: TaskData[]) => void;
}

interface TaskListContentProps {
  projectId?: string;
}

export const TaskListContent = React.forwardRef<TaskListContentRef, TaskListContentProps>(({ projectId }, ref) => {
  const unifiedTasks = useUnifiedTasks(projectId || 'default');
  const {
    selectedTasks,
    toggleTaskSelection,
    clearSelection
  } = useTaskSelection(projectId);
  const [showBulkArchiveDialog, setShowBulkArchiveDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // الحصول على المهام من النظام الموحد
  const allTasks = unifiedTasks.tasks.map(mapToTaskCardProps);

  const addTask = (task: TaskData) => {
    const unifiedTask = mapFromTaskData(task);
    unifiedTasks.addTask(unifiedTask);
  };

  const addTasks = (newTasks: TaskData[]) => {
    newTasks.forEach(task => {
      const unifiedTask = mapFromTaskData(task);
      unifiedTasks.addTask(unifiedTask);
    });
  };

  useImperativeHandle(ref, () => ({ addTask, addTasks }));

  // إضافة معالج لضغطة مفتاح Esc
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSelectionMode) {
        handleClearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelectionMode]);

  // تحديث وضع التحديد بناءً على المهام المحددة
  useEffect(() => {
    if (selectedTasks.length === 0 && isSelectionMode) {
      setIsSelectionMode(false);
    }
  }, [selectedTasks.length, isSelectionMode]);

  const handleTaskSelect = (taskId: string) => {
    console.log(`تحديد/إلغاء تحديد المهمة: ${taskId} في المشروع: ${projectId}`);
    console.log('المهام المحددة حالياً:', selectedTasks);
    console.log('وضع التحديد الحالي:', isSelectionMode);
    
    toggleTaskSelection(taskId);

    // تفعيل نمط التحديد عند تحديد أول مهمة
    if (!isSelectionMode) {
      console.log('تفعيل وضع التحديد');
      setIsSelectionMode(true);
    }
  };

  const handleClearSelection = () => {
    clearSelection();
    setIsSelectionMode(false);
  };

  const handleTaskEdit = (taskId: string) => {
    console.log('تعديل المهمة:', taskId);
    // سيتم تنفيذ modal التعديل لاحقاً
  };

  const handleTaskUpdated = (updatedTask: TaskData) => {
    console.log('تحديث المهمة:', updatedTask);
    const unifiedTask = mapFromTaskData(updatedTask);
    unifiedTasks.updateTask(updatedTask.id.toString(), unifiedTask);
  };

  const handleTaskArchive = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    console.log('تم أرشفة المهمة:', taskId);
  };

  const handleTaskDelete = (taskId: string) => {
    unifiedTasks.removeTask(taskId);
    console.log('تم حذف المهمة:', taskId);
  };

  const handleBulkArchive = () => {
    selectedTasks.forEach(taskId => {
      unifiedTasks.removeTask(taskId);
    });
    clearSelection();
    setIsSelectionMode(false);
    setShowBulkArchiveDialog(false);
    console.log('تم أرشفة المهام المحددة:', selectedTasks);
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach(taskId => {
      unifiedTasks.removeTask(taskId);
    });
    clearSelection();
    setIsSelectionMode(false);
    setShowBulkDeleteDialog(false);
    console.log('تم حذف المهام المحددة:', selectedTasks);
  };

  return (
    <>
      {/* شريط الإجراءات الجماعية */}
      {selectedTasks.length > 0 && <div style={{
      direction: 'rtl',
      backgroundColor: 'transparent'
    }} className="mb-4 p-3 flex justify-between items-center font-arabic bg-transparent">
          <span style={{
        color: '#000000'
      }} className="text-sm">
            تم تحديد {selectedTasks.length} مهمة
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowBulkArchiveDialog(true)} 
              style={{
                backgroundColor: '#fbe2aa'
              }}
              className="px-3 py-1 text-sm transition-colors rounded-full text-black hover:opacity-80"
            >
              أرشفة المحدد
            </button>
            <button 
              onClick={() => setShowBulkDeleteDialog(true)} 
              style={{
                backgroundColor: '#f1b5b9'
              }}
              className="px-3 py-1 text-sm transition-colors rounded-full text-black hover:opacity-80"
            >
              حذف المحدد
            </button>
            <button 
              onClick={handleClearSelection} 
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #000000'
              }}
              className="px-3 py-1 text-sm transition-colors rounded-full text-black hover:opacity-80"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>}

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pr-1 py-0 my-0">
          {allTasks.map((task, index) => {
            const taskKey = `task-${projectId}-${task.id}-${index}`;
            const isTaskSelected = selectedTasks.includes(task.id.toString());
            console.log(`البطاقة ${task.id} في المشروع ${projectId}: محددة = ${isTaskSelected}, وضع التحديد = ${isSelectionMode}`);
            
            return (
              <div key={taskKey}>
                <TaskCard 
                  {...task} 
                  isSelected={isTaskSelected} 
                  isSelectionMode={isSelectionMode} 
                  onSelect={handleTaskSelect} 
                  onEdit={handleTaskEdit} 
                  onArchive={handleTaskArchive} 
                  onDelete={handleTaskDelete} 
                  onTaskUpdated={handleTaskUpdated}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* حوار تأكيد الأرشفة الجماعية */}
      <AlertDialog open={showBulkArchiveDialog} onOpenChange={setShowBulkArchiveDialog}>
        <AlertDialogContent className="font-arabic" style={{
        direction: 'rtl'
      }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الأرشفة الجماعية</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد أرشفة {selectedTasks.length} مهمة؟ يمكنك استعادتها لاحقاً من الأرشيف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive}>أرشفة الكل</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent className="font-arabic" style={{
        direction: 'rtl'
      }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف {selectedTasks.length} مهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              حذف الكل نهائياً
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
