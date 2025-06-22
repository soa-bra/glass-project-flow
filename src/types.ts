
export interface TaskData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  stage: 'planning' | 'development' | 'testing' | 'review' | 'completed';
  attachments: string[];
  createdAt?: string;
}

export interface ProjectData {
  id: number;
  name: string;
  description: string;
  owner: string;
  deadline: string;
  team: string[];
}
