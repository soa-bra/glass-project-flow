
export interface KPIData {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

export interface MockData {
  revenue: KPIData;
  expenses: KPIData;
  netProfit: KPIData;
  cashFlow: KPIData;
}

export interface BudgetData {
  month: string;
  budget: number;
  actual: number;
}

export interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
}

export interface BudgetTreeItem {
  id: number;
  name: string;
  amount: number;
  status: string;
  children?: BudgetTreeItem[];
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'expense' | 'revenue';
  category: string;
  status: string;
}

export interface Invoice {
  id: string;
  client: string;
  totalAmount: number;
  paymentAmount: number;
  paymentNumber: number;
  totalPayments: number;
  paymentPercentage: number;
  status: string;
  dueDate: string;
  projectName: string;
  projectId: string;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface Alert {
  id: number;
  type: 'warning' | 'info' | 'success';
  message: string;
  priority: 'high' | 'medium' | 'low';
}
