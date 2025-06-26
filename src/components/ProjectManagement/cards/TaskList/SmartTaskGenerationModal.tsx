
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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

interface SmartTaskGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksGenerated: (tasks: any[]) => void;
}

const taskTypes = [
  { id: 'financial', label: 'مالي' },
  { id: 'legal', label: 'قانوني' },
  { id: 'technical', label: 'تقني' },
  { id: 'executive', label: 'تنفيذي' },
  { id: 'review', label: 'مراجعة' },
];

export const SmartTaskGenerationModal: React.FC<SmartTaskGenerationModalProps> = ({
  isOpen,
  onClose,
  onTasksGenerated,
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    taskCount: '',
    selectedTypes: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // إزالة رسالة الخطأ عند التعديل
  };

  const handleTypeChange = (typeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: checked
        ? [...prev.selectedTypes, typeId]
        : prev.selectedTypes.filter(id => id !== typeId)
    }));
  };

  const generateTasks = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // استخدام القيمة الافتراضية إذا لم يتم إدخال عدد
      const taskCount = formData.taskCount ? parseInt(formData.taskCount) : 5;
      
      // محاكاة عملية التوليد (يمكن استبدالها بـ Supabase Function لاحقاً)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // توليد مهام وهمية للاختبار
      const generatedTasks = Array.from({ length: taskCount }, (_, index) => ({
        id: Date.now() + index,
        title: `مهمة مولدة ${index + 1}`,
        description: `وصف المهمة المولدة تلقائياً`,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        type: formData.selectedTypes.length > 0 
          ? formData.selectedTypes[Math.floor(Math.random() * formData.selectedTypes.length)]
          : 'technical',
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stage: 'planning',
        assignee: '',
        createdAt: new Date().toISOString(),
      }));

      onTasksGenerated(generatedTasks);

      toast({
        title: "تمّ توليد المهام بنجاح",
        description: `تم إنشاء ${taskCount} مهمة جديدة`,
      });

      resetForm();
      onClose();

    } catch (error) {
      setError('فشل التوليد، تأكد من المعايير وحاول مجددًا.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      taskCount: '',
      selectedTypes: [],
    });
    setError('');
  };

  const handleClose = () => {
    if (formData.taskCount.trim() || formData.selectedTypes.length > 0) {
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

          <DialogHeader className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold text-right font-arabic mb-2">
              توليد ذكي للمهام
            </DialogTitle>
            <p className="text-sm text-gray-600 text-right font-arabic">
              أنشئ مهام المشروع أوتوماتيكيًا وفق معايير التطبيق.
            </p>
          </DialogHeader>

          <div className="px-8 pb-8">
            <div className="space-y-6">
              {/* حقل عدد المهام */}
              <div className="space-y-2">
                <Label className="font-arabic text-right font-bold">عدد المهام التقريبي</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.taskCount}
                  onChange={(e) => handleInputChange('taskCount', e.target.value)}
                  className="text-right font-arabic"
                  placeholder="5 (افتراضي)"
                />
              </div>

              {/* حقل نوع المهام */}
              <div className="space-y-3">
                <Label className="font-arabic text-right font-bold">نوع المهام</Label>
                <div className="grid grid-cols-2 gap-3">
                  {taskTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={type.id}
                        checked={formData.selectedTypes.includes(type.id)}
                        onCheckedChange={(checked) => handleTypeChange(type.id, !!checked)}
                      />
                      <Label htmlFor={type.id} className="font-arabic text-sm cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="text-red-600 text-sm font-arabic text-right bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* رسالة التوليد */}
              {isGenerating && (
                <div className="flex items-center gap-2 justify-center text-gray-600 font-arabic">
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>جاري التوليد...</span>
                </div>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 justify-start pt-6 border-t border-white/20 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isGenerating}
                className="border-black text-black hover:bg-black/10 font-arabic"
              >
                إلغاء
              </Button>
              <Button
                onClick={generateTasks}
                disabled={isGenerating}
                className="font-arabic"
                style={{
                  backgroundColor: '#D4A574', // لون Mustard من لوحة سوبرا
                  color: 'white',
                }}
              >
                {isGenerating ? 'جاري التوليد...' : 'توليد'}
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
              هل أنت متأكد من إلغاء توليد المهام؟ سيتم فقدان جميع البيانات المدخلة.
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
