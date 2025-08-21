export interface UnifiedTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed' | 'stopped' | 'treating' | 'late';
  tags: string[];
  attachments: number;
  comments: number;
  linkedTasks: string[];
  progress: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  assignee?: string;
  priority?: string;
  status?: string;
  search?: string;
}

// Mapping functions
export const mapToTaskCardProps = (task: UnifiedTask) => {
  const dueDate = new Date(task.dueDate);
  const daysLeft = Math.max(
    Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    0
  );

  // Map priority to old format
  const priorityMap = {
    urgent: 'urgent-important',
    high: 'urgent-not-important', 
    medium: 'not-urgent-important',
    low: 'not-urgent-not-important'
  } as const;

  // Map status to display
  const statusMap = {
    completed: 'منجزة',
    'in-progress': 'قيد التنفيذ', 
    todo: 'لم تبدأ',
    stopped: 'متوقفة',
    treating: 'تحت المعالجة',
    late: 'متأخرة'
  };

  const statusColorMap = {
    completed: '#bdeed3',
    'in-progress': '#a4e2f6',
    todo: '#dfecf2', 
    stopped: '#f1b5b9',
    treating: '#d9d2fd',
    late: '#fbe2aa'
  };

  return {
    id: parseInt(task.id),
    title: task.title,
    description: task.description,
    status: statusMap[task.status] || 'غير محدد',
    statusColor: statusColorMap[task.status] || '#dfecf2',
    date: dueDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short'
    }),
    assignee: task.assignee || 'غير محدد',
    members: task.attachments > 0 ? `${task.attachments} مرفقات` : 'غير مضيف',
    daysLeft,
    priority: priorityMap[task.priority] || 'not-urgent-not-important'
  };
};

export const mapFromTaskData = (taskData: any): UnifiedTask => {
  return {
    id: taskData.id?.toString() || Math.random().toString(),
    title: taskData.title || '',
    description: taskData.description || '',
    assignee: taskData.assignee || '',
    priority: taskData.priority === 'urgent-important' ? 'urgent' :
             taskData.priority === 'urgent-not-important' ? 'high' :
             taskData.priority === 'not-urgent-important' ? 'medium' : 'low',
    dueDate: taskData.dueDate || new Date().toISOString(),
    status: 'todo',
    tags: taskData.tags || [],
    attachments: taskData.attachments || 0,
    comments: taskData.comments || 0,
    linkedTasks: taskData.linkedTasks || [],
    progress: 0,
    projectId: taskData.projectId || '',
    createdAt: taskData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};