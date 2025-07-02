
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
        return 'bg-[#bdeed3] text-black';
      case 'pending':
        return 'bg-[#fbe2aa] text-black';
      case 'overdue':
      case 'failed':
        return 'bg-[#f1b5b9] text-black';
      default:
        return 'bg-[#d9d2fd] text-black';
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
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-2">
            <FileText className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{totalInvoices}</h3>
          <p className="text-sm font-normal text-black font-arabic">إجمالي الفواتير</p>
        </div>

        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{paidInvoices}</h3>
          <p className="text-sm font-normal text-black font-arabic">فواتير مدفوعة</p>
        </div>

        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{overdueInvoices}</h3>
          <p className="text-sm font-normal text-black font-arabic">فواتير متأخرة</p>
        </div>

        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{((paidAmount / totalAmount) * 100).toFixed(0)}%</h3>
          <p className="text-sm font-normal text-black font-arabic">نسبة التحصيل</p>
        </div>
      </div>

      {/* تبويبات فرعية */}
      <div className="flex gap-4 border-b border-black/10">
        <button 
          className={`pb-2 font-arabic ${activeTab === 'invoices' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('invoices')}
        >
          الفواتير
        </button>
        <button 
          className={`pb-2 font-arabic ${activeTab === 'payments' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('payments')}
        >
          المدفوعات
        </button>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-large font-semibold text-black font-arabic">قائمة الفواتير</h3>
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium font-arabic">إنشاء فاتورة جديدة</button>
          </div>

          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-bold text-black font-arabic mb-1">{invoice.number}</h4>
                  <p className="text-sm font-normal text-black font-arabic">{invoice.client}</p>
                  <p className="text-sm font-normal text-gray-400 font-arabic">{invoice.description}</p>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-black mb-1">{invoice.amount.toLocaleString()} ريال</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
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
                  <button className="bg-transparent border border-black text-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </button>
                  <button className="bg-transparent border border-black text-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    تحرير
                  </button>
                  <button className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-large font-semibold text-black font-arabic">سجل المدفوعات</h3>
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium font-arabic">تسجيل دفعة جديدة</button>
          </div>

          {payments.map((payment) => {
            const relatedInvoice = invoices.find(inv => inv.id === payment.invoiceId);
            
            return (
              <div key={payment.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-black font-arabic mb-1">
                      {payment.amount.toLocaleString()} ريال
                    </h4>
                    <p className="text-sm font-normal text-black font-arabic">
                      فاتورة: {relatedInvoice?.number || 'غير محدد'}
                    </p>
                    <p className="text-sm font-normal text-gray-400">العميل: {relatedInvoice?.client}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span>طريقة الدفع: {payment.method}</span>
                      <span>المرجع: {payment.reference}</span>
                      <span>التاريخ: {payment.date}</span>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* تقرير التحصيلات */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">تقرير التحصيلات</h3>
        </div>
        <div className="px-0">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-arabic text-black">إجمالي المبلغ المستحق</span>
              <span className="font-bold text-lg text-black">{totalAmount.toLocaleString()} ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic text-black">المبلغ المحصل</span>
              <span className="font-bold text-lg text-black">{paidAmount.toLocaleString()} ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic text-black">المبلغ المتبقي</span>
              <span className="font-bold text-lg text-black">{(totalAmount - paidAmount).toLocaleString()} ريال</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-black">نسبة التحصيل</span>
                <span className="text-black">{((paidAmount / totalAmount) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-[#bdeed3] h-3 rounded-full"
                  style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
