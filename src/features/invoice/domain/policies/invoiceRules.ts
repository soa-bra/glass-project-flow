/**
 * Invoice Business Rules
 * قواعد الفواتير
 */

import type { Invoice, InvoiceLine, InvoiceStatus } from '../types/invoice.types';

/** نسبة ضريبة القيمة المضافة السعودية */
export const VAT_RATE = 0.15;

/**
 * حساب المجموع الفرعي للبنود
 */
export function calculateSubtotal(lines: Pick<InvoiceLine, 'quantity' | 'unitPrice'>[]): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
}

/**
 * حساب الضريبة
 */
export function calculateTax(subtotal: number, taxRate = VAT_RATE): number {
  return subtotal * taxRate;
}

/**
 * حساب الإجمالي شامل الضريبة
 */
export function calculateTotal(lines: Pick<InvoiceLine, 'quantity' | 'unitPrice'>[], includeTax = true): number {
  const subtotal = calculateSubtotal(lines);
  return includeTax ? subtotal + calculateTax(subtotal) : subtotal;
}

/**
 * التحقق من إمكانية إرسال الفاتورة
 */
export function canPostInvoice(invoice: Pick<Invoice, 'status'>): boolean {
  return invoice.status === 'draft';
}

/**
 * التحقق من إمكانية دفع الفاتورة
 */
export function canPayInvoice(invoice: Pick<Invoice, 'status'>): boolean {
  return invoice.status === 'posted' || invoice.status === 'pending';
}

/**
 * التحقق من إمكانية إلغاء الفاتورة
 */
export function canCancelInvoice(invoice: Pick<Invoice, 'status'>): boolean {
  return invoice.status === 'draft' || invoice.status === 'posted';
}

/**
 * التحقق من تأخر الفاتورة
 */
export function isOverdue(invoice: Pick<Invoice, 'status' | 'dueDate'>): boolean {
  if (invoice.status !== 'posted' && invoice.status !== 'pending') {
    return false;
  }
  if (!invoice.dueDate) {
    return false;
  }
  const dueDate = typeof invoice.dueDate === 'string' ? new Date(invoice.dueDate) : invoice.dueDate;
  return dueDate < new Date();
}

/**
 * الحصول على الحالة المعروضة
 */
export function getDisplayStatus(invoice: Pick<Invoice, 'status' | 'dueDate'>): InvoiceStatus {
  if (isOverdue(invoice)) {
    return 'overdue';
  }
  return invoice.status;
}

/**
 * التحقق من صلاحية بنود الفاتورة
 */
export function validateInvoiceLines(lines: Pick<InvoiceLine, 'description' | 'quantity' | 'unitPrice'>[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (lines.length === 0) {
    errors.push('يجب إضافة بند واحد على الأقل');
    return { valid: false, errors };
  }

  lines.forEach((line, index) => {
    if (!line.description.trim()) {
      errors.push(`البند ${index + 1}: الوصف مطلوب`);
    }
    if (line.quantity <= 0) {
      errors.push(`البند ${index + 1}: الكمية يجب أن تكون أكبر من صفر`);
    }
    if (line.unitPrice <= 0) {
      errors.push(`البند ${index + 1}: السعر يجب أن يكون أكبر من صفر`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * خريطة ألوان الحالات
 */
export const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-blue-100 text-blue-800',
  posted: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  canceled: 'bg-red-100 text-red-800',
};

/**
 * خريطة تسميات الحالات
 */
export const statusLabels: Record<InvoiceStatus, string> = {
  draft: 'مسودة',
  pending: 'في الانتظار',
  posted: 'مرسلة',
  paid: 'مدفوعة',
  overdue: 'متأخرة',
  canceled: 'ملغية',
};
