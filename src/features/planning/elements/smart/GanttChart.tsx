import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Calendar, ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  color: string;
  dependencies: string[];
  assignee?: string;
}

interface GanttChartData {
  tasks: GanttTask[];
  viewMode: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
}

interface GanttChartProps {
  data: GanttChartData;
  onUpdate: (data: Partial<GanttChartData>) => void;
}

const TASK_COLORS = [
  'hsl(var(--accent-green))',
  'hsl(var(--accent-blue))',
  'hsl(var(--accent-yellow))',
  'hsl(var(--accent-red))',
  '#8B5CF6',
  '#EC4899',
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const GanttChart: React.FC<GanttChartProps> = ({ data, onUpdate }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const tasks = data.tasks || [];
  const viewMode = data.viewMode || 'week';

  // Calculate date range
  const getDateRange = () => {
    const today = new Date();
    const start = new Date(data.startDate || today.toISOString().split('T')[0]);
    const end = new Date(data.endDate || new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    return { start, end };
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();

  // Generate time columns based on view mode
  const getTimeColumns = () => {
    const columns: { date: Date; label: string }[] = [];
    const current = new Date(rangeStart);
    
    while (current <= rangeEnd) {
      if (viewMode === 'day') {
        columns.push({ 
          date: new Date(current), 
          label: current.getDate().toString() 
        });
        current.setDate(current.getDate() + 1);
      } else if (viewMode === 'week') {
        columns.push({ 
          date: new Date(current), 
          label: `أ${Math.ceil(current.getDate() / 7)}` 
        });
        current.setDate(current.getDate() + 7);
      } else {
        columns.push({ 
          date: new Date(current), 
          label: current.toLocaleDateString('ar-SA', { month: 'short' }) 
        });
        current.setMonth(current.getMonth() + 1);
      }
    }
    return columns;
  };

  const timeColumns = getTimeColumns();

  const addTask = () => {
    if (!newTaskName.trim()) return;
    
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const newTask: GanttTask = {
      id: generateId(),
      name: newTaskName,
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      progress: 0,
      color: TASK_COLORS[tasks.length % TASK_COLORS.length],
      dependencies: [],
    };
    
    onUpdate({ tasks: [...tasks, newTask] });
    setNewTaskName('');
  };

  const deleteTask = (taskId: string) => {
    onUpdate({ 
      tasks: tasks.filter(t => t.id !== taskId).map(t => ({
        ...t,
        dependencies: t.dependencies.filter(d => d !== taskId)
      }))
    });
  };

  const updateTask = (taskId: string, updates: Partial<GanttTask>) => {
    onUpdate({
      tasks: tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    });
  };

  const calculateTaskPosition = (task: GanttTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const totalDays = (rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000);
    const startOffset = (taskStart.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000);
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (24 * 60 * 60 * 1000);
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const shiftDateRange = (direction: 'prev' | 'next') => {
    const shift = viewMode === 'day' ? 7 : viewMode === 'week' ? 30 : 90;
    const multiplier = direction === 'prev' ? -1 : 1;
    
    const newStart = new Date(rangeStart.getTime() + shift * multiplier * 24 * 60 * 60 * 1000);
    const newEnd = new Date(rangeEnd.getTime() + shift * multiplier * 24 * 60 * 60 * 1000);
    
    onUpdate({
      startDate: newStart.toISOString().split('T')[0],
      endDate: newEnd.toISOString().split('T')[0]
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">مخطط جانت</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => shiftDateRange('prev')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => onUpdate({ viewMode: mode })}
              >
                {mode === 'day' ? 'يوم' : mode === 'week' ? 'أسبوع' : 'شهر'}
              </Button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => shiftDateRange('next')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Task */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <Input
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="اسم المهمة الجديدة..."
          className="flex-1 h-8 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <Button size="sm" className="h-8" onClick={addTask}>
          <Plus className="h-4 w-4 ml-1" />
          إضافة
        </Button>
      </div>

      {/* Chart */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[600px]">
          {/* Timeline Header */}
          <div className="flex border-b border-border sticky top-0 bg-background z-10">
            <div className="w-48 shrink-0 p-2 border-l border-border font-medium text-sm text-muted-foreground">
              المهمة
            </div>
            <div className="flex-1 flex">
              {timeColumns.map((col, idx) => (
                <div
                  key={idx}
                  className="flex-1 p-2 text-center text-xs text-muted-foreground border-l border-border"
                >
                  {col.label}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              أضف مهام لعرضها على المخطط
            </div>
          ) : (
            tasks.map((task) => {
              const position = calculateTaskPosition(task);
              const isSelected = selectedTask === task.id;
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex border-b border-border hover:bg-muted/30 transition-colors",
                    isSelected && "bg-muted/50"
                  )}
                  onClick={() => setSelectedTask(task.id)}
                >
                  {/* Task Name */}
                  <div className="w-48 shrink-0 p-2 border-l border-border flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: task.color }}
                    />
                    <span className="text-sm truncate flex-1">{task.name}</span>
                    {task.dependencies.length > 0 && (
                      <Link2 className="h-3 w-3 text-muted-foreground" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  
                  {/* Gantt Bar */}
                  <div className="flex-1 relative h-10 flex items-center">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex">
                      {timeColumns.map((_, idx) => (
                        <div
                          key={idx}
                          className="flex-1 border-l border-border"
                        />
                      ))}
                    </div>
                    
                    {/* Task Bar */}
                    <div
                      className="absolute h-6 rounded-md cursor-pointer transition-all hover:opacity-80"
                      style={{
                        left: position.left,
                        width: position.width,
                        backgroundColor: task.color,
                        minWidth: '20px'
                      }}
                    >
                      {/* Progress */}
                      <div
                        className="h-full rounded-md bg-black/20"
                        style={{ width: `${task.progress}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Details Panel */}
      {selectedTask && (
        <div className="border-t border-border p-3 bg-panel">
          {(() => {
            const task = tasks.find(t => t.id === selectedTask);
            if (!task) return null;
            
            return (
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">البداية:</label>
                  <Input
                    type="date"
                    value={task.startDate}
                    onChange={(e) => updateTask(task.id, { startDate: e.target.value })}
                    className="h-7 text-xs w-32"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">النهاية:</label>
                  <Input
                    type="date"
                    value={task.endDate}
                    onChange={(e) => updateTask(task.id, { endDate: e.target.value })}
                    className="h-7 text-xs w-32"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">التقدم:</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => updateTask(task.id, { progress: Number(e.target.value) })}
                    className="h-7 text-xs w-16"
                  />
                  <span className="text-xs">%</span>
                </div>
                <div className="flex items-center gap-1">
                  {TASK_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-all",
                        task.color === color ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => updateTask(task.id, { color })}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
