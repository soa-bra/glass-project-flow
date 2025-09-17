import React, { useState } from 'react';
import { Receipt, FileText, ExternalLink, CreditCard, Edit, Download } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { mockInvoices } from './data';
import { formatCurrency, getStatusText } from './utils';
import { ClientInfoBox, getClientData } from './ClientInfoBox';

export const InvoicesTab: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const getInvoiceStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  const handleClientClick = (clientName: string) => {
    const clientData = getClientData(clientName);
    setSelectedClient(clientData);
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to project view
  };

  return (
    <BaseTabContent value="invoices">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className={buildTitleClasses()}>الفواتير والمدفوعات</h3>
          <BaseActionButton variant="primary" icon={<Receipt className="w-4 h-4" />}>
            إنشاء فاتورة
          </BaseActionButton>
        </div>
      </Reveal>

      <BaseCard title="جدول الفواتير">
        <div className="grid grid-cols-2 gap-4">
          {mockInvoices.map(invoice => (
            <Reveal key={invoice.id} delay={0.1}>
              <div className={cn(
                'flex items-center justify-between p-4 rounded-lg',
                COLORS.BORDER_COLOR,
                'bg-transparent border'
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(TYPOGRAPHY.BODY, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                        {invoice.id}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CreditCard className="w-3 h-3" />
                        <span>{invoice.paymentNumber}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClientClick(invoice.client)}
                      className={cn(
                        TYPOGRAPHY.SMALL,
                        COLORS.PRIMARY_TEXT,
                        TYPOGRAPHY.ARABIC_FONT,
                        'hover:text-blue-600 hover:underline transition-colors'
                      )}
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
                    <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-400')}>
                      تاريخ الاستحقاق: {invoice.dueDate}
                    </p>
                  </div>
                </div>
                <div className="text-left space-y-3">
                  {/* المبالغ الرئيسية */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>إجمالي المبلغ:</p>
                      <p className={cn(TYPOGRAPHY.BODY, 'font-bold', COLORS.PRIMARY_TEXT)}>
                        {formatCurrency(invoice.totalAmount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>مبلغ الدفعة:</p>
                      <p className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT)}>
                        {formatCurrency(invoice.paymentAmount)}
                      </p>
                    </div>
                  </div>
                  
                  {/* معلومات الدفع */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>رقم الدفعة:</p>
                      <p className={cn(TYPOGRAPHY.SMALL, 'font-medium')}>
                        {invoice.paymentNumber} / {invoice.totalPayments}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-500')}>نسبة الدفع:</p>
                      <p className={cn(TYPOGRAPHY.SMALL, 'font-medium', 'text-green-600')}>
                        {invoice.paymentPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  {/* الحالة والإجراءات */}
                  <div className="flex items-center justify-between">
                    <BaseBadge variant={getInvoiceStatusVariant(invoice.status)} size="sm">
                      {getStatusText(invoice.status)}
                    </BaseBadge>
                    <div className="flex items-center gap-2">
                      <BaseActionButton variant="edit" size="sm" icon={<Edit className="w-4 h-4" />} />
                      <BaseActionButton variant="download" size="sm" icon={<Download className="w-4 h-4" />} />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </BaseCard>

      {selectedClient && (
        <Reveal>
          <ClientInfoBox 
            client={selectedClient} 
            onClose={() => setSelectedClient(null)} 
          />
        </Reveal>
      )}
    </BaseTabContent>
  );
};