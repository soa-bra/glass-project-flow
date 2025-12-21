/**
 * Invoice Feature - Public API
 * 
 * استخدم فقط:
 * ```typescript
 * import { InvoicesDashboard, useInvoices } from '@/features/invoice';
 * ```
 * 
 * ❌ ممنوع الاستيراد العميق:
 * ```typescript
 * import { something } from '@/features/invoice/ui/...';
 * ```
 */

// UI Components
export { InvoicesDashboard, InvoiceCard, InvoiceStatsWidget } from './ui';

// Hooks
export { useInvoices } from './state';

// Types (re-export from domain)
export type { 
  Invoice, 
  InvoiceLine, 
  InvoiceStatus,
  InvoiceStats,
  InvoiceFormData,
  CreateInvoiceInput,
} from './domain';

// Business Rules (for external use)
export { 
  calculateTotal,
  calculateSubtotal,
  calculateTax,
  VAT_RATE,
  statusLabels,
  statusColors,
  isOverdue,
} from './domain';
