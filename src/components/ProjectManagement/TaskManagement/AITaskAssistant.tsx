import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  FileText,
  ListChecks,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { SmartTaskGenerationModal } from '@/components/ProjectManagement/cards/TaskList/SmartTaskGenerationModal';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { useToast } from '@/hooks/use-toast';
import type { TaskData } from '@/types';
import type { Project } from '@/types/project';
import { isTaskOverdue, type TaskFilters, type UnifiedTask } from '@/types/task';

interface AITaskAssistantProps {
  project: Project;
  projectId: string;
  tasks: UnifiedTask[];
  onTasksGenerated: (tasks: TaskData[]) => void;
  onFocusTasks?: (filters: TaskFilters, viewMode: 'kanban' | 'details') => void;
}

type AssistantFeatureId = 'calendar' | 'docs' | 'planner' | 'reschedule' | 'assign' | 'advisor';
type SuggestionPriority = 'urgent' | 'high' | 'medium' | 'normal';

type AssistantFeature = {
  id: AssistantFeatureId;
  title: string;
  description: string;
  metric: string;
  status: 'active' | 'warning';
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  onApply: () => void;
};

type AssistantSuggestion = {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: SuggestionPriority;
  onApply: () => void;
};

export const AITaskAssistant: React.FC<AITaskAssistantProps> = ({
  project,
  projectId,
  tasks,
  onTasksGenerated,
  onFocusTasks,
}) => {
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState<AssistantFeatureId | null>(null);
  const [showSmartGenerationModal, setShowSmartGenerationModal] = useState(false);

  const taskSignals = useMemo(() => {
    const overdue = tasks.filter(isTaskOverdue);
    const stopped = tasks.filter(task => task.status === 'stopped');
    const unassigned = tasks.filter(task => !task.assignee?.trim());
    const urgent = tasks.filter(task => task.priority === 'urgent');
    const inProgress = tasks.filter(task => task.status === 'in-progress');
    const completed = tasks.filter(task => task.status === 'completed');
    const withAttachments = tasks.filter(task => task.attachments > 0);
    const averageProgress = Math.round(
      tasks.reduce((total, task) => total + task.progress, 0) / Math.max(tasks.length, 1)
    );

    return {
      overdue,
      stopped,
      unassigned,
      urgent,
      inProgress,
      completed,
      withAttachments,
      averageProgress,
      riskCount: overdue.length + stopped.length + urgent.length,
    };
  }, [tasks]);

  const projectForGeneration = useMemo(
    () => ({ ...project, tasksCount: tasks.length }),
    [project, tasks.length]
  );

  const focusTasks = (filters: TaskFilters, viewMode: 'kanban' | 'details', title: string) => {
    onFocusTasks?.(filters, viewMode);
    toast({
      title,
      description: 'تم تطبيق التركيز على قائمة المهام الحالية.',
    });
  };

  const showInsight = (title: string, description: string) => {
    toast({ title, description });
  };

  const features: AssistantFeature[] = [
    {
      id: 'calendar',
      title: 'مساعد التقويم',
      description: 'يركز على المهام المتأخرة والمواعيد القريبة',
      metric: `${taskSignals.overdue.length} متأخرة`,
      status: taskSignals.overdue.length > 0 ? 'warning' : 'active',
      Icon: CalendarDays,
      onApply: () => focusTasks({ isOverdue: true }, 'kanban', 'تم عرض المهام المتأخرة'),
    },
    {
      id: 'docs',
      title: 'مساعد الوثائق',
      description: 'يفحص ارتباط المهام بالمرفقات والوثائق',
      metric: `${taskSignals.withAttachments.length} موثقة`,
      status: 'active',
      Icon: FileText,
      onApply: () => showInsight('تحليل الوثائق', `${taskSignals.withAttachments.length} من ${tasks.length} مهمة تحتوي على مرفقات.`),
    },
    {
      id: 'planner',
      title: 'مخطط المهام',
      description: 'يرتب الأولويات حسب حالة المهام الحالية',
      metric: `${taskSignals.urgent.length} عاجلة`,
      status: taskSignals.urgent.length > 0 ? 'warning' : 'active',
      Icon: Target,
      onApply: () => focusTasks({ priority: 'urgent' }, 'details', 'تم عرض المهام العاجلة'),
    },
    {
      id: 'reschedule',
      title: 'إعادة الجدولة',
      description: 'يراقب المهام المتوقفة والمتأخرة لإعادة التخطيط',
      metric: `${taskSignals.stopped.length + taskSignals.overdue.length} تحتاج متابعة`,
      status: taskSignals.stopped.length + taskSignals.overdue.length > 0 ? 'warning' : 'active',
      Icon: RefreshCw,
      onApply: () => focusTasks(taskSignals.stopped.length > 0 ? { status: 'stopped' } : { isOverdue: true }, 'kanban', 'تم عرض المهام التي تحتاج إعادة جدولة'),
    },
    {
      id: 'assign',
      title: 'التوزيع الذكي',
      description: 'يفحص المهام التي لا تملك مسؤولًا واضحًا',
      metric: `${taskSignals.unassigned.length} غير مسندة`,
      status: taskSignals.unassigned.length > 0 ? 'warning' : 'active',
      Icon: Users,
      onApply: () => showInsight('تحليل التوزيع', `${taskSignals.unassigned.length} مهمة لا يظهر لها مسؤول واضح.`),
    },
    {
      id: 'advisor',
      title: 'مستشار التأخير',
      description: 'يلخص إشارات الخطر من التأخير والتوقف والأولوية',
      metric: `${taskSignals.riskCount} إشارة`,
      status: taskSignals.riskCount > 0 ? 'warning' : 'active',
      Icon: AlertTriangle,
      onApply: () => focusTasks(taskSignals.overdue.length > 0 ? { isOverdue: true } : { status: 'stopped' }, 'details', 'تم عرض إشارات الخطر'),
    },
  ];

  const suggestions = useMemo<AssistantSuggestion[]>(() => {
    if (tasks.length === 0) {
      return [
        {
          id: 'generate-first-tasks',
          title: 'لا توجد مهام مرتبطة بهذا المشروع',
          description: 'يمكن توليد مهام أولية من وصف المشروع وموعده وفريقه بدل عرض اقتراحات عامة.',
          action: 'توليد مهام',
          priority: 'medium',
          onApply: () => setShowSmartGenerationModal(true),
        },
      ];
    }

    const items: AssistantSuggestion[] = [];

    if (taskSignals.overdue.length > 0) {
      items.push({
        id: 'overdue-tasks',
        title: 'توجد مهام متأخرة تحتاج متابعة',
        description: `${taskSignals.overdue.length} مهمة متأخرة أو تجاوزت موعدها داخل هذا المشروع.`,
        action: 'عرض المتأخرة',
        priority: 'urgent',
        onApply: () => focusTasks({ isOverdue: true }, 'kanban', 'تم عرض المهام المتأخرة'),
      });
    }

    if (taskSignals.unassigned.length > 0) {
      items.push({
        id: 'unassigned-tasks',
        title: 'توجد مهام بلا مسؤول واضح',
        description: `${taskSignals.unassigned.length} مهمة تحتاج إسنادًا قبل أن تصبح قابلة للمتابعة.`,
        action: 'تحليل التوزيع',
        priority: 'high',
        onApply: () => showInsight('تحليل التوزيع', 'راجع المهام التي لا يظهر لها مسؤول ثم أسندها من تفاصيل المهمة.'),
      });
    }

    if (taskSignals.stopped.length > 0) {
      items.push({
        id: 'stopped-tasks',
        title: 'هناك مهام متوقفة',
        description: `${taskSignals.stopped.length} مهمة في حالة توقف وتحتاج قرار متابعة أو إعادة جدولة.`,
        action: 'عرض المتوقفة',
        priority: 'high',
        onApply: () => focusTasks({ status: 'stopped' }, 'kanban', 'تم عرض المهام المتوقفة'),
      });
    }

    if (taskSignals.averageProgress < 50 && taskSignals.inProgress.length > 0) {
      items.push({
        id: 'low-progress',
        title: 'معدل الإنجاز منخفض مقارنة بالمهام الجارية',
        description: `معدل الإنجاز الحالي ${taskSignals.averageProgress}% مع ${taskSignals.inProgress.length} مهمة قيد التنفيذ.`,
        action: 'عرض الجارية',
        priority: 'medium',
        onApply: () => focusTasks({ status: 'in-progress' }, 'details', 'تم عرض المهام الجارية'),
      });
    }

    if (items.length === 0) {
      items.push({
        id: 'healthy-plan',
        title: 'لا توجد إشارات خطر مباشرة في المهام الحالية',
        description: `${taskSignals.completed.length} من ${tasks.length} مهمة مكتملة، ومعدل الإنجاز ${taskSignals.averageProgress}%.`,
        action: 'تحليل الأداء',
        priority: 'normal',
        onApply: () => showInsight('تحليل الأداء', `معدل الإنجاز الحالي ${taskSignals.averageProgress}% داخل ${tasks.length} مهمة.`),
      });
    }

    return items.slice(0, 3);
  }, [tasks, taskSignals]);

  const getPriorityColor = (priority: SuggestionPriority) => {
    switch (priority) {
      case 'urgent': return '#f1b5b9';
      case 'high': return '#fbe2aa';
      case 'medium': return '#a4e2f6';
      default: return '#bdeed3';
    }
  };

  const handleFeatureClick = (feature: AssistantFeature) => {
    setActiveFeature(activeFeature === feature.id ? null : feature.id);
    feature.onApply();
  };

  const handleTasksGenerated = (generatedTasks: TaskData[]) => {
    onTasksGenerated(generatedTasks.map(task => ({ ...task, projectId })));
  };

  return (
    <>
      <AppCardSurface density="standard">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">مساعد الذكاء الاصطناعي</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#bdeed3] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-black">متصل بالمهام</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {features.map(feature => {
            const Icon = feature.Icon;
            return (
              <button
                key={feature.id}
                type="button"
                className={`text-start p-4 bg-transparent border border-black/10 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  activeFeature === feature.id ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className="text-black" />
                  <span
                    className="text-[11px] font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: feature.status === 'warning' ? '#fbe2aa' : '#bdeed3' }}
                  >
                    {feature.metric}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-black mb-1">{feature.title}</h4>
                <p className="text-xs font-normal text-gray-400">{feature.description}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-black">الاقتراحات الذكية</h4>
          {suggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className="flex items-center justify-between gap-4 p-4 bg-transparent border border-black/10 rounded-2xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getPriorityColor(suggestion.priority) }} />
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-black">{suggestion.title}</h5>
                  <p className="text-xs font-normal text-gray-400">{suggestion.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={suggestion.onApply}
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors whitespace-nowrap"
              >
                {suggestion.action}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-black/10">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowSmartGenerationModal(true)}
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              <Sparkles size={14} />
              إنشاء مهام بالذكاء الاصطناعي
            </button>
            <button
              type="button"
              onClick={() => showInsight('تحليل الأداء', `معدل الإنجاز ${taskSignals.averageProgress}% من ${tasks.length} مهمة.`)}
              className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors flex items-center gap-2"
            >
              <BarChart3 size={14} />
              تحليل الأداء
            </button>
            <button
              type="button"
              onClick={() => features.find(feature => feature.id === 'assign')?.onApply()}
              className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors flex items-center gap-2"
            >
              <ListChecks size={14} />
              تحسين التوزيع
            </button>
          </div>
        </div>
      </AppCardSurface>

      <SmartTaskGenerationModal
        isOpen={showSmartGenerationModal}
        onClose={() => setShowSmartGenerationModal(false)}
        onTasksGenerated={handleTasksGenerated}
        project={projectForGeneration}
      />
    </>
  );
};
