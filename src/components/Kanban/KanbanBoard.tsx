import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, Users, Settings, BarChart3 } from 'lucide-react';
import { useKanban } from '@/hooks/useKanban';
import { useToast } from '@/hooks/use-toast';
import type { TaskStatus, KanbanTask } from '@/types/kanban';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const { board, metrics, wipViolations, loading, error, actions } = useKanban(boardId);
  const { toast } = useToast();
  const [showMetrics, setShowMetrics] = useState(false);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !board) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;

    try {
      await actions.moveTask(draggableId, newStatus);
      toast({
        title: "تم نقل المهمة",
        description: "تم نقل المهمة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في النقل",
        description: error instanceof Error ? error.message : "فشل في نقل المهمة",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusTitle = (status: TaskStatus) => {
    const titles = {
      backlog: 'قائمة المهام',
      todo: 'للتنفيذ',
      in_progress: 'قيد التنفيذ',
      in_review: 'قيد المراجعة',
      done: 'مكتمل'
    };
    return titles[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{error || 'لم يتم العثور على اللوحة'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with metrics toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-right">{board.name}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
          >
            <BarChart3 className="h-4 w-4 ml-1" />
            {showMetrics ? 'إخفاء المقاييس' : 'عرض المقاييس'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 ml-1" />
            إعدادات
          </Button>
        </div>
      </div>

      {/* Metrics panel */}
      {showMetrics && metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">مقاييس الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{metrics.totalTasks}</p>
                <p className="text-sm text-muted-foreground">إجمالي المهام</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{metrics.slaViolations}</p>
                <p className="text-sm text-muted-foreground">انتهاكات SLA</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{metrics.averageCycleTime}</p>
                <p className="text-sm text-muted-foreground">متوسط وقت الدورة (دقيقة)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{metrics.throughput}</p>
                <p className="text-sm text-muted-foreground">الإنتاجية الأسبوعية</p>
              </div>
            </div>
            
            {wipViolations.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">تحذيرات حدود WIP:</span>
                </div>
                <ul className="mt-2 text-sm text-yellow-700">
                  {wipViolations.map((violation, index) => (
                    <li key={index}>
                      {getStatusTitle(violation.status)}: {violation.currentCount}/{violation.limit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              wipViolations={wipViolations}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

interface KanbanColumnProps {
  column: any;
  wipViolations: any[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, wipViolations }) => {
  const wipViolation = wipViolations.find(v => v.status === column.status);
  const isOverLimit = wipViolation && !wipViolation.canAdd;

  const getStatusTitle = (status: TaskStatus) => {
    const titles = {
      backlog: 'قائمة المهام',
      todo: 'للتنفيذ',
      in_progress: 'قيد التنفيذ',
      in_review: 'قيد المراجعة',
      done: 'مكتمل'
    };
    return titles[status] || status;
  };

  return (
    <Card className={`${isOverLimit ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-right">
            {getStatusTitle(column.status)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
            {column.wipLimit && (
              <Badge 
                variant={isOverLimit ? "destructive" : "outline"} 
                className="text-xs"
              >
                WIP: {column.tasks.length}/{column.wipLimit.limit}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <CardContent
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] space-y-2 ${
              snapshot.isDraggingOver ? 'bg-muted/50' : ''
            }`}
          >
            {column.tasks.map((task: KanbanTask, index: number) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? 'opacity-75' : ''
                    }`}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
};

interface TaskCardProps {
  task: KanbanTask;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const hasSLAViolation = task.slaViolations.some(v => !v.isResolved);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-right flex-1 leading-tight">
              {task.title}
            </h4>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0 mr-2 mt-1`} />
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground text-right line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              {hasSLAViolation && (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
              {task.estimatedHours && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours}س</span>
                </div>
              )}
            </div>
            
            {task.assigneeId && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>مُكلف</span>
              </div>
            )}
          </div>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-right">
            آخر تحديث: {format(new Date(task.updatedAt), 'dd/MM HH:mm', { locale: ar })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanBoard;