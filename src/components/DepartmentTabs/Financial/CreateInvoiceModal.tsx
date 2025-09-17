import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon, X, Plus, Trash2, FileText, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated?: () => void;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InvoicePayment {
  id: string;
  paymentNumber: number;
  percentage: number;
  amount: number;
  dueDate: Date | null;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onInvoiceCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    serviceType: '',
    serviceDescription: '',
    issueDate: new Date(),
    dueDate: null as Date | null,
    paymentTerms: 30,
    totalPayments: 1,
    taxRate: 15.00,
    status: 'draft' as const,
    notes: '',
    termsConditions: 'الدفع خلال المدة المحددة. رسوم تأخير 2% شهرياً بعد تاريخ الاستحقاق.'
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  const [payments, setPayments] = useState<InvoicePayment[]>([
    { id: '1', paymentNumber: 1, percentage: 100, amount: 0, dueDate: null }
  ]);

  const serviceTypes = [
    { value: 'brand_strategy', label: 'استراتيجية العلامة التجارية' },
    { value: 'visual_identity', label: 'الهوية البصرية' },
    { value: 'digital_marketing', label: 'التسويق الرقمي' },
    { value: 'content_creation', label: 'إنتاج المحتوى' },
    { value: 'market_research', label: 'دراسة السوق' },
    { value: 'consulting', label: 'استشارات' },
    { value: 'training', label: 'تدريب' },
    { value: 'other', label: 'أخرى' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'مسودة' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'paid', label: 'مدفوع' },
    { value: 'overdue', label: 'متأخر' }
  ];

  // حساب الإجماليات
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = (subtotal * formData.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  // تحديث إجمالي البند
  const updateItemTotal = (itemId: string, quantity: number, unitPrice: number) => {
    const totalPrice = quantity * unitPrice;
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity, unitPrice, totalPrice }
        : item
    ));
  };

  // إضافة بند جديد
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  // حذف بند
  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // تحديث مدفوعات بناءً على العدد
  const updatePaymentsCount = (count: number) => {
    const percentage = Math.floor(100 / count);
    const remainder = 100 % count;
    
    const newPayments: InvoicePayment[] = [];
    for (let i = 0; i < count; i++) {
      const paymentPercentage = i === count - 1 ? percentage + remainder : percentage;
      const paymentAmount = (totalAmount * paymentPercentage) / 100;
      
      newPayments.push({
        id: (i + 1).toString(),
        paymentNumber: i + 1,
        percentage: paymentPercentage,
        amount: paymentAmount,
        dueDate: null
      });
    }
    
    setPayments(newPayments);
    setFormData(prev => ({ ...prev, totalPayments: count }));
  };

  // تحديث مدفوعة واحدة
  const updatePayment = (paymentId: string, field: string, value: any) => {
    setPayments(prev => prev.map(payment =>
      payment.id === paymentId
        ? { ...payment, [field]: value }
        : payment
    ));
  };

  // إنشاء PDF
  const generatePDF = (invoiceData: any) => {
    const doc = new jsPDF();
    
    // إعداد الخط العربي (يحتاج ملف خط)
    doc.setFontSize(20);
    doc.text('فاتورة', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`رقم الفاتورة: ${invoiceData.invoice_number}`, 20, 40);
    doc.text(`التاريخ: ${format(new Date(invoiceData.issue_date), 'dd/MM/yyyy')}`, 20, 50);
    doc.text(`العميل: ${invoiceData.client_name}`, 20, 60);
    
    let yPosition = 80;
    doc.text('البنود:', 20, yPosition);
    yPosition += 10;
    
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description} - الكمية: ${item.quantity} - السعر: ${item.unitPrice} ر.س`, 20, yPosition);
      yPosition += 10;
    });
    
    yPosition += 10;
    doc.text(`المجموع الفرعي: ${subtotal.toFixed(2)} ر.س`, 20, yPosition);
    yPosition += 10;
    doc.text(`الضريبة (${formData.taxRate}%): ${taxAmount.toFixed(2)} ر.س`, 20, yPosition);
    yPosition += 10;
    doc.text(`الإجمالي: ${totalAmount.toFixed(2)} ر.س`, 20, yPosition);
    
    return doc;
  };

  // حفظ الفاتورة
  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.clientName || !formData.serviceType || items.some(item => !item.description)) {
        toast.error('يرجى إدخال جميع البيانات المطلوبة');
        return;
      }

      // إنشاء الفاتورة
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: '', // سيتم إنشاؤه تلقائياً بواسطة trigger
          client_name: formData.clientName,
          client_email: formData.clientEmail || null,
          client_phone: formData.clientPhone || null,
          client_address: formData.clientAddress || null,
          service_type: formData.serviceType as any,
          service_description: formData.serviceDescription || null,
          subtotal: subtotal,
          tax_rate: formData.taxRate,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          payment_terms: formData.paymentTerms,
          total_payments: formData.totalPayments,
          issue_date: formData.issueDate.toISOString().split('T')[0],
          due_date: formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : 
                    new Date(Date.now() + formData.paymentTerms * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: formData.status as any,
          notes: formData.notes || null,
          terms_conditions: formData.termsConditions || null,
          owner_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // إضافة البنود
      const itemsToInsert = items.map((item, index) => ({
        invoice_id: invoice.id,
        item_description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        order_index: index + 1
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // إضافة الدفعات
      const paymentsToInsert = payments.map(payment => ({
        invoice_id: invoice.id,
        payment_number: payment.paymentNumber,
        payment_amount: payment.amount,
        payment_percentage: payment.percentage,
        due_date: payment.dueDate ? payment.dueDate.toISOString().split('T')[0] : 
                  new Date(Date.now() + formData.paymentTerms * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending' as any
      }));

      const { error: paymentsError } = await supabase
        .from('invoice_payments')
        .insert(paymentsToInsert);

      if (paymentsError) throw paymentsError;

      // إنشاء PDF
      const pdf = generatePDF(invoice);
      pdf.save(`invoice-${invoice.invoice_number}.pdf`);

      toast.success('تم إنشاء الفاتورة وحفظها بنجاح');
      onInvoiceCreated?.();
      onClose();
      
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error('حدث خطأ أثناء إنشاء الفاتورة: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-6xl max-h-[95vh] p-0 bg-white/40 backdrop-blur-[20px] border border-white/20 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ zIndex: 9999 }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-black font-arabic">
                إنشاء فاتورة جديدة
              </DialogTitle>
              <p className="text-sm text-black/70 font-arabic">إعداد وإنشاء فاتورة للدفعات المالية</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-full bg-transparent hover:bg-black/5 border border-black w-8 h-8 flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
            aria-label="إغلاق"
          >
            <X className="text-black" size={18} />
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="space-y-6">
            {/* معلومات العميل */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <h3 className="text-lg font-bold text-black font-arabic mb-4">معلومات العميل</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    اسم العميل *
                  </label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="bg-white/50 border-white/30 text-black"
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="bg-white/50 border-white/30 text-black"
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    رقم الهاتف
                  </label>
                  <Input
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="bg-white/50 border-white/30 text-black"
                    placeholder="رقم الهاتف"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    العنوان
                  </label>
                  <Input
                    value={formData.clientAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                    className="bg-white/50 border-white/30 text-black"
                    placeholder="عنوان العميل"
                  />
                </div>
              </div>
            </div>

            {/* معلومات الخدمة */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <h3 className="text-lg font-bold text-black font-arabic mb-4">تفاصيل الخدمة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    نوع الخدمة *
                  </label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
                  >
                    <SelectTrigger className="bg-white/50 border-white/30 text-black" style={{ zIndex: 10001 }}>
                      <SelectValue placeholder="اختر نوع الخدمة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-[10002]">
                      {serviceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    الحالة
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-white/50 border-white/30 text-black" style={{ zIndex: 10001 }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-[10002]">
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                  وصف الخدمة
                </label>
                <Textarea
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceDescription: e.target.value }))}
                  className="bg-white/50 border-white/30 text-black"
                  placeholder="وصف تفصيلي للخدمة المقدمة"
                  rows={3}
                />
              </div>
            </div>

            {/* بنود الفاتورة */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black font-arabic">بنود الفاتورة</h3>
                <Button
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="bg-white/50 border-white/30 hover:bg-white/60"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة بند
                </Button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <label className="block text-xs text-black/70 mb-1 font-arabic">
                        وصف البند
                      </label>
                      <Input
                        value={item.description}
                        onChange={(e) => setItems(prev => prev.map(i =>
                          i.id === item.id ? { ...i, description: e.target.value } : i
                        ))}
                        className="bg-white/50 border-white/30 text-black text-sm"
                        placeholder="وصف البند"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-black/70 mb-1 font-arabic">
                        الكمية
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = parseFloat(e.target.value) || 0;
                          updateItemTotal(item.id, quantity, item.unitPrice);
                        }}
                        className="bg-white/50 border-white/30 text-black text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-black/70 mb-1 font-arabic">
                        السعر (ر.س)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const price = parseFloat(e.target.value) || 0;
                          updateItemTotal(item.id, item.quantity, price);
                        }}
                        className="bg-white/50 border-white/30 text-black text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-black/70 mb-1 font-arabic">
                        الإجمالي
                      </label>
                      <Input
                        value={item.totalPrice.toFixed(2)}
                        readOnly
                        className="bg-gray-100/50 border-white/30 text-black text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="outline"
                        size="sm"
                        disabled={items.length === 1}
                        className="bg-red-100/50 border-red-200 hover:bg-red-200/50 w-full"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الحسابات المالية */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <h3 className="text-lg font-bold text-black font-arabic mb-4">الحسابات المالية</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-black/70 font-arabic">المجموع الفرعي:</span>
                    <span className="font-bold text-black">{subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/70 font-arabic">معدل الضريبة (%):</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="w-20 bg-white/50 border-white/30 text-black text-sm"
                      />
                      <span className="text-black">%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70 font-arabic">مبلغ الضريبة:</span>
                    <span className="font-bold text-black">{taxAmount.toFixed(2)} ر.س</span>
                  </div>
                  <div className="border-t border-white/30 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-black font-arabic">الإجمالي:</span>
                    <span className="text-lg font-bold text-black">{totalAmount.toFixed(2)} ر.س</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <h3 className="text-lg font-bold text-black font-arabic mb-4">شروط الدفع</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                      مدة الدفع (أيام)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: parseInt(e.target.value) || 30 }))}
                      className="bg-white/50 border-white/30 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                      عدد الدفعات
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.totalPayments}
                      onChange={(e) => updatePaymentsCount(parseInt(e.target.value) || 1)}
                      className="bg-white/50 border-white/30 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                      تاريخ الاستحقاق
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full bg-white/50 border-white/30 text-black justify-start text-left font-normal",
                            !formData.dueDate && "text-muted-foreground"
                          )}
                          style={{ zIndex: 10001 }}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {formData.dueDate ? (
                            format(formData.dueDate, "PPP", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[10002]" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate || undefined}
                          onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date || null }))}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {/* جدولة الدفعات */}
            {formData.totalPayments > 1 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <h3 className="text-lg font-bold text-black font-arabic mb-4">جدولة الدفعات</h3>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="grid grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="block text-xs text-black/70 mb-1 font-arabic">
                          الدفعة {payment.paymentNumber}
                        </label>
                        <Input
                          value={`${payment.percentage}%`}
                          readOnly
                          className="bg-gray-100/50 border-white/30 text-black text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-black/70 mb-1 font-arabic">
                          المبلغ (ر.س)
                        </label>
                        <Input
                          value={payment.amount.toFixed(2)}
                          readOnly
                          className="bg-gray-100/50 border-white/30 text-black text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-black/70 mb-1 font-arabic">
                          تاريخ الاستحقاق
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full bg-white/50 border-white/30 text-black justify-start text-left font-normal text-sm h-9"
                              style={{ zIndex: 10001 }}
                            >
                              <CalendarIcon className="ml-2 h-3 w-3" />
                              {payment.dueDate ? (
                                format(payment.dueDate, "dd/MM/yyyy")
                              ) : (
                                <span className="text-xs">اختر التاريخ</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[10002]" align="start">
                            <Calendar
                              mode="single"
                              selected={payment.dueDate || undefined}
                              onSelect={(date) => updatePayment(payment.id, 'dueDate', date)}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ملاحظات وشروط */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <h3 className="text-lg font-bold text-black font-arabic mb-4">ملاحظات وشروط</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    ملاحظات
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-white/50 border-white/30 text-black"
                    placeholder="ملاحظات إضافية"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2 font-arabic">
                    شروط وأحكام
                  </label>
                  <Textarea
                    value={formData.termsConditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, termsConditions: e.target.value }))}
                    className="bg-white/50 border-white/30 text-black"
                    placeholder="شروط الدفع والأحكام"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/10">
          <div className="flex items-center gap-2 text-black/70">
            <Calculator className="w-4 h-4" />
            <span className="text-sm font-arabic">إجمالي الفاتورة: {totalAmount.toFixed(2)} ر.س</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={loading}
              className="bg-white/50 border-white/30 hover:bg-white/60 text-black font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-black hover:bg-black/80 text-white font-arabic min-w-[120px]"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ وإنتاج PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};