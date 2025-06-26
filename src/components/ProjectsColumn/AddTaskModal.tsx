import React, { useState } from 'react';
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
}
export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded
}) => {
  const {
    toast
  } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [taskData, setTaskData] = useState<TaskFormData>({
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium',
    stage: 'planning',
    attachments: []
  });
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
    try {
      const newTask: TaskData = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      onTaskAdded(newTask);
      toast({
        title: "تم إنشاء المهمة بنجاح",
        description: `تم إضافة مهمة "${taskData.title}" بنجاح`
      });
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "فشل إنشاء المهمة",
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
      priority: 'medium',
      stage: 'planning',
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
  return <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '24px'
      }}>
          <button onClick={handleClose} className="absolute top-4 left-4 rounded-full bg-white/70 hover:bg-white/100 shadow-lg border border-white/30 w-[32px] h-[32px] flex items-center justify-center transition z-10">
            <X size={18} className="text-black" />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4">
            <DialogTitle className="text-2xl font-bold text-right font-arabic">
              إضافة مهمة جديدة
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8">
            <TaskFormFields taskData={taskData} onInputChange={handleInputChange} onTaskDataChange={setTaskData} />
            
            <TaskFormActions onCancel={handleClose} onSave={handleSaveTask} />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من إلغاء إضافة المهمة؟ سيتم فقدان جميع البيانات المدخلة.
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
    </>;
};