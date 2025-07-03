import React, { useState, useRef } from 'react';
import { TaskCard } from './TaskCard';
import { AddTaskButton } from './AddTaskButton';
import { BulkActionsBar } from './BulkActionsBar';

interface KanbanColumn {
  name: string;
  color: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  tags: string[];
  attachments: number;
  comments: number;
  linkedTasks: string[];
}

interface KanbanBoardProps {
  projectId: string;
  filters: {
    assignee: string;
    priority: string;
    status: string;
    search: string;
  };
}

const columns: KanbanColumn[] = [
  { name: "To-Do", color: "#dfecf2", description: "المهام المجدولة" },
  { name: "Stopped", color: "#f1b5b9", description: "المهام المتوقفة" },
  { name: "Treating", color: "#d9d2fd", description: "المهام تحت المعالجة" },
  { name: "Late", color: "#fbe2aa", description: "المهام المتأخرة" },
  { name: "In Progress", color: "#a4e2f6", description: "المهام الجارية" },
  { name: "Done", color: "#bdeed3", description: "المهام المكتملة" }
];

// Mock data for tasks
const mockTasks: Record<string, Task[]> = {
  "To-Do": [
    {
      id: "1",
      title: "تصميم واجهة المستخدم الرئيسية",
      description: "إنشاء تصميم متجاوب للصفحة الرئيسية",
      assignee: "فاطمة علي",
      priority: "high",
      dueDate: "2024-02-15",
      tags: ["تصميم", "UI/UX"],
      attachments: 3,
      comments: 2,
      linkedTasks: ["2", "3"]
    },
    {
      id: "2",
      title: "إعداد قاعدة البيانات",
      description: "تكوين قاعدة البيانات وجداول المستخدمين",
      assignee: "أحمد محمد",
      priority: "medium",
      dueDate: "2024-02-20",
      tags: ["Backend", "Database"],
      attachments: 1,
      comments: 5,
      linkedTasks: ["1"]
    }
  ],
  "In Progress": [
    {
      id: "3",
      title: "تطوير API المصادقة",
      description: "بناء نظام تسجيل الدخول والمصادقة",
      assignee: "محمد خالد",
      priority: "high",
      dueDate: "2024-02-18",
      tags: ["Backend", "Security"],
      attachments: 2,
      comments: 3,
      linkedTasks: ["2"]
    }
  ],
  "Late": [
    {
      id: "4",
      title: "اختبار الأمان",
      description: "إجراء اختبارات الأمان الشاملة",
      assignee: "نورا سعد",
      priority: "urgent",
      dueDate: "2024-02-10",
      tags: ["Testing", "Security"],
      attachments: 0,
      comments: 8,
      linkedTasks: []
    }
  ],
  "Done": [
    {
      id: "5",
      title: "إعداد بيئة التطوير",
      description: "تكوين البيئة والأدوات المطلوبة",
      assignee: "أحمد محمد",
      priority: "medium",
      dueDate: "2024-02-05",
      tags: ["DevOps", "Setup"],
      attachments: 1,
      comments: 1,
      linkedTasks: []
    }
  ],
  "Stopped": [],
  "Treating": []
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, filters }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string>("");

  const handleDragStart = (task: Task, fromColumn: string) => {
    setDraggedTask(task);
    setDraggedFrom(fromColumn);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault();
    if (draggedTask && draggedFrom !== toColumn) {
      // Here you would update the task status in your data store
      console.log(`Moving task ${draggedTask.id} from ${draggedFrom} to ${toColumn}`);
    }
    setDraggedTask(null);
    setDraggedFrom("");
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const filteredTasks = (columnTasks: Task[]) => {
    return columnTasks.filter(task => {
      if (filters.assignee && !task.assignee.includes(filters.assignee)) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedTasks.length > 0 && (
        <BulkActionsBar 
          selectedCount={selectedTasks.length}
          onClearSelection={() => setSelectedTasks([])}
        />
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px]">
        {columns.map(column => (
          <div
            key={column.name}
            className="bg-[#F2FFFF] rounded-3xl border border-black/10 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.name)}
          >
            {/* Column Header */}
            <div 
              className="p-4 rounded-t-3xl border-b border-black/10"
              style={{ backgroundColor: column.color }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-black">{column.name}</h3>
                <span className="text-xs font-normal text-gray-400">
                  {filteredTasks(mockTasks[column.name] || []).length}
                </span>
              </div>
              <p className="text-xs font-normal text-gray-400">{column.description}</p>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 p-4 space-y-3 min-h-[400px]">
              {filteredTasks(mockTasks[column.name] || []).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTasks.includes(task.id)}
                  onSelect={() => handleTaskSelect(task.id)}
                  onDragStart={() => handleDragStart(task, column.name)}
                />
              ))}
              
              {/* Add Task Button */}
              <AddTaskButton column={column.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};