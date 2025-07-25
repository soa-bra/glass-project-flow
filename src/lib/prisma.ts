// Mock Prisma Client for Frontend-Only Implementation
// This simulates Prisma client behavior until real backend is integrated

export type OpportunityStage = 'LEAD' | 'QUALIFY' | 'PROPOSAL' | 'WON' | 'LOST';
export type InvoiceStatus = 'draft' | 'posted' | 'paid' | 'canceled';

export interface Account {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactPerson {
  id: string;
  accountId: string;
  account?: Account;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  influence?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  accountId: string;
  account?: Account;
  stage: OpportunityStage;
  value?: number;
  expectedClose?: Date;
  reasonLost?: string;
  proposals?: Proposal[];
  project?: Project;
  createdAt: Date;
  updatedAt: Date;
}

export interface Proposal {
  id: string;
  opportunityId: string;
  opportunity?: Opportunity;
  scope: any;
  pricingModel: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  number: string;
  accountId: string;
  account?: Account;
  projectId?: string;
  project?: Project;
  startDate: Date;
  endDate?: Date;
  value: number;
  paymentTerms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  clientId: string;
  client?: Account;
  brandId?: string;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  tasks?: Task[];
  invoices?: Invoice[];
  contracts?: Contract[];
  expenses?: Expense[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  project?: Project;
  title: string;
  description?: string;
  status: string;
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  number: string;
  accountId: string;
  account?: Account;
  projectId?: string;
  project?: Project;
  total: number;
  status: InvoiceStatus;
  dueDate?: Date;
  lines?: InvoiceLine[];
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  description: string;
  quantity: number;
  unitPrice: number;
  taxCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  method: string;
  amount: number;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  projectId?: string;
  project?: Project;
  employeeId?: string;
  amount: number;
  description: string;
  status: string; // draft | waiting | approved | rejected | reimbursed
  createdAt: Date;
  updatedAt: Date;
}

// Mock Database Storage (In-Memory for Frontend)
class MockDatabase {
  private accounts: Account[] = [];
  private contacts: ContactPerson[] = [];
  private opportunities: Opportunity[] = [];
  private proposals: Proposal[] = [];
  private contracts: Contract[] = [];
  private projects: Project[] = [];
  private tasks: Task[] = [];
  private invoices: Invoice[] = [];
  private invoiceLines: InvoiceLine[] = [];
  private payments: Payment[] = [];
  private expenses: Expense[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some mock data
    const mockAccount: Account = {
      id: '1',
      name: 'شركة التقنيات المتقدمة',
      industry: 'تقنية',
      size: 'متوسطة',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.accounts.push(mockAccount);

    const mockOpportunity: Opportunity = {
      id: '1',
      accountId: '1',
      stage: 'QUALIFY',
      value: 150000,
      expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opportunities.push(mockOpportunity);
  }

  // Account operations
  async findAccount(id: string): Promise<Account | null> {
    return this.accounts.find(a => a.id === id) || null;
  }

  async findManyAccounts(): Promise<Account[]> {
    return [...this.accounts];
  }

  async createAccount(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const account: Account = {
      ...data,
      id: (this.accounts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.accounts.push(account);
    return account;
  }

  // Opportunity operations
  async findOpportunity(id: string): Promise<Opportunity | null> {
    return this.opportunities.find(o => o.id === id) || null;
  }

  async findManyOpportunities(): Promise<Opportunity[]> {
    return [...this.opportunities];
  }

  async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> {
    const opportunity: Opportunity = {
      ...data,
      id: (this.opportunities.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opportunities.push(opportunity);
    return opportunity;
  }

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const index = this.opportunities.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Opportunity not found');
    
    this.opportunities[index] = {
      ...this.opportunities[index],
      ...data,
      updatedAt: new Date()
    };
    return this.opportunities[index];
  }

  // Contract operations
  async createContract(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    const contract: Contract = {
      ...data,
      id: (this.contracts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contracts.push(contract);
    return contract;
  }

  async findManyContracts(): Promise<Contract[]> {
    return [...this.contracts];
  }

  async findContract(id: string): Promise<Contract | null> {
    return this.contracts.find(c => c.id === id) || null;
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    const index = this.contracts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contract not found');
    
    this.contracts[index] = {
      ...this.contracts[index],
      ...data,
      updatedAt: new Date()
    };
    return this.contracts[index];
  }

  // Invoice operations
  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const invoice: Invoice = {
      ...data,
      id: (this.invoices.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.invoices.push(invoice);
    return invoice;
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    
    this.invoices[index] = {
      ...this.invoices[index],
      ...data,
      updatedAt: new Date()
    };
    return this.invoices[index];
  }

  async findManyInvoices(): Promise<Invoice[]> {
    return [...this.invoices];
  }

  async findInvoice(id: string): Promise<Invoice | null> {
    return this.invoices.find(i => i.id === id) || null;
  }

  // Invoice Line operations
  async createInvoiceLine(data: Omit<InvoiceLine, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvoiceLine> {
    const line: InvoiceLine = {
      ...data,
      id: (this.invoiceLines.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.invoiceLines.push(line);
    return line;
  }

  // Payment operations
  async createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const payment: Payment = {
      ...data,
      id: (this.payments.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.payments.push(payment);
    return payment;
  }

  async aggregatePayments(invoiceId: string): Promise<{ _sum: { amount: number | null } }> {
    const payments = this.payments.filter(p => p.invoiceId === invoiceId);
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    return { _sum: { amount: total } };
  }

  // Expense operations
  async createExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const expense: Expense = {
      ...data,
      id: (this.expenses.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.expenses.push(expense);
    return expense;
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    this.expenses[index] = {
      ...this.expenses[index],
      ...data,
      updatedAt: new Date()
    };
    return this.expenses[index];
  }

  async findManyExpenses(): Promise<Expense[]> {
    return [...this.expenses];
  }

  // Transaction simulation
  async $transaction<T>(fn: (tx: MockDatabase) => Promise<T>): Promise<T> {
    // In a real implementation, this would handle rollbacks
    return await fn(this);
  }
}

// Export mock prisma instance
export const prisma = new MockDatabase();