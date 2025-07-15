import { useState, useEffect } from 'react';
import { UnifiedTask, TaskFilters, mapFromTaskData } from '@/types/task';

// Mock data - في التطبيق الحقيقي سيأتي من API
const generateMockTasks = (projectId: string): UnifiedTask[] => [
  {
    id: `${projectId}-1`,
    title: "تصميم واجهة المستخدم الرئيسية",
    description: "إنشاء تصميم متجاوب للصفحة الرئيسية",
    assignee: "فاطمة علي",
    priority: "high",
    dueDate: "2024-02-15T00:00:00Z",
    status: "todo",
    tags: ["تصميم", "UI/UX"],
    attachments: 3,
    comments: 2,
    linkedTasks: [`${projectId}-2`, `${projectId}-3`],
    progress: 0,
    projectId,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: `${projectId}-2`,
    title: "إعداد قاعدة البيانات",
    description: "تكوين قاعدة البيانات وجداول المستخدمين",
    assignee: "أحمد محمد",
    priority: "medium",
    dueDate: "2024-02-20T00:00:00Z",
    status: "todo",
    tags: ["Backend", "Database"],
    attachments: 1,
    comments: 5,
    linkedTasks: [`${projectId}-1`],
    progress: 0,
    projectId,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: `${projectId}-3`,
    title: "تطوير API المصادقة",
    description: "بناء نظام تسجيل الدخول والمصادقة",
    assignee: "محمد خالد",
    priority: "high",
    dueDate: "2024-02-18T00:00:00Z",
    status: "in-progress",
    tags: ["Backend", "Security"],
    attachments: 2,
    comments: 3,
    linkedTasks: [`${projectId}-2`],
    progress: 45,
    projectId,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  },
  {
    id: `${projectId}-4`,
    title: "اختبار الأمان",
    description: "إجراء اختبارات الأمان الشاملة",
    assignee: "نورا سعد",
    priority: "urgent",
    dueDate: "2024-02-10T00:00:00Z",
    status: "late",
    tags: ["Testing", "Security"],
    attachments: 0,
    comments: 8,
    linkedTasks: [],
    progress: 10,
    projectId,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: `${projectId}-5`,
    title: "إعداد بيئة التطوير",
    description: "تكوين البيئة والأدوات المطلوبة",
    assignee: "أحمد محمد",
    priority: "medium",
    dueDate: "2024-02-05T00:00:00Z",
    status: "completed",
    tags: ["DevOps", "Setup"],
    attachments: 1,
    comments: 1,
    linkedTasks: [],
    progress: 100,
    projectId,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z"
  },
  {
    id: `${projectId}-6`,
    title: "تحليل المتطلبات",
    description: "دراسة وتحليل متطلبات المشروع",
    assignee: "أحمد محمد",
    priority: "high",
    dueDate: "2024-01-10T00:00:00Z",
    status: "completed",
    tags: ["Analysis", "Requirements"],
    attachments: 2,
    comments: 4,
    linkedTasks: [],
    progress: 100,
    projectId,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  }
];

export const useUnifiedTasks = (projectId: string) => {
  const [allTasks, setAllTasks] = useState<Record<string, UnifiedTask[]>>({});
  
  useEffect(() => {
    if (projectId && !allTasks[projectId]) {
      setAllTasks(prev => ({
        ...prev,
        [projectId]: generateMockTasks(projectId)
      }));
    }
  }, [projectId, allTasks]);

  // دالة لدمج المهام من ProjectTasksContext
  const mergeTasks = (additionalTasks: any[]) => {
    if (!additionalTasks || additionalTasks.length === 0) return;
    
    const convertedTasks = additionalTasks.map(task => mapFromTaskData(task));
    
    setAllTasks(prev => {
      const existingTasks = prev[projectId] || [];
      const newTasks = convertedTasks.filter(newTask => 
        !existingTasks.some(existing => existing.id === newTask.id)
      );
      
      return {
        ...prev,
        [projectId]: [...existingTasks, ...newTasks]
      };
    });
  };

  const getProjectTasks = (filters?: TaskFilters): UnifiedTask[] => {
    const tasks = allTasks[projectId] || [];
    
    if (!filters) return tasks;

    return tasks.filter(task => {
      if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const getTasksByStatus = (status: UnifiedTask['status'], filters?: TaskFilters): UnifiedTask[] => {
    return getProjectTasks(filters).filter(task => task.status === status);
  };

  const addTask = (task: Omit<UnifiedTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    const newTask: UnifiedTask = {
      ...task,
      id: `${projectId}-${Date.now()}`,
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAllTasks(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newTask]
    }));

    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<UnifiedTask>) => {
    setAllTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    }));
  };

  const updateTaskStatus = (taskId: string, status: UnifiedTask['status']) => {
    updateTask(taskId, { 
      status, 
      progress: status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0 
    });
  };

  const removeTask = (taskId: string) => {
    setAllTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(task => task.id !== taskId)
    }));
  };

  return {
    tasks: getProjectTasks(),
    getProjectTasks,
    getTasksByStatus,
    addTask,
    updateTask,
    updateTaskStatus,
    removeTask,
    mergeTasks
  };
};