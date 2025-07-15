
import { TaskData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSmartTasks = () => {
  const { toast } = useToast();

  const generateSmartTasks = (
    projectData: { 
      manager: string; 
      startDate: string; 
      team: string[];
    },
    teamMembers: string[]
  ): TaskData[] => {
    const baseDate = new Date(projectData.startDate || new Date());
    const projectTeam = [projectData.manager, ...(projectData.team || [])].filter(Boolean);
    const allMembers = projectTeam.length > 0 ? projectTeam : teamMembers.length > 0 ? teamMembers : ['فريق المشروع'];

    const taskTemplates = [
      {
        title: 'تحليل المتطلبات وجمع البيانات',
        description: 'دراسة وتحليل متطلبات المشروع وجمع البيانات اللازمة لبدء التنفيذ',
        priority: 'urgent-important' as const,
        stage: 'planning' as const,
        daysOffset: 0
      },
      {
        title: 'إعداد خطة العمل التفصيلية',
        description: 'وضع خطة زمنية مفصلة للمشروع مع تحديد المعالم الرئيسية والموارد المطلوبة',
        priority: 'urgent-important' as const,
        stage: 'planning' as const,
        daysOffset: 2
      },
      {
        title: 'تصميم النموذج الأولي',
        description: 'إعداد النموذج الأولي أو التصميم المبدئي للمشروع',
        priority: 'urgent-not-important' as const,
        stage: 'development' as const,
        daysOffset: 5
      },
      {
        title: 'مراجعة الميزانية والموارد',
        description: 'مراجعة الميزانية المخصصة وتوزيعها على مراحل المشروع المختلفة',
        priority: 'not-urgent-important' as const,
        stage: 'planning' as const,
        daysOffset: 3
      },
      {
        title: 'إعداد البيئة التقنية',
        description: 'تحضير البيئة التقنية والأدوات اللازمة لتنفيذ المشروع',
        priority: 'urgent-not-important' as const,
        stage: 'development' as const,
        daysOffset: 7
      },
      {
        title: 'تنفيذ المرحلة الأولى',
        description: 'بدء تنفيذ المرحلة الأولى من المشروع وفقاً للخطة الموضوعة',
        priority: 'urgent-important' as const,
        stage: 'development' as const,
        daysOffset: 10
      }
    ];

    const smartTasks: TaskData[] = taskTemplates.map((template, index) => {
      const dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + template.daysOffset);
      
      return {
        id: Date.now() + index + 1,
        title: template.title,
        description: template.description,
        assignee: allMembers[index % allMembers.length],
        dueDate: dueDate.toISOString().split('T')[0],
        priority: template.priority,
        stage: template.stage,
        attachments: [],
        createdAt: new Date().toISOString()
      };
    });

    toast({
      title: "تم توليد المهام بنجاح",
      description: `تم إضافة ${smartTasks.length} مهام جديدة للمشروع`,
    });

    return smartTasks;
  };

  return { generateSmartTasks };
};
