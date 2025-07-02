
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockInvoices } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';

export const InvoicesTab: React.FC = () => {
  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-[#bdeed3] text-black';
      case 'pending': return 'bg-[#fbe2aa] text-black';
      case 'overdue': return 'bg-[#f1b5b9] text-black';
      case 'draft': return 'bg-[#a4e2f6] text-black';
      default: return 'bg-[#d9d2fd] text-black';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-large font-semibold text-black font-arabic">الفواتير والمدفوعات</h3>
        <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          إنشاء فاتورة
        </button>
      </div>

      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">جدول الفواتير</h3>
        </div>
        <div className="px-0">
          <div className="space-y-3">
            {mockInvoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#a4e2f6] flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black font-arabic">{invoice.id}</h4>
                    <p className="text-sm font-normal text-black font-arabic">{invoice.client}</p>
                    <p className="text-xs font-normal text-gray-400">تاريخ الاستحقاق: {invoice.dueDate}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-black">{formatCurrency(invoice.amount)}</p>
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getInvoiceStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
