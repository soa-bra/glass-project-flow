
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
    
    // إخفاء رسائل الخطأ عند البدء في الكتابة
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const missingFields: string[] = [];
    
    if (!taskData.title.trim()) {
      missingFields.push('عنوان المهمة');
    }
    
    if (!taskData.dueDate) {
      missingFields.push('تاريخ الاستحقاق');
    }
    
    if (!taskData.assignee.trim()) {
      missingFields.push('المكلف');
    }
    
    setValidationErrors(missingFields);
    return missingFields.length === 0;
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
    setValidationErrors([]);
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
            className="rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition justify-self-end"
          >
            <X className="text-black" size={18} />
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
              validationErrors={validationErrors}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* حوار تأكيد الحفظ */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          dir="rtl"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
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
          <AlertDialogFooter className="flex items-center justify-end gap-3">
            <AlertDialogCancel className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSaveTask} 
              className="bg-black hover:bg-black/90 text-white font-medium font-arabic rounded-full px-6 py-2"
            >
              {isEditMode ? 'حفظ التعديلات' : 'إنشاء المهمة'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          dir="rtl"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من إلغاء التعديل؟ سيتم فقدان جميع التعديلات.'
                : 'هل أنت متأكد من إلغاء إضافة المهمة؟ سيتم فقدان جميع البيانات المدخلة.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-3">
            <AlertDialogCancel className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2">
              العودة
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClose} 
              className="bg-black hover:bg-black/90 text-white font-medium font-arabic rounded-full px-6 py-2"
            >
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
