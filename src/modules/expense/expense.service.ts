// Expense Service with Approvals Integration
import { prisma, Expense } from '@/lib/prisma';
import { createApprovalRequest, enhancedApprovalsService } from '@/shared/services/approvals';

export class ExpenseService {
  constructor() {
    // Listen for approval events to update expense status
    enhancedApprovalsService.onApprovalEvent((event) => {
      if (event.action === 'approved') {
        this.handleApprovalEvent(event.requestId, 'approved');
      } else if (event.action === 'rejected') {
        this.handleApprovalEvent(event.requestId, 'rejected');
      }
    });
  }

  async submitExpense(input: {
    projectId?: string;
    employeeId?: string;
    amount: number;
    description: string;
    createdById: string;
    approvers: string[];
  }): Promise<Expense> {
    return prisma.$transaction(async (tx) => {
      // Create expense record
      const expense = await tx.createExpense({
        projectId: input.projectId,
        employeeId: input.employeeId,
        amount: input.amount,
        description: input.description,
        status: 'waiting',
      });

      // Create approval request
      await createApprovalRequest({
        resource: 'expense',
        resourceId: expense.id,
        title: `طلب مصروف: ${expense.description} - ${expense.amount.toLocaleString('ar-SA')} ر.س`,
        createdById: input.createdById,
        approvers: input.approvers,
        data: {
          amount: expense.amount,
          description: expense.description,
          projectId: expense.projectId,
          employeeId: expense.employeeId
        },
        priority: this.calculatePriority(expense.amount)
      });

      return expense;
    });
  }

  async markExpenseApproved(id: string): Promise<Expense> {
    return prisma.updateExpense(id, { status: 'approved' });
  }

  async markExpenseRejected(id: string): Promise<Expense> {
    return prisma.updateExpense(id, { status: 'rejected' });
  }

  async markExpenseReimbursed(id: string): Promise<Expense> {
    return prisma.updateExpense(id, { status: 'reimbursed' });
  }

  async getExpenses(): Promise<Expense[]> {
    return prisma.findManyExpenses();
  }

  async getExpense(id: string): Promise<Expense | null> {
    const expenses = await this.getExpenses();
    return expenses.find(expense => expense.id === id) || null;
  }

  async getExpensesByProject(projectId: string): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => expense.projectId === projectId);
  }

  async getExpensesByEmployee(employeeId: string): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => expense.employeeId === employeeId);
  }

  async getExpensesByStatus(status: string): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => expense.status === status);
  }

  async getExpenseStats(): Promise<{
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
    totalReimbursed: number;
    pendingCount: number;
    approvedCount: number;
    averageExpense: number;
  }> {
    const expenses = await this.getExpenses();
    
    const stats = {
      totalPending: 0,
      totalApproved: 0,
      totalRejected: 0,
      totalReimbursed: 0,
      pendingCount: 0,
      approvedCount: 0,
      averageExpense: 0
    };

    expenses.forEach(expense => {
      switch (expense.status) {
        case 'draft':
        case 'waiting':
          stats.totalPending += expense.amount;
          stats.pendingCount++;
          break;
        case 'approved':
          stats.totalApproved += expense.amount;
          stats.approvedCount++;
          break;
        case 'rejected':
          stats.totalRejected += expense.amount;
          break;
        case 'reimbursed':
          stats.totalReimbursed += expense.amount;
          break;
      }
    });

    stats.averageExpense = expenses.length > 0 ? 
      expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0;

    return stats;
  }

  async generateExpenseReport(startDate: Date, endDate: Date): Promise<{
    expenses: Expense[];
    totalAmount: number;
    count: number;
    byStatus: Record<string, { count: number; amount: number }>;
  }> {
    const expenses = await this.getExpenses();
    
    const filteredExpenses = expenses.filter(expense => 
      expense.createdAt >= startDate && expense.createdAt <= endDate
    );

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const byStatus: Record<string, { count: number; amount: number }> = {};
    
    filteredExpenses.forEach(expense => {
      if (!byStatus[expense.status]) {
        byStatus[expense.status] = { count: 0, amount: 0 };
      }
      byStatus[expense.status].count++;
      byStatus[expense.status].amount += expense.amount;
    });

    return {
      expenses: filteredExpenses,
      totalAmount,
      count: filteredExpenses.length,
      byStatus
    };
  }

  private calculatePriority(amount: number): 'low' | 'medium' | 'high' | 'urgent' {
    if (amount > 50000) return 'urgent';
    if (amount > 20000) return 'high';
    if (amount > 5000) return 'medium';
    return 'low';
  }

  private async handleApprovalEvent(requestId: string, action: 'approved' | 'rejected') {
    // In a real implementation, we would look up the expense by the approval request ID
    // For now, we'll emit a custom event that can be handled by the UI
    const event = new CustomEvent('expense-status-changed', {
      detail: {
        requestId,
        action,
        timestamp: new Date()
      }
    });
    
    window.dispatchEvent(event);
  }
}

export const expenseService = new ExpenseService();