
import { MockData, BudgetData, CashFlowData, BudgetTreeItem, Transaction, Invoice, ExpenseCategory } from './types';

export const mockKPIData: MockData = {
  revenue: {
    value: 2450000,
    change: 12.5,
    trend: 'up'
  },
  expenses: {
    value: 1850000,
    change: -8.3,
    trend: 'down'
  },
  netProfit: {
    value: 600000,
    change: 45.2,
    trend: 'up'
  },
  cashFlow: {
    value: 420000,
    change: 23.1,
    trend: 'up'
  }
};

export const mockBudgetData: BudgetData[] = [
  { month: 'يناير', budget: 200000, actual: 185000 },
  { month: 'فبراير', budget: 220000, actual: 210000 },
  { month: 'مارس', budget: 250000, actual: 245000 },
  { month: 'أبريل', budget: 230000, actual: 255000 },
  { month: 'مايو', budget: 240000, actual: 235000 },
  { month: 'يونيو', budget: 260000, actual: 270000 }
];

export const mockCashFlowData: CashFlowData[] = [
  { month: 'يناير', inflow: 300000, outflow: 250000 },
  { month: 'فبراير', inflow: 320000, outflow: 280000 },
  { month: 'مارس', inflow: 350000, outflow: 290000 },
  { month: 'أبريل', inflow: 330000, outflow: 310000 },
  { month: 'مايو', inflow: 380000, outflow: 320000 },
  { month: 'يونيو', inflow: 400000, outflow: 330000 }
];

export const mockBudgetTree: BudgetTreeItem[] = [
  {
    id: 1,
    name: 'الميزانية العامة 2024',
    amount: 5000000,
    status: 'approved',
    children: [
      { id: 11, name: 'مشاريع التطوير', amount: 2000000, status: 'approved' },
      { id: 12, name: 'التشغيل والصيانة', amount: 1500000, status: 'pending' },
      { id: 13, name: 'الموارد البشرية', amount: 1200000, status: 'approved' },
      { id: 14, name: 'التسويق والإعلان', amount: 300000, status: 'review' }
    ]
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-06-29',
    description: 'دفع راتب الموظفين',
    amount: -120000,
    type: 'expense',
    category: 'HR',
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-06-28',
    description: 'إيراد من مشروع ABC',
    amount: 250000,
    type: 'revenue',
    category: 'Projects',
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-06-27',
    description: 'مصاريف تسويقية',
    amount: -15000,
    type: 'expense',
    category: 'Marketing',
    status: 'pending'
  },
  {
    id: 4,
    date: '2024-06-26',
    description: 'دفع فواتير الخدمات',
    amount: -8500,
    type: 'expense',
    category: 'Operations',
    status: 'completed'
  }
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', client: 'شركة الأمل', amount: 150000, status: 'paid', dueDate: '2024-06-15' },
  { id: 'INV-002', client: 'مؤسسة الرؤية', amount: 75000, status: 'pending', dueDate: '2024-07-01' },
  { id: 'INV-003', client: 'شركة النجاح', amount: 200000, status: 'overdue', dueDate: '2024-06-20' },
  { id: 'INV-004', client: 'مجموعة التقدم', amount: 125000, status: 'draft', dueDate: '2024-07-15' }
];

export const mockExpenseCategories: ExpenseCategory[] = [
  { name: 'الموارد البشرية', value: 45, color: '#8884d8' },
  { name: 'التشغيل', value: 25, color: '#82ca9d' },
  { name: 'التسويق', value: 15, color: '#ffc658' },
  { name: 'التطوير', value: 10, color: '#ff7c7c' },
  { name: 'أخرى', value: 5, color: '#8dd1e1' }
];
