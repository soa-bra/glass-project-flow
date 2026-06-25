
import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { Project } from '@/types/project';

interface SmartTaskGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksGenerated: (tasks: TaskData[]) => void;
  project: Project;
}

type TaskTypeId = 'planning' | 'development' | 'testing' | 'review' | 'design';

const taskTypes: { id: TaskTypeId; label: string }[] = [
  { id: 'planning', label: 'تخطيط' },
  { id: 'development', label: 'تطوير' },
  { id: 'testing', label: 'اختبار' },
  { id: 'review', label: 'مراجعة' },
  { id: 'design', label: 'تصميم' },
];

const defaultTaskTypes: TaskTypeId[] = ['planning', 'development', 'testing', 'review'];

const typeLabels = taskTypes.reduce<Record<TaskTypeId, string>>((labels, type) => {
  labels[type.id] = type.label;
  return labels;
}, {} as Record<TaskTypeId, string>);

const typePriorities: Record<TaskTypeId, TaskData['priority']> = {
  planning: 'urgent-important',
  development: 'urgent-important',
  testing: 'urgent-not-important',
  review: 'not-urgent-important',
  design: 'urgent-not-important',
};

const parseProjectDeadline = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getDueDate = (deadline: Date | null, index: number, total: number) => {
  const today = new Date();
  const dueDate = new Date(today);

  if (deadline && deadline > today) {
    const daysUntilDeadline = Math.max(1, Math.ceil((deadline.getTime() - today.getTime()) / 86400000));
    const step = Math.max(1, Math.floor(daysUntilDeadline / Math.max(total, 1)));
    dueDate.setDate(today.getDate() + Math.min(daysUntilDeadline, step * (index + 1)));
    return formatDate(dueDate);
  }

  dueDate.setDate(today.getDate() + (index + 1) * 3);
  return formatDate(dueDate);
};

const getProjectNeedSummary = (project: Project) => {
  const needs = [
    project.description?.trim(),
    project.hasOverdueTasks ? 'يوجد احتياج لمعالجة المهام المتأخرة' : '',
    project.isOverBudget ? 'يوجد احتياج لمراجعة أثر الميزانية على نطاق العمل' : '',
    project.daysLeft > 0 ? `المتبقي على الموعد ${project.daysLeft} يوم` : '',
  ].filter(Boolean);

  return needs.join('، ') || 'لا توجد تفاصيل وصفية كافية، لذلك تم الاعتماد على بيانات المشروع الأساسية';
};

const buildTaskTitle = (type: TaskTypeId, projectTitle: string, index: number) => {
  const titles: Record<TaskTypeId, string[]> = {
    planning: [
      `تحليل احتياجات ${projectTitle}`,
      `تثبيت نطاق ${projectTitle} ومعايير القبول`,
      `ترتيب أولويات تنفيذ ${projectTitle}`,
    ],
    design: [
      `تصميم تجربة ${projectTitle} حسب الاحتياج الفعلي`,
      `مراجعة واجهات ${projectTitle} مع أصحاب العلاقة`,
      `تحويل متطلبات ${projectTitle} إلى مخطط قابل للتنفيذ`,
    ],
    development: [
      `تنفيذ المسار الأساسي في ${projectTitle}`,
      `ربط مخرجات ${projectTitle} بالبيانات المطلوبة`,
      `إكمال تكاملات ${projectTitle} التشغيلية`,
    ],
    testing: [
      `اختبار سيناريوهات ${projectTitle} الحرجة`,
      `التحقق من جودة مخرجات ${projectTitle}`,
      `فحص حالات الحافة في ${projectTitle}`,
    ],
    review: [
      `مراجعة جاهزية ${projectTitle} للتسليم`,
      `اعتماد مخرجات ${projectTitle} مع الفريق`,
      `توثيق قرارات ${projectTitle} النهائية`,
    ],
  };

  const pool = titles[type];
  return pool[index % pool.length];
};

