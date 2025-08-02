import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, FileText, ExternalLink, CreditCard } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockInvoices } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
import { ClientInfoBox, getClientData } from './ClientInfoBox';
export const InvoicesTab: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-[#bdeed3] text-black';
      case 'pending':
        return 'bg-[#fbe2aa] text-black';
      case 'overdue':
        return 'bg-[#f1b5b9] text-black';
      case 'draft':
        return 'bg-[#a4e2f6] text-black';
      default:
        return 'bg-[#d9d2fd] text-black';
    }
  };

  const handleClientClick = (clientName: string) => {
    const clientData = getClientData(clientName);
    setSelectedClient(clientData);
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to project dashboard
    console.log('Navigate to project:', projectId);
    // This would typically use router.push or similar navigation
  };
  return <div className="space-y-6">
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
            {mockInvoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#a4e2f6] flex items-center justify-center">
                    <FileText className="h-6 w-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-black font-arabic">{invoice.id}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CreditCard className="w-3 h-3" />
                        <span>{invoice.paymentNumber}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClientClick(invoice.client)}
                      className="text-sm font-normal text-black font-arabic hover:text-blue-600 hover:underline transition-colors"
                    >
                      {invoice.client}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleProjectClick(invoice.projectId)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-arabic flex items-center gap-1 hover:underline"
                      >
                        <span>{invoice.projectName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs font-normal text-gray-400">تاريخ الاستحقاق: {invoice.dueDate}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-black text-sm my-[6px] py-0">{formatCurrency(invoice.amount)}</p>
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getInvoiceStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {selectedClient && (
        <div className="mt-6">
          <ClientInfoBox 
            client={selectedClient} 
            onClose={() => setSelectedClient(null)} 
          />
        </div>
      )}
    </div>;
};