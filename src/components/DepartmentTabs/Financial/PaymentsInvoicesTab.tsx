
import React, { useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle, AlertCircle, Eye, Edit, Download } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'draft';
  description: string;
  attachments: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

export const PaymentsInvoicesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      client: 'شركة النور التجارية',
      amount: 45000,
      dueDate: '2024-07-15',
      status: 'pending',
      description: 'خدمات استشارية تسويقية',
      attachments: 2
    },
    {
      id: '2',
      number: 'INV-2024-002',
      client: 'مؤسسة الأمل للتطوير',
      amount: 32000,
      dueDate: '2024-06-20',
      status: 'overdue',
      description: 'تطوير موقع إلكتروني',
      attachments: 1
    },
    {
      id: '3',
      number: 'INV-2024-003',
      client: 'شركة الإبداع المحدودة',
      amount: 28000,
      dueDate: '2024-07-30',
      status: 'paid',
      description: 'إدارة حملة إعلانية',
      attachments: 3
    }
  ];

  const payments: Payment[] = [
    {
      id: '1',
      invoiceId: '3',
      amount: 28000,
      date: '2024-06-25',
      method: 'تحويل بنكي',
      reference: 'TXN-789456',
      status: 'completed'
    },
    {
      id: '2',
      invoiceId: '1',
      amount: 22500,
      date: '2024-06-28',
      method: 'شيك',
      reference: 'CHK-123789',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوعة';
      case 'pending': return 'معلقة';
      case 'overdue': return 'متأخرة';
      case 'draft': return 'مسودة';
      case 'completed': return 'مكتملة';
      case 'failed': return 'فاشلة';
      default: return status;
    }
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6 p-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard variant="glass" size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{totalInvoices}</h3>
          <p className="text-sm text-gray-600 font-arabic">إجمالي الفواتير</p>
        </BaseCard>

        <BaseCard variant="glass" size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{paidInvoices}</h3>
          <p className="text-sm text-gray-600 font-arabic">فواتير مدفوعة</p>
        </BaseCard>

        <BaseCard variant="glass" size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{overdueInvoices}</h3>
          <p className="text-sm text-gray-600 font-arabic">فواتير متأخرة</p>
        </BaseCard>

        <BaseCard variant="glass" size="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{((paidAmount / totalAmount) * 100).toFixed(0)}%</h3>
          <p className="text-sm text-gray-600 font-arabic">نسبة التحصيل</p>
        </BaseCard>
      </div>

      {/* تبويبات فرعية */}
      <div className="flex gap-4 border-b">
        <button 
          className={`pb-2 font-arabic ${activeTab === 'invoices' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('invoices')}
        >
          الفواتير
        </button>
        <button 
          className={`pb-2 font-arabic ${activeTab === 'payments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('payments')}
        >
          المدفوعات
        </button>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 font-arabic">قائمة الفواتير</h3>
            <Button className="font-arabic">إنشاء فاتورة جديدة</Button>
          </div>

          {invoices.map((invoice) => (
            <BaseCard key={invoice.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 font-arabic mb-1">{invoice.number}</h4>
                  <p className="text-gray-600 font-arabic">{invoice.client}</p>
                  <p className="text-sm text-gray-500 font-arabic">{invoice.description}</p>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-800 mb-1">{invoice.amount.toLocaleString()} ريال</div>
                  <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>تاريخ الاستحقاق: {invoice.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4" />
                    <span>{invoice.attachments} مرفقات</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    تحرير
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 font-arabic">سجل المدفوعات</h3>
            <Button className="font-arabic">تسجيل دفعة جديدة</Button>
          </div>

          {payments.map((payment) => {
            const relatedInvoice = invoices.find(inv => inv.id === payment.invoiceId);
            
            return (
              <BaseCard key={payment.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 font-arabic mb-1">
                      {payment.amount.toLocaleString()} ريال
                    </h4>
                    <p className="text-gray-600 font-arabic">
                      فاتورة: {relatedInvoice?.number || 'غير محدد'}
                    </p>
                    <p className="text-sm text-gray-500">العميل: {relatedInvoice?.client}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>طريقة الدفع: {payment.method}</span>
                      <span>المرجع: {payment.reference}</span>
                      <span>التاريخ: {payment.date}</span>
                    </div>
                  </div>
                  
                  <Badge className={`${getStatusColor(payment.status)} text-white`}>
                    {getStatusText(payment.status)}
                  </Badge>
                </div>
              </BaseCard>
            );
          })}
        </div>
      )}

      {/* تقرير التحصيلات */}
      <BaseCard className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic">تقرير التحصيلات</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-arabic">إجمالي المبلغ المستحق</span>
            <span className="font-bold text-lg">{totalAmount.toLocaleString()} ريال</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-arabic">المبلغ المحصل</span>
            <span className="font-bold text-lg text-green-600">{paidAmount.toLocaleString()} ريال</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-arabic">المبلغ المتبقي</span>
            <span className="font-bold text-lg text-red-600">{(totalAmount - paidAmount).toLocaleString()} ريال</span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>نسبة التحصيل</span>
              <span>{((paidAmount / totalAmount) * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={(paidAmount / totalAmount) * 100} 
              className="h-3"
              indicatorClassName="bg-green-500"
            />
          </div>
        </div>
      </BaseCard>
    </div>
  );
};
