import React, { useState } from 'react';
import { Upload, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { buildCardClasses, buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { AccountingEntryModal } from '@/components/custom/AccountingEntryModal';
import { mockTransactions } from './data';
import { formatCurrency, getStatusText } from './utils';

export const TransactionsTab: React.FC = () => {
  const [isAccountingEntryModalOpen, setIsAccountingEntryModalOpen] = useState(false);
  
  const getTransactionStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'processing': return 'info';
      default: return 'default';
    }
  };

  const handleSaveAccountingEntry = (entry: any) => {
    console.log('حفظ القيد المحاسبي:', entry);
    alert(`تم حفظ القيد المحاسبي بنجاح: ${entry.description}`);
  };

  return (
    <BaseTabContent value="transactions">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className={buildTitleClasses()}>النفقات والإيرادات</h3>
          <div className="flex gap-3">
            <BaseActionButton variant="outline" icon={<Upload className="w-4 h-4" />}>
              رفع مستند
            </BaseActionButton>
            <BaseActionButton 
              variant="primary" 
              onClick={() => setIsAccountingEntryModalOpen(true)}
              icon={<FileText className="w-4 h-4 rounded-[40px] bg-[#ffffff] border-[#DADCE0] " />}
            >
              إضافة قيد
            </BaseActionButton>
          </div>
        </div>
      </Reveal>

      <BaseCard title="دفتر القيود">
        <div className="space-y-3">
          {mockTransactions.map(transaction => (
            <Reveal key={transaction.id} delay={0.1}>
              <div className={cn(
                'flex items-center justify-between p-4 rounded-lg',
                COLORS.BORDER_COLOR,
                'bg-transparent border'
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    {transaction.type === 'revenue' ? 
                      <TrendingUp className="h-6 w-6 text-green-600" /> : 
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    }
                  </div>
                  <div>
                    <h4 className={cn(TYPOGRAPHY.BODY, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                      {transaction.description}
                    </h4>
                    <p className={cn(TYPOGRAPHY.SMALL, COLORS.SECONDARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={cn(TYPOGRAPHY.BODY, 'font-bold', COLORS.PRIMARY_TEXT, 'text-center mb-2')}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <BaseBadge variant={getTransactionStatusVariant(transaction.status)} size="sm">
                    {getStatusText(transaction.status)}
                  </BaseBadge>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </BaseCard>

      <AccountingEntryModal
        isOpen={isAccountingEntryModalOpen}
        onClose={() => setIsAccountingEntryModalOpen(false)}
        onSave={handleSaveAccountingEntry}
      />
    </BaseTabContent>
  );
};