
import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Download, Send, Eye, Filter } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  type: 'fixed' | 'hourly' | 'milestone';
  project: string;
  issueDate: string;
}

interface Payment {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  paymentDate: string;
  method: 'bank_transfer' | 'check' | 'cash' | 'card';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  project: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  receipt: boolean;
}

export const PaymentsInvoicesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'expenses'>('invoices');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      client: 'شركة التقنيات المتقدمة',
      amount: 125000,
      dueDate: '2024-07-15',
      status: 'sent',
      type: 'milestone',
      project: 'تطوير التطبيق الجوال',
      issueDate: '2024-06-15'
    },
    {
      id: '2',
      number: 'INV-2024-002',
      client: 'مؤسسة الإبداع الرقمي',
      amount: 85000,
      dueDate: '2024-06-20',
      status: 'overdue',
      type: 'fixed',
      project: 'تصميم الهوية البصرية',
      issueDate: '2024-05-20'
    },
    {
      id: '3',
      number: 'INV-2024-003',
      client: 'شركة النمو الذكي',
      amount: 95000,
      dueDate: '2024-07-30',
      status: 'paid',
      type: 'hourly',
      project: 'استشارات التسويق الرقمي',
      issueDate: '2024-06-30'
    }
  ];

  const payments: Payment[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-003',
      client: 'شركة النمو الذكي',
      amount: 95000,
      paymentDate: '2024-07-25',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'TXN-789456123'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-004',
      client: 'مؤسسة التطوير',
      amount: 45000,
      paymentDate: '2024-07-20',
      method: 'check',
      status: 'pending',
      reference: 'CHK-456789'
    }
  ];

  const expenses: Expense[] = [
    {
      id: '1',
      description: 'اشتراك أدوات التصميم الشهرية',
      amount: 2500,
      category: 'أدوات وبرامج',
      project: 'عام',
      date: '2024-07-01',
      status: 'approved',
      approver: 'أحمد المالكي',
      receipt: true
    },
    {
      id: '2',
      description: 'مصروفات سفر للقاء العميل',
      amount: 3200,
      category: 'سفر ومواصلات',
      project: 'تطوير التطبيق الجوال',
      date: '2024-07-05',
      status: 'pending',
      approver: 'سارة أحمد',
      receipt: true
    }
  ];

  const getStatusBadge = (status: string, type: 'invoice' | 'payment' | 'expense') => {
    const statusConfig = {
      invoice: {
        draft: { label: 'مسودة', variant: 'secondary' as const },
        sent: { label: 'مرسلة', variant: 'default' as const },
        paid: { label: 'مدفوعة', variant: 'default' as const },
        overdue: { label: 'متأخرة', variant: 'destructive' as const }
      },
      payment: {
        completed: { label: 'مكتملة', variant: 'default' as const },
        pending: { label: 'قيد المعالجة', variant: 'secondary' as const },
        failed: { label: 'فاشلة', variant: 'destructive' as const }
      },
      expense: {
        pending: { label: 'قيد المراجعة', variant: 'secondary' as const },
        approved: { label: 'معتمدة', variant: 'default' as const },
        rejected: { label: 'مرفوضة', variant: 'destructive' as const }
      }
    };
    
    const config = statusConfig[type][status as keyof typeof statusConfig[typeof type]];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      bank_transfer: 'تحويل بنكي',
      check: 'شيك',
      cash: 'نقدي',
      card: 'بطاقة ائتمان'
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="space-y-6 p-6">
      {/* التبويبات */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'invoices', label: 'الفواتير', icon: FileText },
          { key: 'payments', label: 'المدفوعات', icon: CheckCircle },
          { key: 'expenses', label: 'المصروفات', icon: AlertTriangle }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all font-arabic ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* أدوات التحكم */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          {activeTab === 'invoices' && (
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسلة</option>
              <option value="paid">مدفوعة</option>
              <option value="overdue">متأخرة</option>
            </select>
          )}
        </div>
        
        <Button className="flex items-center gap-2">
          {activeTab === 'invoices' && <>
            <FileText className="h-4 w-4" />
            إنشاء فاتورة جديدة
          </>}
          {activeTab === 'payments' && <>
            <CheckCircle className="h-4 w-4" />
            تسجيل دفع جديد
          </>}
          {activeTab === 'expenses' && <>
            <AlertTriangle className="h-4 w-4" />
            إضافة مصروف
          </>}
        </Button>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {invoices
            .filter(invoice => filterStatus === 'all' || invoice.status === filterStatus)
            .map(invoice => (
            <BaseCard key={invoice.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-arabic mb-1">
                    {invoice.number}
                  </h3>
                  <p className="text-gray-600 font-arabic">{invoice.client}</p>
                  <p className="text-sm text-gray-500">{invoice.project}</p>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {invoice.amount.toLocaleString()} ريال
                  </div>
                  {getStatusBadge(invoice.status, 'invoice')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">تاريخ الإصدار</span>
                  <p className="font-medium">{invoice.issueDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">تاريخ الاستحقاق</span>
                  <p className="font-medium">{invoice.dueDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">نوع الفوترة</span>
                  <p className="font-medium">
                    {invoice.type === 'fixed' ? 'ثابتة' : 
                     invoice.type === 'hourly' ? 'بالساعة' : 'بالمراحل'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">الأيام المتبقية</span>
                  <p className={`font-medium ${
                    invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {invoice.status === 'overdue' ? 'متأخرة' : '5 أيام'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  عرض
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  تحميل
                </Button>
                {invoice.status === 'draft' && (
                  <Button size="sm" className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    إرسال
                  </Button>
                )}
              </div>
            </BaseCard>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          {payments.map(payment => (
            <BaseCard key={payment.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-arabic mb-1">
                    {payment.invoiceNumber}
                  </h3>
                  <p className="text-gray-600 font-arabic">{payment.client}</p>
                  <p className="text-sm text-gray-500">مرجع: {payment.reference}</p>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {payment.amount.toLocaleString()} ريال
                  </div>
                  {getStatusBadge(payment.status, 'payment')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">تاريخ الدفع</span>
                  <p className="font-medium">{payment.paymentDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">طريقة الدفع</span>
                  <p className="font-medium">{getPaymentMethodLabel(payment.method)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">الحالة</span>
                  <p className="font-medium">
                    {payment.status === 'completed' ? 'مكتملة' : 
                     payment.status === 'pending' ? 'قيد المعالجة' : 'فاشلة'}
                  </p>
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {expenses.map(expense => (
            <BaseCard key={expense.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 font-arabic mb-1">
                    {expense.description}
                  </h3>
                  <p className="text-gray-600">{expense.category}</p>
                  <p className="text-sm text-gray-500">المشروع: {expense.project}</p>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {expense.amount.toLocaleString()} ريال
                  </div>
                  {getStatusBadge(expense.status, 'expense')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-500">التاريخ</span>
                  <p className="font-medium">{expense.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">المعتمد</span>
                  <p className="font-medium">{expense.approver}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">الإيصال</span>
                  <p className="font-medium">{expense.receipt ? 'متوفر' : 'غير متوفر'}</p>
                </div>
                <div className="flex items-center">
                  {expense.receipt && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      عرض الإيصال
                    </Button>
                  )}
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      )}
    </div>
  );
};
