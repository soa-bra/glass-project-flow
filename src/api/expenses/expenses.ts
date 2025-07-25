// Expenses API
import { expenseService } from '@/modules/expense/expense.service';

export class ExpensesAPI {
  async getExpenses() {
    try {
      return await expenseService.getExpenses();
    } catch (error) {
      throw new Error(`Failed to fetch expenses: ${error}`);
    }
  }

  async getExpense(id: string) {
    try {
      return await expenseService.getExpense(id);
    } catch (error) {
      throw new Error(`Failed to fetch expense: ${error}`);
    }
  }

  async submitExpense(data: {
    projectId?: string;
    employeeId?: string;
    amount: number;
    description: string;
    createdById: string;
    approvers: string[];
  }) {
    try {
      return await expenseService.submitExpense(data);
    } catch (error) {
      throw new Error(`Failed to submit expense: ${error}`);
    }
  }

  async markExpenseApproved(id: string) {
    try {
      return await expenseService.markExpenseApproved(id);
    } catch (error) {
      throw new Error(`Failed to approve expense: ${error}`);
    }
  }

  async markExpenseRejected(id: string) {
    try {
      return await expenseService.markExpenseRejected(id);
    } catch (error) {
      throw new Error(`Failed to reject expense: ${error}`);
    }
  }

  async markExpenseReimbursed(id: string) {
    try {
      return await expenseService.markExpenseReimbursed(id);
    } catch (error) {
      throw new Error(`Failed to mark expense as reimbursed: ${error}`);
    }
  }

  async getExpensesByProject(projectId: string) {
    try {
      return await expenseService.getExpensesByProject(projectId);
    } catch (error) {
      throw new Error(`Failed to fetch expenses by project: ${error}`);
    }
  }

  async getExpensesByEmployee(employeeId: string) {
    try {
      return await expenseService.getExpensesByEmployee(employeeId);
    } catch (error) {
      throw new Error(`Failed to fetch expenses by employee: ${error}`);
    }
  }

  async getExpensesByStatus(status: string) {
    try {
      return await expenseService.getExpensesByStatus(status);
    } catch (error) {
      throw new Error(`Failed to fetch expenses by status: ${error}`);
    }
  }

  async getExpenseStats() {
    try {
      return await expenseService.getExpenseStats();
    } catch (error) {
      throw new Error(`Failed to fetch expense stats: ${error}`);
    }
  }

  async generateExpenseReport(startDate: Date, endDate: Date) {
    try {
      return await expenseService.generateExpenseReport(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to generate expense report: ${error}`);
    }
  }
}

export const expensesAPI = new ExpensesAPI();