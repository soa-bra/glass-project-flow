
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { TaskData } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: TaskData) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const [taskData, setTaskData] = useState<TaskData>({
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium',
    stage: 'planning',
    attachments: [],
  });

  const teamMembers = [
    'أحمد محمد',
    'فاطمة علي',
    'خالد الأحمد',
    'نورا السالم',
    'محمد العتيبي',
    'سارة النجار'
  ];

  const priorities = [
    { value: 'high', label: 'عالية' },
    { value: 'medium', label: 'متوسطة' },
    { value: 'low', label: 'منخفضة' }
  ];

  const stages = [
    { value: 'planning', label: 'التخطيط' },
    { value: 'development', label: 'التطوير' },
    { value: 'testing', label: 'الاختبار' },
    { value: 'review', label: 'المراجعة' },
    { value: 'completed', label: 'مكتملة' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setTaskData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!taskData.title.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "عنوان المهمة مطلوب",
        variant: "destructive",
      });
      return false;
    }
    if (!taskData.dueDate) {
      toast({
        title: "خطأ في التحقق",
        description: "تاريخ الاستحقاق مطلوب",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSaveTask = () => {
    if (!validateForm()) return;

    try {
      const newTask = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      onTaskAdded(newTask);
      
      toast({
        title: "تم إنشاء المهمة بنجاح",
        description: `تم إضافة مهمة "${taskData.title}" بنجاح`,
      });
      
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "فشل إنشاء المهمة",
        description: "حاول مرة أخرى",
        variant: "destructive",
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
      attachments: [],
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
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 font-arabic"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 rounded-full bg-white/70 hover:bg-white/100 shadow-lg border border-white/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
          >
            <X className="text-gray-700" size={18} />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4">
            <DialogTitle className="text-2xl font-bold text-right font-arabic">
              إضافة مهمة جديدة
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
              <Label className="font-arabic text-right">عنوان المهمة *</Label>
              <Input
                value={taskData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-right font-arabic"
                placeholder="أدخل عنوان المهمة"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-arabic text-right">الوصف</Label>
              <Textarea
                value={taskData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-right font-arabic min-h-[100px]"
                placeholder="أدخل وصف المهمة"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-arabic text-right">تاريخ الاستحقاق *</Label>
                <Input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="text-right font-arabic"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-arabic text-right">المكلف</Label>
                <Select value={taskData.assignee} onValueChange={(value) => handleInputChange('assignee', value)}>
                  <SelectTrigger className="text-right font-arabic">
                    <SelectValue placeholder="اختر المكلف" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-arabic text-right">الأولوية</Label>
                <Select value={taskData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setTaskData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="text-right font-arabic">
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="font-arabic text-right">المرحلة</Label>
                <Select value={taskData.stage} onValueChange={(value: 'planning' | 'development' | 'testing' | 'review' | 'completed') => setTaskData(prev => ({ ...prev, stage: value }))}>
                  <SelectTrigger className="text-right font-arabic">
                    <SelectValue placeholder="اختر المرحلة" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-arabic text-right">المرفقات</Label>
              <Input
                type="file"
                multiple
                className="text-right font-arabic"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setTaskData(prev => ({
                    ...prev,
                    attachments: files.map(file => file.name)
                  }));
                }}
              />
            </div>

            <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-black text-black hover:bg-black/10 font-arabic"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSaveTask}
                className="bg-black text-white hover:bg-gray-800 font-arabic"
              >
                حفظ المهمة
              </Button>
            </div>
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
    </>
  );
};
