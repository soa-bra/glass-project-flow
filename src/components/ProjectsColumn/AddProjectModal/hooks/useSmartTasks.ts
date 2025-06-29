
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
    const smartTasks: TaskData[] = [
      {
        id: Date.now() + 1,
        title: 'تحليل المتطلبات',
        description: 'تحليل وتوثيق متطلبات المشروع',
        assignee: projectData.manager || teamMembers[0],
        dueDate: projectData.startDate || new Date().toISOString().split('T')[0],
        priority: 'urgent-important',
        stage: 'planning',
        attachments: []
      },
      {
        id: Date.now() + 2,
        title: 'إعداد خطة العمل',
        description: 'وضع خطة زمنية تفصيلية للمشروع',
        assignee: projectData.manager || teamMembers[0],
        dueDate: projectData.startDate || new Date().toISOString().split('T')[0],
        priority: 'urgent-important',
        stage: 'planning',
        attachments: []
      },
      {
        id: Date.now() + 3,
        title: 'مراجعة الميزانية',
        description: 'مراجعة وتوزيع الميزانية على مراحل المشروع',
        assignee: projectData.team?.[0] || teamMembers[1],
        dueDate: projectData.startDate || new Date().toISOString().split('T')[0],
        priority: 'not-urgent-important',
        stage: 'planning',
        attachments: []
      }
    ];

    toast({
      title: "تم توليد المهام بنجاح",
      description: `تم إضافة ${smartTasks.length} مهام جديدة للمشروع`,
    });

    return smartTasks;
  };

  return { generateSmartTasks };
};
