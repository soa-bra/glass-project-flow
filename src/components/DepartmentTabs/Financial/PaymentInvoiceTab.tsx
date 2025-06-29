
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Send, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

export const PaymentInvoiceTab = () => {
  const [activeView, setActiveView] = useState('invoices');

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-001',
      clientName: 'شركة التقنية المتطورة',
      amount: 85000,
      dueDate: '2024-01-15',
      status: 'paid',
      issueDate: '2023-12-15'
    },
    {
      id: 'INV-002',
      clientName: 'مؤسسة الأعمال الرقمية',
      amount: 125000,
      dueDate: '2024-01-20',
      status: 'pending',
      issueDate: '2023-12-20'
    },
    {
      id: 'INV-003',
      clientName: 'شركة الحلول الذكية',
      amount: 95000,
      dueDate: '2024-01-10',
      status: 'overdue',
      issueDate: '2023-12-10'
    },
    {
      id: 'INV-004',
      clientName: 'مجموعة الابتكار',
      amount: 150000,
      dueDate: '2024-01-25',
      status: 'draft',
      issueDate: '2024-01-01'
    }
  ];

  // Mock payment data
  const payments = [
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      clientName: 'شركة التقنية المتطورة',
      amount: 85000,
      paymentDate: '2024-01-14',
      method: 'bank_transfer',
      status: 'completed'
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-005',
      clientName: 'شركة الخدمات المالية',
      amount: 75000,
      paymentDate: '2024-01-12',
      method: 'check',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getInvoiceStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'مدفوعة', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'في الانتظار', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      overdue: { label: 'متأخرة', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      draft: { label: 'مسودة', variant: 'outline' as const, icon: FileText, color: 'text-gray-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1 font-arabic">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      bank_transfer: 'تحويل بنكي',
      check: 'شيك',
      cash: 'نقد',
      credit_card: 'بطاقة ائتمان'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="h-full rounded-2xl p-6 operations-board-card" style={{
      background: 'var(--backgrounds-cards-admin-ops)'
    }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-arabic text-right mb-2">إدارة المدفوعات والفواتير</h2>
            <p className="text-gray-600 font-arabic text-right">نظام الفوترة الآلي وتتبع المدفوعات</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2 font-arabic">
              <Send className="h-4 w-4" />
              إرسال فاتورة
            </Button>
            <Button variant="outline" className="gap-2 font-arabic">
              <FileText className="h-4 w-4" />
              فاتورة جديدة
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-section border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold font-arabic">{totalInvoices}</p>
                  <p className="text-sm text-gray-600 font-arabic">إجمالي الفواتير</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-section border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold font-arabic">{formatCurrency(totalAmount)}</p>
                  <p className="text-sm text-gray-600 font-arabic">إجمالي القيمة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-section border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold font-arabic">{paidInvoices}</p>
                  <p className="text-sm text-gray-600 font-arabic">فواتير مدفوعة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-section border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold font-arabic">{overdueInvoices}</p>
                  <p className="text-sm text-gray-600 font-arabic">فواتير متأخرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === 'invoices' ? 'default' : 'outline'}
            onClick={() => setActiveView('invoices')}
            className="font-arabic"
          >
            الفواتير
          </Button>
          <Button
            variant={activeView === 'payments' ? 'default' : 'outline'}
            onClick={() => setActiveView('payments')}
            className="font-arabic"
          >
            المدفوعات
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeView === 'invoices' ? (
            <Card className="glass-section border-0">
              <CardHeader>
                <CardTitle className="font-arabic text-right">سجل الفواتير</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right font-arabic">الإجراءات</TableHead>
                      <TableHead className="text-right font-arabic">الحالة</TableHead>
                      <TableHead className="text-right font-arabic">تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-right font-arabic">المبلغ</TableHead>
                      <TableHead className="text-right font-arabic">العميل</TableHead>
                      <TableHead className="text-right font-arabic">رقم الفاتورة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="font-arabic">{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell className="font-arabic font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell className="font-arabic">{invoice.clientName}</TableCell>
                        <TableCell className="font-arabic font-mono">{invoice.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-section border-0">
              <CardHeader>
                <CardTitle className="font-arabic text-right">سجل المدفوعات</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right font-arabic">الحالة</TableHead>
                      <TableHead className="text-right font-arabic">طريقة الدفع</TableHead>
                      <TableHead className="text-right font-arabic">تاريخ الدفع</TableHead>
                      <TableHead className="text-right font-arabic">المبلغ</TableHead>
                      <TableHead className="text-right font-arabic">العميل</TableHead>
                      <TableHead className="text-right font-arabic">رقم الدفع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Badge variant="default" className="gap-1 font-arabic">
                            <CheckCircle className="h-3 w-3" />
                            مكتمل
                          </Badge>
                        </TableCell>
                        <TableCell className="font-arabic">{getPaymentMethodLabel(payment.method)}</TableCell>
                        <TableCell className="font-arabic">{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell className="font-arabic font-semibold">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="font-arabic">{payment.clientName}</TableCell>
                        <TableCell className="font-arabic font-mono">{payment.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
