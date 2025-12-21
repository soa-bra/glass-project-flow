/**
 * Invoice Detail Widget
 * عرض تفاصيل الفاتورة مع الطباعة والتصدير
 */

import React, { useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Separator } from '@/components/ui/separator';
import { 
  Printer, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Hash,
  Building
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import { statusLabels, statusColors, VAT_RATE } from '../../domain';
import type { Invoice } from '../../domain';

interface InvoiceDetailProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  open,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy', { locale: ar });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-SA', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة ${invoice.number}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif; 
            padding: 40px; 
            direction: rtl;
            color: #0B0F12;
          }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 700; color: #0B0F12; }
          .invoice-info { text-align: left; }
          .invoice-number { font-size: 18px; font-weight: 600; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 14px; color: #666; margin-bottom: 8px; }
          .section-value { font-size: 16px; font-weight: 500; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: right; border-bottom: 1px solid #DADCE0; }
          th { background: #f5f5f5; font-weight: 600; }
          .totals { margin-top: 20px; text-align: left; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-size: 18px; font-weight: 700; border-top: 2px solid #0B0F12; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add Arabic font support message
    doc.setFont('helvetica');
    doc.setFontSize(12);
    
    // Header
    doc.setFontSize(20);
    doc.text('SOABRA', 190, 20, { align: 'right' });
    
    doc.setFontSize(14);
    doc.text(`Invoice: ${invoice.number}`, 190, 30, { align: 'right' });
    
    // Invoice details
    doc.setFontSize(10);
    let yPos = 50;
    
    doc.text(`Client: ${invoice.accountName || invoice.accountId}`, 190, yPos, { align: 'right' });
    yPos += 8;
    doc.text(`Issue Date: ${formatDate(invoice.createdAt)}`, 190, yPos, { align: 'right' });
    yPos += 8;
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 190, yPos, { align: 'right' });
    yPos += 8;
    doc.text(`Status: ${statusLabels[invoice.status]}`, 190, yPos, { align: 'right' });
    
    // Lines table
    yPos += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, yPos);
    doc.text('Qty', 100, yPos);
    doc.text('Price', 130, yPos);
    doc.text('Total', 170, yPos);
    
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    if (invoice.lines && invoice.lines.length > 0) {
      invoice.lines.forEach((line) => {
        const lineTotal = line.quantity * line.unitPrice;
        doc.text(line.description.substring(0, 40), 20, yPos);
        doc.text(String(line.quantity), 100, yPos);
        doc.text(`${formatCurrency(line.unitPrice)} SAR`, 130, yPos);
        doc.text(`${formatCurrency(lineTotal)} SAR`, 170, yPos);
        yPos += 8;
      });
    }
    
    // Totals
    yPos += 10;
    doc.line(120, yPos, 190, yPos);
    yPos += 8;
    
    if (invoice.subtotal) {
      doc.text('Subtotal:', 130, yPos);
      doc.text(`${formatCurrency(invoice.subtotal)} SAR`, 190, yPos, { align: 'right' });
      yPos += 8;
    }
    
    if (invoice.taxAmount) {
      doc.text(`VAT (${VAT_RATE * 100}%):`, 130, yPos);
      doc.text(`${formatCurrency(invoice.taxAmount)} SAR`, 190, yPos, { align: 'right' });
      yPos += 8;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 130, yPos);
    doc.text(`${formatCurrency(invoice.total)} SAR`, 190, yPos, { align: 'right' });
    
    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Generated by SoaBra Invoice System', 105, 280, { align: 'center' });
    
    // Save
    doc.save(`invoice-${invoice.number}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              تفاصيل الفاتورة
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 ml-1" />
                طباعة
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4 ml-1" />
                PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Printable Content */}
        <div ref={printRef} className="space-y-6 p-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground">سـوبــرا</h2>
              <p className="text-sm text-muted-foreground">علم اجتماع العلامة التجارية</p>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lg font-semibold">{invoice.number}</span>
                <Hash className="w-4 h-4 text-muted-foreground" />
              </div>
              <Badge className={statusColors[invoice.status]}>
                {statusLabels[invoice.status]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Client & Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  العميل
                </div>
                <p className="font-medium">{invoice.accountName || invoice.accountId}</p>
              </div>
              {invoice.projectName && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Building className="w-4 h-4" />
                    المشروع
                  </div>
                  <p className="font-medium">{invoice.projectName}</p>
                </div>
              )}
            </div>

            <div className="space-y-4 text-left">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
                  تاريخ الإصدار
                  <Calendar className="w-4 h-4" />
                </div>
                <p className="font-medium">{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
                  تاريخ الاستحقاق
                  <Calendar className="w-4 h-4" />
                </div>
                <p className="font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lines */}
          <div>
            <h3 className="font-semibold mb-4">بنود الفاتورة</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right p-3 font-medium">الوصف</th>
                    <th className="text-center p-3 font-medium w-20">الكمية</th>
                    <th className="text-center p-3 font-medium w-28">السعر</th>
                    <th className="text-left p-3 font-medium w-28">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines && invoice.lines.length > 0 ? (
                    invoice.lines.map((line, index) => (
                      <tr key={line.id || index} className="border-t border-border">
                        <td className="p-3">{line.description}</td>
                        <td className="p-3 text-center">{line.quantity}</td>
                        <td className="p-3 text-center">{formatCurrency(line.unitPrice)} ر.س</td>
                        <td className="p-3 text-left font-medium">
                          {formatCurrency(line.quantity * line.unitPrice)} ر.س
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        لا توجد بنود
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              {invoice.subtotal !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{formatCurrency(invoice.subtotal)} ر.س</span>
                </div>
              )}
              {invoice.taxAmount !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ضريبة القيمة المضافة ({VAT_RATE * 100}%)</span>
                  <span>{formatCurrency(invoice.taxAmount)} ر.س</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span className="text-primary">{formatCurrency(invoice.total)} ر.س</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
