
import { useState } from 'react';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  daysLeft: number;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'تصميم الواجهة',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '28 May',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 1,
      priority: 'urgent-not-important'
    },
    {
      id: 2,
      title: 'كتابة الكود',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '29 May',
      assignee: 'د. أسامة',
      members: 'عضو',
      daysLeft: 2,
      priority: 'urgent-important'
    },
    {
      id: 3,
      title: 'تطوير قواعد البيانات',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '01 Jun',
      assignee: 'د. أسامة',
      members: 'عضوين',
      daysLeft: 5,
      priority: 'not-urgent-important'
    },
    {
      id: 4,
      title: 'التسليم',
      description: 'تسليم الموقع النهائي',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '05 Jun',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 10,
      priority: 'not-urgent-not-important'
    }
  ]);

  const addTasks = (newTasks: any[]) => {
    const convertedTasks = newTasks.map(task => ({
      id: task.id || Date.now() + Math.random(),
      title: task.title,
      description: task.description || 'مهمة مولدة تلقائياً',
      status: 'جديد',
      statusColor: '#FFC107',
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
      assignee: task.assignee || 'غير محدد',
      members: 'غير مضيف',
      daysLeft: Math.ceil(Math.random() * 10) + 1,
      priority: task.priority || 'not-urgent-not-important'
    }));

    setTasks(prevTasks => [...prevTasks, ...convertedTasks]);
  };

  const addTask = (newTask: any) => {
    addTasks([newTask]);
  };

  return {
    tasks,
    addTask,
    addTasks
  };
};
