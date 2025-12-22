// Main Export Index for CRM & Invoicing Systems
export * from './lib/prisma';
export * from './core/sequence/sequence.service';
export * from './core/approvals/approvals.service';

// Services
export * from './modules/crm/opportunity.service';
export * from './modules/contract/contract.service';
export * from './modules/invoice/invoice.service';
export * from './modules/expense/expense.service';

// APIs
export * from './api/crm/opportunities';
export * from './api/contracts/contracts';
export * from './api/invoices/invoices';
export * from './api/expenses/expenses';

// Components
export { OpportunityPipeline } from './components/CRM/OpportunityPipeline';
export { InvoicesDashboard } from './components/Financial/InvoicesDashboard';
export { ExpensesDashboard } from './components/Financial/ExpensesDashboard';