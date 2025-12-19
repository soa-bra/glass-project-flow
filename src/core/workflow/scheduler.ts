/**
 * جدولة مهام Workflow
 * يدعم التنفيذ المؤجل والمتكرر
 */

export interface ScheduledTask {
  id: string;
  workflowInstanceId: string;
  nodeId: string;
  executeAt: Date;
  type: 'delay' | 'timeout' | 'retry' | 'scheduled';
  data?: Record<string, unknown>;
  callback: () => void | Promise<void>;
}

class WorkflowScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private timers: Map<string, NodeJS.Timeout | number> = new Map();
  private isPaused = false;

  /**
   * جدولة مهمة جديدة
   */
  schedule(task: ScheduledTask): string {
    this.tasks.set(task.id, task);
    
    if (!this.isPaused) {
      this.startTimer(task);
    }
    
    return task.id;
  }

  /**
   * بدء مؤقت لمهمة
   */
  private startTimer(task: ScheduledTask): void {
    const delay = task.executeAt.getTime() - Date.now();
    
    if (delay <= 0) {
      // تنفيذ فوري
      this.executeTask(task);
      return;
    }
    
    const timer = setTimeout(() => {
      this.executeTask(task);
    }, delay);
    
    this.timers.set(task.id, timer);
  }

  /**
   * تنفيذ مهمة
   */
  private async executeTask(task: ScheduledTask): Promise<void> {
    try {
      await task.callback();
    } catch (error) {
      console.error(`خطأ في تنفيذ المهمة المجدولة ${task.id}:`, error);
    } finally {
      this.tasks.delete(task.id);
      this.timers.delete(task.id);
    }
  }

  /**
   * إلغاء مهمة
   */
  cancel(taskId: string): boolean {
    const timer = this.timers.get(taskId);
    
    if (timer) {
      clearTimeout(timer as NodeJS.Timeout);
      this.timers.delete(taskId);
    }
    
    return this.tasks.delete(taskId);
  }

  /**
   * إلغاء جميع مهام workflow معين
   */
  cancelWorkflow(workflowInstanceId: string): number {
    let cancelled = 0;
    
    for (const [taskId, task] of this.tasks) {
      if (task.workflowInstanceId === workflowInstanceId) {
        this.cancel(taskId);
        cancelled++;
      }
    }
    
    return cancelled;
  }

  /**
   * إيقاف مؤقت لجميع المهام
   */
  pause(): void {
    this.isPaused = true;
    
    for (const timer of this.timers.values()) {
      clearTimeout(timer as NodeJS.Timeout);
    }
    this.timers.clear();
  }

  /**
   * استئناف المهام المتوقفة
   */
  resume(): void {
    this.isPaused = false;
    
    for (const task of this.tasks.values()) {
      if (task.executeAt.getTime() > Date.now()) {
        this.startTimer(task);
      } else {
        // المهام المتأخرة تُنفذ فوراً
        this.executeTask(task);
      }
    }
  }

  /**
   * الحصول على المهام المعلقة
   */
  getPendingTasks(workflowInstanceId?: string): ScheduledTask[] {
    const tasks = Array.from(this.tasks.values());
    
    if (workflowInstanceId) {
      return tasks.filter(t => t.workflowInstanceId === workflowInstanceId);
    }
    
    return tasks;
  }

  /**
   * تنظيف جميع المهام
   */
  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer as NodeJS.Timeout);
    }
    this.tasks.clear();
    this.timers.clear();
  }

  /**
   * جدولة تأخير
   */
  scheduleDelay(
    workflowInstanceId: string,
    nodeId: string,
    delayMs: number,
    callback: () => void | Promise<void>
  ): string {
    const taskId = `delay-${workflowInstanceId}-${nodeId}-${Date.now()}`;
    
    return this.schedule({
      id: taskId,
      workflowInstanceId,
      nodeId,
      executeAt: new Date(Date.now() + delayMs),
      type: 'delay',
      callback
    });
  }

  /**
   * جدولة timeout
   */
  scheduleTimeout(
    workflowInstanceId: string,
    nodeId: string,
    timeoutMs: number,
    callback: () => void | Promise<void>
  ): string {
    const taskId = `timeout-${workflowInstanceId}-${nodeId}-${Date.now()}`;
    
    return this.schedule({
      id: taskId,
      workflowInstanceId,
      nodeId,
      executeAt: new Date(Date.now() + timeoutMs),
      type: 'timeout',
      callback
    });
  }

  /**
   * جدولة إعادة محاولة
   */
  scheduleRetry(
    workflowInstanceId: string,
    nodeId: string,
    retryDelayMs: number,
    retryCount: number,
    callback: () => void | Promise<void>
  ): string {
    const taskId = `retry-${workflowInstanceId}-${nodeId}-${retryCount}-${Date.now()}`;
    
    return this.schedule({
      id: taskId,
      workflowInstanceId,
      nodeId,
      executeAt: new Date(Date.now() + retryDelayMs),
      type: 'retry',
      data: { retryCount },
      callback
    });
  }
}

// Singleton instance
export const workflowScheduler = new WorkflowScheduler();
