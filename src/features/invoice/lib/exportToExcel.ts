/**
 * تصدير الفواتير إلى Excel
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Invoice } from '../domain';

const statusLabelsAr: Record<string, string> = {
  draft: 'مسودة',
  pending: 'في الانتظار',
  posted: 'مُرسلة',
  paid: 'مدفوعة',
  overdue: 'متأخرة',
  canceled: 'ملغية',
};

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
}

export function exportInvoicesToExcel(
  invoices: Invoice[],
  options: ExportOptions = {}
): void {
  const { filename = 'invoices', sheetName = 'الفواتير' } = options;

  // تحويل البيانات إلى صيغة مناسبة للتصدير
  const data = invoices.map((invoice) => ({
    'رقم الفاتورة': invoice.number,
    'العميل': invoice.accountName || `عميل ${invoice.accountId}`,
    'إجمالي المبلغ': invoice.total,
    'تاريخ الإنشاء': invoice.createdAt
      ? new Date(invoice.createdAt).toLocaleDateString('ar-SA') 
      : '-',
    'تاريخ الاستحقاق': invoice.dueDate 
      ? new Date(invoice.dueDate).toLocaleDateString('ar-SA') 
      : '-',
    'الحالة': statusLabelsAr[invoice.status] || invoice.status,
    'عدد البنود': invoice.lines?.length || 0,
  }));

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(data);

  // ضبط عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 15 }, // رقم الفاتورة
    { wch: 25 }, // العميل
    { wch: 15 }, // إجمالي المبلغ
    { wch: 15 }, // المبلغ المدفوع
    { wch: 15 }, // المبلغ المتبقي
    { wch: 15 }, // تاريخ الإنشاء
    { wch: 15 }, // تاريخ الاستحقاق
    { wch: 12 }, // الحالة
    { wch: 10 }, // عدد البنود
  ];

  // إنشاء المصنف
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // تحويل إلى buffer
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array' 
  });

  // إنشاء Blob وتحميل الملف
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  // إضافة التاريخ إلى اسم الملف
  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `${filename}_${dateStr}.xlsx`);
}
