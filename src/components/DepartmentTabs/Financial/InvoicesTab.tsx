import React, { useState } from 'react';
import { Receipt, FileText, ExternalLink, CreditCard } from 'lucide-react';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemButton } from '@/components/ui/UnifiedSystemButton';
import { UnifiedSystemBadge } from '@/components/ui/UnifiedSystemBadge';
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
  return (
    <div className="space-y-6">
      <UnifiedSystemCard
        title="الفواتير والمدفوعات"
        headerActions={
          <UnifiedSystemButton variant="primary" icon={<Receipt />}>
            إنشاء فاتورة
          </UnifiedSystemButton>
        }
      >
        <div className="space-y-3">
          {mockInvoices.map(invoice => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-black/5 rounded-2xl">
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
                <UnifiedSystemBadge 
                  variant={
                    invoice.status === 'paid' ? 'success' :
                    invoice.status === 'pending' ? 'warning' :
                    invoice.status === 'overdue' ? 'error' : 'info'
                  }
                >
                  {getStatusText(invoice.status)}
                </UnifiedSystemBadge>
              </div>
            </div>
          ))}
        </div>
      </UnifiedSystemCard>

      {selectedClient && (
        <div className="mt-6">
          <ClientInfoBox 
            client={selectedClient} 
            onClose={() => setSelectedClient(null)} 
          />
        </div>
      )}
    </div>
  );
};