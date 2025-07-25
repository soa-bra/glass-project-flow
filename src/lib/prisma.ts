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

// Knowledge Base Types
export type KbArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface KbSpace {
  id: string;
  name: string;
  desc?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  articles?: KbArticle[];
}

export interface KbArticle {
  id: string;
  spaceId: string;
  space?: KbSpace;
  title: string;
  status: KbArticleStatus;
  currentVid?: string;
  versions?: KbArticleVersion[];
  tags?: KbArticleTag[];
  comments?: KbComment[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KbArticleVersion {
  id: string;
  articleId: string;
  article?: KbArticle;
  number: number;
  content: any; // JSON content
  createdBy: string;
  createdAt: Date;
}

export interface KbTag {
  id: string;
  code: string;
  label: string;
  articles?: KbArticleTag[];
}

export interface KbArticleTag {
  id: string;
  articleId: string;
  tagId: string;
  article?: KbArticle;
  tag?: KbTag;
}

export interface KbComment {
  id: string;
  articleId: string;
  article?: KbArticle;
  authorId: string;
  body: string;
  createdAt: Date;
}

// Surveys Framework Types
export type SurveyStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type QuestionType = 'SCALE' | 'SINGLE' | 'MULTI' | 'TEXT';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  resource?: string;
  resourceId?: string;
  status: SurveyStatus;
  questions?: SurveyQuestion[];
  responses?: SurveyResponse[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyQuestion {
  id: string;
  surveyId: string;
  survey?: Survey;
  order: number;
  type: QuestionType;
  text: string;
  meta?: any; // {min, max, labels, options, etc}
  answers?: SurveyAnswer[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  survey?: Survey;
  respondentId?: string;
  submittedAt: Date;
  answers?: SurveyAnswer[];
}

export interface SurveyAnswer {
  id: string;
  responseId: string;
  response?: SurveyResponse;
  questionId: string;
  question?: SurveyQuestion;
  value: any; // JSON value
}

// HR Lite Types
export interface Employee {
  id: string;
  userId: string;
  name: string;
  email?: string;
  position?: string;
  department?: string;
  role: string;
  tribe?: string;
  status: 'active' | 'inactive' | 'on_leave';
  costRate?: number;
  timeOffRequests?: TimeOffRequest[];
  appraisalSubmissions?: AppraisalSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employee?: Employee;
  type: string; // vacation, sick, unpaid, etc
  startDate: Date;
  endDate: Date;
  status: string; // draft | waiting | approved | rejected | canceled
  createdAt: Date;
  updatedAt: Date;
}

export interface AppraisalCycle {
  id: string;
  title: string;
  periodStart: Date;
  periodEnd: Date;
  status: string; // open | closed
  questions?: AppraisalQuestion[];
  submissions?: AppraisalSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppraisalQuestion {
  id: string;
  cycleId: string;
  cycle?: AppraisalCycle;
  text: string;
  type: string; // scale | text
  order: number;
  answers?: AppraisalAnswer[];
}

export interface AppraisalSubmission {
  id: string;
  cycleId: string;
  cycle?: AppraisalCycle;
  employeeId: string;
  employee?: Employee;
  submittedAt?: Date;
  answers?: AppraisalAnswer[];
}

export interface AppraisalAnswer {
  id: string;
  submissionId: string;
  submission?: AppraisalSubmission;
  questionId: string;
  question?: AppraisalQuestion;
  value: any; // JSON value
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

  // Knowledge Base data
  private kbSpaces: KbSpace[] = [];
  private kbArticles: KbArticle[] = [];
  private kbArticleVersions: KbArticleVersion[] = [];
  private kbTags: KbTag[] = [];
  private kbArticleTags: KbArticleTag[] = [];
  private kbComments: KbComment[] = [];

  // Surveys data
  private surveys: Survey[] = [];
  private surveyQuestions: SurveyQuestion[] = [];
  private surveyResponses: SurveyResponse[] = [];
  private surveyAnswers: SurveyAnswer[] = [];

  // HR data
  private employees: Employee[] = [];
  private timeOffRequests: TimeOffRequest[] = [];
  private appraisalCycles: AppraisalCycle[] = [];
  private appraisalQuestions: AppraisalQuestion[] = [];
  private appraisalSubmissions: AppraisalSubmission[] = [];
  private appraisalAnswers: AppraisalAnswer[] = [];
  private timeEntries: any[] = [];

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

  // Knowledge Base operations
  async createKbSpace(data: Omit<KbSpace, 'id' | 'createdAt' | 'updatedAt'>): Promise<KbSpace> {
    const space: KbSpace = {
      ...data,
      id: (this.kbSpaces.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.kbSpaces.push(space);
    return space;
  }

  async findManyKbSpaces(): Promise<KbSpace[]> {
    return [...this.kbSpaces];
  }

  async findKbSpace(id: string): Promise<KbSpace | null> {
    return this.kbSpaces.find(s => s.id === id) || null;
  }

  async createKbArticle(data: Omit<KbArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<KbArticle> {
    const article: KbArticle = {
      ...data,
      id: (this.kbArticles.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.kbArticles.push(article);
    return article;
  }

  async updateKbArticle(id: string, data: Partial<KbArticle>): Promise<KbArticle> {
    const index = this.kbArticles.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Article not found');
    
    this.kbArticles[index] = {
      ...this.kbArticles[index],
      ...data,
      updatedAt: new Date()
    };
    return this.kbArticles[index];
  }

  async findManyKbArticles(spaceId?: string): Promise<KbArticle[]> {
    return spaceId 
      ? this.kbArticles.filter(a => a.spaceId === spaceId)
      : [...this.kbArticles];
  }

  async findKbArticle(id: string): Promise<KbArticle | null> {
    return this.kbArticles.find(a => a.id === id) || null;
  }

  async createKbArticleVersion(data: Omit<KbArticleVersion, 'id' | 'createdAt'>): Promise<KbArticleVersion> {
    const version: KbArticleVersion = {
      ...data,
      id: (this.kbArticleVersions.length + 1).toString(),
      createdAt: new Date()
    };
    this.kbArticleVersions.push(version);
    return version;
  }

  async createKbTag(data: Omit<KbTag, 'id'>): Promise<KbTag> {
    const tag: KbTag = {
      ...data,
      id: (this.kbTags.length + 1).toString()
    };
    this.kbTags.push(tag);
    return tag;
  }

  async findManyKbTags(): Promise<KbTag[]> {
    return [...this.kbTags];
  }

  // Survey operations
  async createSurvey(data: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    const survey: Survey = {
      ...data,
      id: (this.surveys.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.surveys.push(survey);
    return survey;
  }

  async updateSurvey(id: string, data: Partial<Survey>): Promise<Survey> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Survey not found');
    
    this.surveys[index] = {
      ...this.surveys[index],
      ...data,
      updatedAt: new Date()
    };
    return this.surveys[index];
  }

  async findManySurveys(status?: string): Promise<Survey[]> {
    return status 
      ? this.surveys.filter(s => s.status === status)
      : [...this.surveys];
  }

  async findSurvey(id: string): Promise<Survey | null> {
    return this.surveys.find(s => s.id === id) || null;
  }

  async createSurveyQuestion(data: Omit<SurveyQuestion, 'id'>): Promise<SurveyQuestion> {
    const question: SurveyQuestion = {
      ...data,
      id: (this.surveyQuestions.length + 1).toString()
    };
    this.surveyQuestions.push(question);
    return question;
  }

  async createSurveyResponse(data: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse> {
    const response: SurveyResponse = {
      ...data,
      id: (this.surveyResponses.length + 1).toString(),
      submittedAt: new Date()
    };
    this.surveyResponses.push(response);
    return response;
  }

  async createSurveyAnswer(data: Omit<SurveyAnswer, 'id'>): Promise<SurveyAnswer> {
    const answer: SurveyAnswer = {
      ...data,
      id: (this.surveyAnswers.length + 1).toString()
    };
    this.surveyAnswers.push(answer);
    return answer;
  }

  // HR operations
  async createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const employee: Employee = {
      ...data,
      id: (this.employees.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.employees.push(employee);
    return employee;
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    this.employees[index] = {
      ...this.employees[index],
      ...data,
      updatedAt: new Date()
    };
    return this.employees[index];
  }

  async findManyEmployees(): Promise<Employee[]> {
    return [...this.employees];
  }

  async findEmployee(id: string): Promise<Employee | null> {
    return this.employees.find(e => e.id === id) || null;
  }

  async deleteEmployee(id: string): Promise<void> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    this.employees.splice(index, 1);
  }

  async findEmployeeByUserId(userId: string): Promise<Employee | null> {
    return this.employees.find(e => e.userId === userId) || null;
  }

  async createTimeOffRequest(data: Omit<TimeOffRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeOffRequest> {
    const request: TimeOffRequest = {
      ...data,
      id: (this.timeOffRequests.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.timeOffRequests.push(request);
    return request;
  }

  async updateTimeOffRequest(id: string, data: Partial<TimeOffRequest>): Promise<TimeOffRequest> {
    const index = this.timeOffRequests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Time off request not found');
    
    this.timeOffRequests[index] = {
      ...this.timeOffRequests[index],
      ...data,
      updatedAt: new Date()
    };
    return this.timeOffRequests[index];
  }

  async findManyTimeOffRequests(employeeId?: string): Promise<TimeOffRequest[]> {
    return employeeId 
      ? this.timeOffRequests.filter(r => r.employeeId === employeeId)
      : [...this.timeOffRequests];
  }

  async createAppraisalCycle(data: Omit<AppraisalCycle, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppraisalCycle> {
    const cycle: AppraisalCycle = {
      ...data,
      id: (this.appraisalCycles.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appraisalCycles.push(cycle);
    return cycle;
  }

  async findManyAppraisalCycles(): Promise<AppraisalCycle[]> {
    return [...this.appraisalCycles];
  }

  async findAppraisalCycle(id: string): Promise<AppraisalCycle | null> {
    return this.appraisalCycles.find(c => c.id === id) || null;
  }

  async createAppraisalQuestion(data: Omit<AppraisalQuestion, 'id'>): Promise<AppraisalQuestion> {
    const question: AppraisalQuestion = {
      ...data,
      id: (this.appraisalQuestions.length + 1).toString()
    };
    this.appraisalQuestions.push(question);
    return question;
  }

  async upsertAppraisalSubmission(data: { cycleId: string; employeeId: string }): Promise<AppraisalSubmission> {
    const existing = this.appraisalSubmissions.find(s => s.cycleId === data.cycleId && s.employeeId === data.employeeId);
    
    if (existing) {
      existing.submittedAt = new Date();
      return existing;
    }

    const submission: AppraisalSubmission = {
      ...data,
      id: (this.appraisalSubmissions.length + 1).toString(),
      submittedAt: new Date()
    };
    this.appraisalSubmissions.push(submission);
    return submission;
  }

  async createAppraisalAnswer(data: Omit<AppraisalAnswer, 'id'>): Promise<AppraisalAnswer> {
    const answer: AppraisalAnswer = {
      ...data,
      id: (this.appraisalAnswers.length + 1).toString()
    };
    this.appraisalAnswers.push(answer);
    return answer;
  }

  async deleteAppraisalAnswers(submissionId: string): Promise<void> {
    this.appraisalAnswers = this.appraisalAnswers.filter(a => a.submissionId !== submissionId);
  }

  async createTimeEntry(data: any): Promise<any> {
    const timeEntry = {
      ...data,
      id: Math.random().toString(36),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.timeEntries.push(timeEntry);
    return timeEntry;
  }

  async findManyTimeEntries(): Promise<any[]> {
    return [...this.timeEntries];
  }

  async updateTimeEntry(id: string, data: any): Promise<any> {
    const index = this.timeEntries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Time entry not found');
    
    this.timeEntries[index] = {
      ...this.timeEntries[index],
      ...data,
      updatedAt: new Date()
    };
    return this.timeEntries[index];
  }

  async deleteTimeEntry(id: string): Promise<void> {
    const index = this.timeEntries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Time entry not found');
    this.timeEntries.splice(index, 1);
  }

  async deleteSurvey(id: string): Promise<void> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Survey not found');
    this.surveys.splice(index, 1);
  }

  async findManySurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    return this.surveyResponses.filter(r => r.surveyId === surveyId);
  }

  // Transaction simulation
  async $transaction<T>(fn: (tx: MockDatabase) => Promise<T>): Promise<T> {
    // In a real implementation, this would handle rollbacks
    return await fn(this);
  }
}

// Export mock prisma instance
export const prisma = new MockDatabase();