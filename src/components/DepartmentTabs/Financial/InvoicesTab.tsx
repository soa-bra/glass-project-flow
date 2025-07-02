
import React from 'react';
import { Button } from '@/components/ui/button';
import { Receipt, Download } from 'lucide-react';
import { mockInvoices } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

export const InvoicesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black font-arabic">الفواتير والمدفوعات</h3>
        <Button className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full">
          <Receipt className="w-4 h-4 mr-2" />
          إنشاء فاتورة
        </Button>
      </div>

      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black font-arabic">جدول الفواتير</h3>
          <CircularIconButton 
            icon={Download}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
        <div className="space-y-3 bg-transparent">
          {mockInvoices.map(invoice => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-black/10 rounded-2xl bg-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#a4e2f6] flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-arabic">{invoice.id}</h4>
                  <p className="text-sm font-medium text-black font-arabic">{invoice.client}</p>
                  <p className="text-xs font-normal text-gray-400 font-arabic">تاريخ الاستحقاق: {invoice.dueDate}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-black">{formatCurrency(invoice.amount)}</p>
                <div className={`px-3 py-1 rounded-full text-xs font-normal text-black inline-block ${
                  invoice.status === 'paid' ? 'bg-[#bdeed3]' :
                  invoice.status === 'pending' ? 'bg-[#fbe2aa]' :
                  invoice.status === 'overdue' ? 'bg-[#f1b5b9]' :
                  'bg-[#d9d2fd]'
                }`}>
                  {getStatusText(invoice.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
