import React, { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { contractsAPI } from '@/api/contracts/contracts';
import { invoicesAPI } from '@/api/invoices/invoices';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ExportButtons: React.FC = () => {
  const [isExporting, setIsExporting] = useState<string>('');
  const { toast } = useToast();

  const handleExport = async (type: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(type);
    
    try {
      // جلب البيانات من الـ APIs
      const [contracts, invoices] = await Promise.all([
        contractsAPI.getContracts(),
        invoicesAPI.getInvoices()
      ]);

      // دمج البيانات
      const combinedData = contracts.map((contract: any) => {
        const relatedInvoices = invoices.filter(
          (inv: any) => inv.projectId === contract.projectId
        );
        return {
          contractId: contract.id || contract.number,
          projectId: contract.projectId || 'غير محدد',
          contractValue: contract.value || 0,
          invoices: relatedInvoices.map((inv: any) => ({
            invoiceId: inv.id || inv.number,
            total: inv.total || 0,
            status: inv.status || 'غير محدد'
          }))
        };
      });

      // إنشاء صفوف للجدول
      const rows: any[] = [];
      combinedData.forEach(item => {
        if (item.invoices.length > 0) {
          item.invoices.forEach((inv: any) => {
            rows.push({
              'رقم العقد': item.contractId,
              'رقم المشروع': item.projectId,
              'قيمة العقد': item.contractValue,
              'رقم الفاتورة': inv.invoiceId,
              'إجمالي الفاتورة': inv.total,
              'حالة الفاتورة': inv.status
            });
          });
        } else {
          rows.push({
            'رقم العقد': item.contractId,
            'رقم المشروع': item.projectId,
            'قيمة العقد': item.contractValue,
            'رقم الفاتورة': 'لا توجد فواتير',
            'إجمالي الفاتورة': 0,
            'حالة الفاتورة': '-'
          });
        }
      });

      const timestamp = new Date().toISOString().split('T')[0];

      switch (type) {
        case 'pdf':
          await exportToPDF(rows, timestamp);
          break;
        case 'excel':
          await exportToExcel(rows, timestamp);
          break;
        case 'csv':
          await exportToCSV(rows, timestamp);
          break;
      }

      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير التقرير بصيغة ${type.toUpperCase()}`,
      });

    } catch (error) {
      console.error('خطأ في التصدير:', error);
      toast({
        title: "فشل التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    } finally {
      setIsExporting('');
    }
  };

  const exportToPDF = async (data: any[], timestamp: string) => {
    const doc = new jsPDF();
    
    // إعداد الخط العربي (يحتاج خط يدعم العربية)
    doc.setFont('helvetica');
    doc.setFontSize(16);
    
    // العنوان
    doc.text('تقرير العقود والفواتير المتكامل', 20, 20);
    doc.setFontSize(12);
    doc.text(`تاريخ التصدير: ${timestamp}`, 20, 35);
    
    let yPosition = 50;
    const lineHeight = 8;
    
    // رؤوس الجدول
    doc.setFontSize(10);
    doc.text('رقم العقد', 20, yPosition);
    doc.text('رقم المشروع', 60, yPosition);
    doc.text('قيمة العقد', 100, yPosition);
    doc.text('رقم الفاتورة', 140, yPosition);
    doc.text('إجمالي الفاتورة', 180, yPosition);
    
    yPosition += lineHeight;
    
    // البيانات
    data.forEach((row, index) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(String(row['رقم العقد']), 20, yPosition);
      doc.text(String(row['رقم المشروع']), 60, yPosition);
      doc.text(String(row['قيمة العقد']), 100, yPosition);
      doc.text(String(row['رقم الفاتورة']), 140, yPosition);
      doc.text(String(row['إجمالي الفاتورة']), 180, yPosition);
      
      yPosition += lineHeight;
    });
    
    doc.save(`contracts-invoices-report-${timestamp}.pdf`);
  };

  const exportToExcel = async (data: any[], timestamp: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تقرير العقود والفواتير');
    
    // إعداد عرض الأعمدة
    const columnWidths = [
      { wch: 15 }, // رقم العقد
      { wch: 20 }, // رقم المشروع
      { wch: 15 }, // قيمة العقد
      { wch: 20 }, // رقم الفاتورة
      { wch: 18 }, // إجمالي الفاتورة
      { wch: 15 }  // حالة الفاتورة
    ];
    worksheet['!cols'] = columnWidths;
    
    XLSX.writeFile(workbook, `contracts-invoices-report-${timestamp}.xlsx`);
  };

  const exportToCSV = async (data: any[], timestamp: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contracts-invoices-report-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Download className="h-4 w-4" />
        <span>تصدير:</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        disabled={isExporting !== ''}
        className="gap-2"
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        PDF
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={isExporting !== ''}
        className="gap-2"
      >
        {isExporting === 'excel' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        Excel
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={isExporting !== ''}
        className="gap-2"
      >
        {isExporting === 'csv' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Table className="h-4 w-4" />
        )}
        CSV
      </Button>
    </div>
  );
};

export default ExportButtons;