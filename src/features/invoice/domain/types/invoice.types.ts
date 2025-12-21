/**
 * Invoice Domain Types
 * أنواع الفواتير
 */

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'canceled' | 'posted';

export interface InvoiceLine {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxCode?: string;
  total?: number;
}

export interface Invoice {
  id: string;
  number: string;
  accountId: string;
  accountName?: string;
  projectId?: string;
  projectName?: string;
  total: number;
  subtotal?: number;
  taxAmount?: number;
  status: InvoiceStatus;
  dueDate?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
  lines?: InvoiceLine[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  receivedAt: Date;
}

export interface InvoiceStats {
  totalOutstanding: number;
  totalPaid: number;
  totalDraft: number;
  overdueCount: number;
  averageInvoiceValue: number;
  totalRevenue: number;
}

export interface InvoiceReport {
  invoices: Invoice[];
  totalRevenue: number;
  totalOutstanding: number;
  count: number;
}

export interface CreateInvoiceInput {
  accountId: string;
  projectId?: string;
  lines: Omit<InvoiceLine, 'id' | 'total'>[];
  dueDate?: Date;
}

// UI-specific types
export interface InvoiceFormData {
  accountId: string;
  accountName: string;
  projectId?: string;
  dueDate: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxCode?: string;
  }>;
}
