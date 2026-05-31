// Main Export Index (Active Paths Only)
// Recovery Step 06: legacy/shadow exports removed from root barrel.

export * from './shared/services/sequence';
export * from './shared/services/approvals';

// Active APIs
export * from './api/crm/opportunities';
export * from './api/contracts/contracts';
export * from './api/invoices/invoices';
export * from './api/expenses/expenses';

// Active Components
export { OpportunityPipeline } from './components/CRM/OpportunityPipeline';
export { ExpensesDashboard } from './components/Financial/ExpensesDashboard';