const buildTaskDescription = (type: TaskTypeId, project: Project, projectNeedSummary: string) => {
  const owner = project.owner || 'مالك المشروع';
  const teamNames = project.team?.map(member => member.name).filter(Boolean).join('، ') || 'فريق المشروع';
  const deadlineText = project.date ? `الموعد المرجعي: ${project.date}.` : 'لا يوجد موعد مرجعي محدد.';

  const descriptions: Record<TaskTypeId, string> = {
    planning: `تحويل احتياج المشروع إلى نطاق عمل واضح. الاحتياج: ${projectNeedSummary}. المسؤول المرجعي: ${owner}. ${deadlineText}`,
    design: `إعداد تصور عملي يخدم وصف المشروع واحتياجات المستخدمين، مع مراجعة المخرجات مع ${teamNames}. الاحتياج: ${projectNeedSummary}.`,
    development: `تنفيذ مهمة مرتبطة مباشرة ببيانات المشروع الحالية بدل الاعتماد على قالب عام. الاحتياج: ${projectNeedSummary}.`,
    testing: `اختبار المخرجات مقابل وصف المشروع وحالته الحالية، مع التركيز على المخاطر الظاهرة في بيانات المشروع. ${deadlineText}`,
    review: `مراجعة النتيجة مع ${owner} وتحديد ما إذا كانت تغلق احتياج المشروع أو تحتاج متابعة إضافية. الاحتياج: ${projectNeedSummary}.`,
  };

  return descriptions[type];
};

export const SmartTaskGenerationModal: React.FC<SmartTaskGenerationModalProps> = ({
  isOpen,
  onClose,
  onTasksGenerated,
  project,
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    taskCount: '',
    selectedTypes: [] as TaskTypeId[],
  });

  const projectNeedSummary = useMemo(() => getProjectNeedSummary(project), [project]);
  const projectTeam = useMemo(() => {
    const members = [project.owner, ...(project.team?.map(member => member.name) || [])].filter(Boolean);
    return members.length > 0 ? members : ['فريق المشروع'];
  }, [project.owner, project.team]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleTypeChange = (typeId: TaskTypeId, checked: boolean) => {
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
      const selectedTaskTypes = formData.selectedTypes.length > 0 ? formData.selectedTypes : defaultTaskTypes;
      const requestedCount = formData.taskCount ? parseInt(formData.taskCount, 10) : undefined;
      const taskCount = requestedCount || Math.min(12, Math.max(5, selectedTaskTypes.length * 2, Math.ceil((project.tasksCount || 0) / 2)));
      const safeTaskCount = Math.min(20, Math.max(1, taskCount));
      const deadline = parseProjectDeadline(project.date);
      const projectTitle = project.title?.trim() || 'المشروع';
      const generatedTasks: TaskData[] = [];

      await new Promise(resolve => setTimeout(resolve, 600));

      for (let i = 0; i < safeTaskCount; i++) {
        const taskType = selectedTaskTypes[i % selectedTaskTypes.length];
        const cycleIndex = Math.floor(i / selectedTaskTypes.length);
        const assignee = projectTeam[i % projectTeam.length];
        const priority = project.hasOverdueTasks && i < 2 ? 'urgent-important' : typePriorities[taskType];
        
        generatedTasks.push({
          id: Date.now() + i,
          title: buildTaskTitle(taskType, projectTitle, cycleIndex),
          description: buildTaskDescription(taskType, project, projectNeedSummary),
          priority,
          dueDate: getDueDate(deadline, i, safeTaskCount),
          stage: taskType as any,
          assignee,
          attachments: [],
          createdAt: new Date().toISOString(),
        });
      }

      onTasksGenerated(generatedTasks);

      toast({
        title: "تمّ توليد المهام بنجاح",
        description: `تم إنشاء ${safeTaskCount} مهمة مرتبطة ببيانات ${projectTitle}`,
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
                <p className="text-sm text-black/70 font-arabic">أنشئ مهام مرتبطة ببيانات المشروع واحتياجاته الحالية</p>
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
              <div className="rounded-lg border border-black/10 bg-white/35 p-4 text-right">
                <div className="text-sm font-bold text-black font-arabic mb-2">سياق المشروع المستخدم</div>
                <div className="space-y-1 text-sm text-black/70 font-arabic leading-relaxed">
                  <p>{project.title || 'مشروع بدون اسم'} — {project.owner || 'بدون مالك محدد'}</p>
                  <p>{projectNeedSummary}</p>
                  <p>الفريق: {projectTeam.join('، ')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-arabic text-right font-bold">عدد المهام التقريبي</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.taskCount}
                  onChange={(e) => handleInputChange('taskCount', e.target.value)}
                  className="text-right font-arabic h-12 px-4 py-3 rounded-full border border-black/20 bg-white/50 hover:bg-white/70 focus:bg-white transition-colors"
                  placeholder="حسب حجم المشروع (افتراضي)"
                />
              </div>

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
                        {typeLabels[type.id]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-arabic text-right bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {isGenerating && (
                <div className="flex items-center gap-2 justify-center text-gray-600 font-arabic">
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>جاري التوليد...</span>
                </div>
              )}
            </div>

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
