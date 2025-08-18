
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Loader2, Sparkles } from 'lucide-react';
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

import type { TaskData } from '@/types';

interface SmartTaskGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksGenerated: (tasks: TaskData[]) => void;
}

const taskTypes = [
  { id: 'planning', label: 'تخطيط' },
  { id: 'development', label: 'تطوير' },
  { id: 'testing', label: 'اختبار' },
  { id: 'review', label: 'مراجعة' },
  { id: 'design', label: 'تصميم' },
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

      // إنشاء قوالب المهام حسب النوع المختار
      const taskTemplates = {
        planning: [
          { title: 'تحليل المتطلبات والاحتياجات', description: 'دراسة شاملة لمتطلبات المشروع واحتياجات العملاء' },
          { title: 'وضع الخطة الزمنية', description: 'إعداد جدول زمني تفصيلي للمشروع مع تحديد المعالم' },
          { title: 'تحديد الموارد المطلوبة', description: 'حصر وتقدير الموارد البشرية والمالية والتقنية' },
          { title: 'دراسة الجدوى', description: 'تقييم الجدوى الاقتصادية والتقنية للمشروع' }
        ],
        design: [
          { title: 'تصميم الواجهات الأساسية', description: 'إنشاء التصاميم الأولية للواجهات الرئيسية' },
          { title: 'إعداد دليل الهوية البصرية', description: 'تحديد الألوان والخطوط والعناصر البصرية' },
          { title: 'تصميم تجربة المستخدم', description: 'رسم خرائط رحلة المستخدم وتحسين التفاعل' },
          { title: 'إنشاء النماذج الأولية', description: 'بناء نماذج تفاعلية للاختبار والتطوير' }
        ],
        development: [
          { title: 'إعداد البيئة التطويرية', description: 'تكوين بيئة العمل والأدوات المطلوبة للتطوير' },
          { title: 'تطوير الواجهة الأمامية', description: 'برمجة وتطوير واجهات المستخدم التفاعلية' },
          { title: 'تطوير الواجهة الخلفية', description: 'بناء APIs وقواعد البيانات والخوادم' },
          { title: 'تكامل الأنظمة', description: 'ربط مكونات النظام وضمان التوافق بينها' }
        ],
        testing: [
          { title: 'اختبار الوحدات', description: 'اختبار المكونات الفردية للنظام' },
          { title: 'اختبار التكامل', description: 'اختبار التفاعل بين مكونات النظام المختلفة' },
          { title: 'اختبار الأداء', description: 'قياس أداء النظام تحت ضغوط مختلفة' },
          { title: 'اختبار الأمان', description: 'فحص الثغرات الأمنية والحماية' }
        ],
        review: [
          { title: 'مراجعة التصميم', description: 'فحص ومراجعة التصاميم والواجهات' },
          { title: 'مراجعة الكود', description: 'مراجعة جودة الكود والممارسات البرمجية' },
          { title: 'مراجعة الوثائق', description: 'مراجعة الوثائق والدلائل الفنية' },
          { title: 'اعتماد المخرجات', description: 'اعتماد النتائج النهائية للمرحلة' }
        ]
      };

      const selectedTaskTypes = formData.selectedTypes.length > 0 ? formData.selectedTypes : ['planning'];
      const generatedTasks: TaskData[] = [];
      
      let taskIndex = 0;
      for (let i = 0; i < taskCount; i++) {
        const taskType = selectedTaskTypes[i % selectedTaskTypes.length];
        const templates = taskTemplates[taskType as keyof typeof taskTemplates] || taskTemplates.planning;
        const template = templates[taskIndex % templates.length];
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 21) + 7); // 7-28 days from now
        
        generatedTasks.push({
          id: Date.now() + i,
          title: template.title,
          description: template.description,
          priority: (['urgent-important', 'urgent-not-important', 'not-urgent-important', 'not-urgent-not-important'] as const)[Math.floor(Math.random() * 4)],
          dueDate: dueDate.toISOString().split('T')[0],
          stage: taskType as any,
          assignee: ['أحمد محمد', 'فاطمة علي', 'محمد خالد', 'نورا سعد'][Math.floor(Math.random() * 4)],
          attachments: [],
          createdAt: new Date().toISOString(),
        });
        
        if ((i + 1) % selectedTaskTypes.length === 0) {
          taskIndex++;
        }
      }

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
          className="max-w-3xl max-h-[90vh] overflow-hidden font-arabic p-0"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6 px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-black font-arabic">
                  توليد ذكي للمهام
                </DialogTitle>
                <p className="text-sm text-black/70 font-arabic">أنشئ مهام المشروع أوتوماتيكيًا وفق معايير التطبيق</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition"
              aria-label="إغلاق"
            >
              <X className="text-black" size={18} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6">
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
                  className="text-right font-arabic h-12 px-4 py-3 rounded-full border border-black/20 bg-white/50 hover:bg-white/70 focus:bg-white transition-colors"
                  placeholder="5 (افتراضي)"
                />
              </div>

              {/* حقل نوع المهام */}
              <div className="space-y-3">
                <Label className="font-arabic text-right font-bold">نوع المهام</Label>
                <div className="grid grid-cols-3 gap-3">
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
            <div className="flex gap-4 justify-start pt-4 border-t border-white/20 mt-4 mb-6">
              <Button
                onClick={generateTasks}
                disabled={isGenerating}
                className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'جاري التوليد...' : 'توليد'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isGenerating}
                className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
              >
                إلغاء
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
