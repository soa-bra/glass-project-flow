/**
 * Invoices Dashboard Panel
 * لوحة إدارة الفواتير
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Send,
  Ban,
  Edit,
  Download
} from 'lucide-react';

import { useInvoices, useInvoiceFilters } from '../../state';
import { 
  statusColors, 
  statusLabels, 
  calculateTotal,
  validateInvoiceLines
} from '../../domain';
import type { Invoice, InvoiceFormData, InvoiceStatus } from '../../domain';
import { InvoiceFilters, defaultFilters } from '../widgets/InvoiceFilters';
import { InvoiceDetail } from '../widgets/InvoiceDetail';
import { exportInvoicesToExcel } from '../../lib';

const statusIcons: Record<InvoiceStatus, React.ReactNode> = {
  draft: <FileText className="w-4 h-4" />,
  pending: <Clock className="w-4 h-4" />,
  posted: <Send className="w-4 h-4" />,
  paid: <CheckCircle className="w-4 h-4" />,
  overdue: <AlertTriangle className="w-4 h-4" />,
  canceled: <Ban className="w-4 h-4" />,
};

export const InvoicesDashboard: React.FC = () => {
  const { 
    invoices, 
    stats, 
    loading, 
    createInvoice, 
    postInvoice, 
    payInvoice 
  } = useInvoices();

  // Filtering
  const { 
    filters, 
    setFilters, 
    filteredInvoices, 
    resetFilters 
  } = useInvoiceFilters(invoices);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [formData, setFormData] = useState<InvoiceFormData>({
    accountId: '',
    accountName: '',
    projectId: '',
    dueDate: '',
    lines: [{ description: '', quantity: 1, unitPrice: 0, taxCode: '' }],
  });

  const handleCreateInvoice = async () => {
    if (!formData.accountName) {
      return;
    }

    const validLines = formData.lines.filter(
      (line) => line.description.trim() && line.quantity > 0 && line.unitPrice > 0
    );

    const validation = validateInvoiceLines(validLines);
    if (!validation.valid) {
      return;
    }

    const result = await createInvoice({
      accountId: formData.accountId || `account-${Date.now()}`,
      projectId: formData.projectId || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      lines: validLines,
    });

    if (result) {
      setIsCreateModalOpen(false);
      resetForm();
    }
  };

  const handlePostInvoice = async (id: string) => {
    await postInvoice(id);
  };

  const handlePayInvoice = async () => {
    if (!selectedInvoice || !paymentAmount || !paymentMethod) {
      return;
    }

    const success = await payInvoice(
      selectedInvoice.id,
      parseFloat(paymentAmount),
      paymentMethod
    );

    if (success) {
      setSelectedInvoice(null);
      setPaymentAmount('');
      setPaymentMethod('');
    }
  };

  const addInvoiceLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, { description: '', quantity: 1, unitPrice: 0, taxCode: '' }],
    }));
  };

  const removeInvoiceLine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const updateInvoiceLine = (index: number, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    }));
  };

  const resetForm = () => {
    setFormData({
      accountId: '',
      accountName: '',
      projectId: '',
      dueDate: '',
      lines: [{ description: '', quantity: 1, unitPrice: 0, taxCode: '' }],
    });
  };

  const formTotal = calculateTotal(formData.lines, false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفواتير</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              فاتورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء فاتورة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountName">اسم العميل *</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountName: e.target.value,
                        accountId: `account-${Date.now()}`,
                      }))
                    }
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Invoice Lines */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>بنود الفاتورة *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInvoiceLine}>
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة بند
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.lines.map((line, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Input
                          placeholder="وصف البند"
                          value={line.description}
                          onChange={(e) => updateInvoiceLine(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="الكمية"
                          value={line.quantity}
                          onChange={(e) =>
                            updateInvoiceLine(index, 'quantity', parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="السعر"
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateInvoiceLine(index, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm font-medium">
                          {(line.quantity * line.unitPrice).toLocaleString('ar-SA')} ر.س
                        </div>
                      </div>
                      <div className="col-span-1">
                        {formData.lines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInvoiceLine(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-left">
                  <div className="text-lg font-bold">
                    الإجمالي: {formTotal.toLocaleString('ar-SA')} ر.س
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateInvoice} className="flex-1">
                  إنشاء الفاتورة
                </Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">إجمالي المدفوع</p>
                  <p className="text-xl font-bold">{stats.totalPaid?.toLocaleString('ar-SA')} ر.س</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">في الانتظار</p>
                  <p className="text-xl font-bold">
                    {stats.totalOutstanding?.toLocaleString('ar-SA')} ر.س
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">متأخرة</p>
                  <p className="text-xl font-bold">{stats.overdueCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">متوسط الفاتورة</p>
                  <p className="text-xl font-bold">
                    {stats.averageInvoiceValue?.toLocaleString('ar-SA')} ر.س
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <InvoiceFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
        onReset={resetFilters} 
      />

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الفواتير</CardTitle>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportInvoicesToExcel(filteredInvoices)}
                disabled={filteredInvoices.length === 0}
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>
              <span className="text-sm text-muted-foreground">
                {filteredInvoices.length} من {invoices.length} فاتورة
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الفاتورة</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>إجمالي المبلغ</TableHead>
                <TableHead>تاريخ الاستحقاق</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    لا توجد فواتير مطابقة للفلاتر المحددة
                  </TableCell>
                </TableRow>
              ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.accountName || `عميل ${invoice.accountId}`}</TableCell>
                  <TableCell className="font-semibold">
                    {invoice.total.toLocaleString('ar-SA')} ر.س
                  </TableCell>
                  <TableCell>
                    {invoice.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString('ar-SA')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[invoice.status]}>
                      <span className="ml-1">{statusIcons[invoice.status]}</span>
                      {statusLabels[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {invoice.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePostInvoice(invoice.id)}
                        >
                          إرسال
                        </Button>
                      )}
                      {(invoice.status === 'posted' || invoice.status === 'pending') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          تسجيل دفعة
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setDetailInvoice(invoice)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <InvoiceDetail 
        invoice={detailInvoice} 
        open={!!detailInvoice} 
        onClose={() => setDetailInvoice(null)} 
      />

      {/* Payment Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تسجيل دفعة - {selectedInvoice?.number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount">المبلغ المدفوع (ر.س)</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="أدخل المبلغ"
                max={selectedInvoice?.total}
              />
              <p className="text-xs text-muted-foreground mt-1">
                إجمالي الفاتورة: {selectedInvoice?.total.toLocaleString('ar-SA')} ر.س
              </p>
            </div>
            <div>
              <Label htmlFor="paymentMethod">طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="cash">نقداً</SelectItem>
                  <SelectItem value="check">شيك</SelectItem>
                  <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePayInvoice} className="flex-1">
                تسجيل الدفعة
              </Button>
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
