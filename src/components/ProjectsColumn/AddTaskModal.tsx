
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { TaskData } from '@/types';
import { TaskFormFields } from './AddTaskModal/TaskFormFields';
import { TaskFormActions } from './AddTaskModal/TaskFormActions';
import { TaskFormData } from './AddTaskModal/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: TaskData) => void;
  onTaskUpdated?: (task: TaskData) => void;
  editingTask?: TaskData | null;
  isEditMode?: boolean;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
  onTaskUpdated,
  editingTask,
  isEditMode = false
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [taskData, setTaskData] = useState<TaskFormData>({
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'urgent-important',
    attachments: []
  });

  // تعبئة البيانات عند التعديل
  useEffect(() => {
    if (isEditMode && editingTask) {
      setTaskData({
        id: editingTask.id,
        title: editingTask.title || '',
        description: editingTask.description || '',
        dueDate: editingTask.dueDate || '',
        assignee: editingTask.assignee || '',
        priority: editingTask.priority || 'urgent-important',
        attachments: editingTask.attachments || []
      });
    }
  }, [isEditMode, editingTask]);

  const handleInputChange = (field: string, value: string) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!taskData.title.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "عنوان المهمة مطلوب",
        variant: "destructive"
      });
      return false;
    }
    if (!taskData.dueDate) {
      toast({
        title: "خطأ في التحقق",
        description: "تاريخ الاستحقاق مطلوب",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSaveTask = () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmSaveTask = () => {
    try {
      if (isEditMode && editingTask) {
        // تحديث المهمة الموجودة
        const updatedTask: TaskData = {
          ...editingTask,
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          assignee: taskData.assignee,
          priority: taskData.priority,
          attachments: taskData.attachments,
        };
        
        onTaskUpdated?.(updatedTask);
        toast({
          title: "تم تحديث المهمة بنجاح",
          description: `تم تحديث مهمة "${taskData.title}" بنجاح`
        });
      } else {
        // إنشاء مهمة جديدة
        const newTask: TaskData = {
          ...taskData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          stage: 'planning'
        };
        
        onTaskAdded(newTask);
        toast({
          title: "تم إنشاء المهمة بنجاح",
          description: `تم إضافة مهمة "${taskData.title}" بنجاح`
        });
      }
      
      resetForm();
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: isEditMode ? "فشل تحديث المهمة" : "فشل إنشاء المهمة",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setTaskData({
      id: 0,
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      priority: 'urgent-important',
      attachments: []
    });
  };

  const handleClose = () => {
    if (taskData.title.trim() || taskData.description.trim()) {
      setShowCancelDialog(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const confirmClose = () => {
    resetForm();
    setShowCancelDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px'
        }}>
          <button 
            onClick={handleClose} 
            className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
          >
            <X size={18} className="text-black" />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4">
            <DialogTitle className="text-2xl font-bold text-right font-arabic">
              {isEditMode ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8">
            <TaskFormFields 
              taskData={taskData} 
              onInputChange={handleInputChange} 
              onTaskDataChange={setTaskData} 
            />
            
            <TaskFormActions 
              onCancel={handleClose} 
              onSave={handleSaveTask}
              saveButtonText={isEditMode ? 'حفظ التعديلات' : 'حفظ المهمة'}
              taskData={taskData}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* حوار تأكيد الحفظ */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              {isEditMode ? 'تأكيد التعديل' : 'تأكيد الحفظ'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من حفظ التعديلات على هذه المهمة؟'
                : 'هل أنت متأكد من إنشاء هذه المهمة؟'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveTask} className="font-arabic">
              {isEditMode ? 'حفظ التعديلات' : 'إنشاء المهمة'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من إلغاء التعديل؟ سيتم فقدان جميع التعديلات.'
                : 'هل أنت متأكد من إلغاء إضافة المهمة؟ سيتم فقدان جميع البيانات المدخلة.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">العودة</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="font-arabic">
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
