import type { 
  KanbanBoard, 
  KanbanTask, 
  WIPLimit, 
  SLARule, 
  KanbanMetrics,
  TaskStatus,
  WIPViolation,
  SLAViolation
} from '@/types/kanban';

// Mock data for development
const mockBoard: KanbanBoard = {
  id: 'board-1',
  name: 'Main Project Board',
  projectId: 'project-1',
  columns: [
    { id: 'col-1', status: 'backlog', title: 'قائمة المهام', order: 0, tasks: [] },
    { id: 'col-2', status: 'todo', title: 'للتنفيذ', order: 1, tasks: [] },
    { id: 'col-3', status: 'in_progress', title: 'قيد التنفيذ', order: 2, tasks: [] },
    { id: 'col-4', status: 'in_review', title: 'قيد المراجعة', order: 3, tasks: [] },
    { id: 'col-5', status: 'done', title: 'مكتمل', order: 4, tasks: [] }
  ],
  wipLimits: [
    { id: 'wip-1', boardId: 'board-1', status: 'in_progress', limit: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'wip-2', boardId: 'board-1', status: 'in_review', limit: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ],
  slaRules: [
    {
      id: 'sla-1',
      boardId: 'board-1',
      priority: 'high',
      statusTransitions: [
        { from: 'todo', to: 'in_progress', maxMinutes: 60 },
        { from: 'in_progress', to: 'in_review', maxMinutes: 480 },
        { from: 'in_review', to: 'done', maxMinutes: 120 }
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockTasks: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'تصميم واجهة المستخدم',
    description: 'إنشاء تصميم للصفحة الرئيسية',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-1',
    projectId: 'project-1',
    boardId: 'board-1',
    estimatedHours: 8,
    actualHours: 4,
    tags: ['ui', 'design'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    movedAt: new Date(Date.now() - 3600000).toISOString(),
    slaViolations: []
  }
];

export class KanbanService {
  // Mock implementation - replace with actual API calls when Supabase is integrated
  
  async getBoard(boardId: string): Promise<KanbanBoard> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const board = { ...mockBoard };
    board.columns = board.columns.map(col => ({
      ...col,
      tasks: mockTasks.filter(task => task.status === col.status),
      wipLimit: board.wipLimits.find(wip => wip.status === col.status)
    }));
    
    return board;
  }

  async moveTask(taskId: string, newStatus: TaskStatus): Promise<KanbanTask> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check WIP limits
    const wipViolations = await this.checkWIPLimits('board-1', newStatus, taskId);
    if (wipViolations.length > 0 && !wipViolations[0].canAdd) {
      throw new Error(`WIP limit exceeded for ${newStatus}`);
    }

    const oldStatus = task.status;
    task.status = newStatus;
    task.movedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();

    // Check SLA violations
    await this.checkSLAViolations(taskId, oldStatus, newStatus);

    return task;
  }

  async checkWIPLimits(boardId: string, status: TaskStatus, excludeTaskId?: string): Promise<WIPViolation[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const wipLimit = mockBoard.wipLimits.find(wip => wip.status === status && wip.isActive);
    if (!wipLimit) {
      return [];
    }

    const tasksInStatus = mockTasks.filter(task => 
      task.status === status && task.id !== excludeTaskId
    );
    
    const currentCount = tasksInStatus.length;
    const canAdd = currentCount < wipLimit.limit;

    if (!canAdd) {
      return [{
        status,
        currentCount,
        limit: wipLimit.limit,
        canAdd
      }];
    }

    return [];
  }

  async checkSLAViolations(taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus): Promise<SLAViolation[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return [];

    const slaRule = mockBoard.slaRules.find(rule => 
      rule.isActive && 
      rule.priority === task.priority &&
      rule.statusTransitions.some(t => t.from === fromStatus && t.to === toStatus)
    );

    if (!slaRule) return [];

    const transition = slaRule.statusTransitions.find(t => t.from === fromStatus && t.to === toStatus);
    if (!transition) return [];

    const movedAt = new Date(task.movedAt);
    const now = new Date();
    const actualMinutes = Math.floor((now.getTime() - movedAt.getTime()) / (1000 * 60));

    if (actualMinutes > transition.maxMinutes) {
      const violation: SLAViolation = {
        id: Date.now().toString(),
        taskId,
        ruleId: slaRule.id,
        fromStatus,
        toStatus,
        expectedMinutes: transition.maxMinutes,
        actualMinutes,
        isResolved: false,
        createdAt: new Date().toISOString()
      };

      task.slaViolations.push(violation);
      return [violation];
    }

    return [];
  }

  async getMetrics(boardId: string): Promise<KanbanMetrics> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const wipViolations = await Promise.all(
      mockBoard.wipLimits.map(async (wip) => {
        const violations = await this.checkWIPLimits(boardId, wip.status);
        return violations;
      })
    );

    return {
      totalTasks: mockTasks.length,
      wipViolations: wipViolations.flat(),
      slaViolations: mockTasks.reduce((sum, task) => sum + task.slaViolations.length, 0),
      averageCycleTime: 240, // TODO: Calculate actual cycle time
      throughput: 5 // TODO: Calculate actual throughput
    };
  }

  async updateWIPLimit(boardId: string, status: TaskStatus, limit: number): Promise<WIPLimit> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const wipLimit = mockBoard.wipLimits.find(wip => wip.boardId === boardId && wip.status === status);
    if (wipLimit) {
      wipLimit.limit = limit;
      wipLimit.updatedAt = new Date().toISOString();
      return wipLimit;
    }

    const newWipLimit: WIPLimit = {
      id: Date.now().toString(),
      boardId,
      status,
      limit,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockBoard.wipLimits.push(newWipLimit);
    return newWipLimit;
  }
}

export const kanbanService = new KanbanService();