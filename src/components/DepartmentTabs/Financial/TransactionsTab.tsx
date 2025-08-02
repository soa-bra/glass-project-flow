import React, { useState } from 'react';
import { Upload, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemButton } from '@/components/ui/UnifiedSystemButton';
import { UnifiedSystemBadge } from '@/components/ui/UnifiedSystemBadge';
import { AccountingEntryModal } from '@/components/custom/AccountingEntryModal';
import { mockTransactions } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
export const TransactionsTab: React.FC = () => {
  const [isAccountingEntryModalOpen, setIsAccountingEntryModalOpen] = useState(false);
  
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#bdeed3] text-black';
      case 'pending':
        return 'bg-[#fbe2aa] text-black';
      case 'cancelled':
        return 'bg-[#f1b5b9] text-black';
      case 'processing':
        return 'bg-[#a4e2f6] text-black';
      default:
        return 'bg-[#d9d2fd] text-black';
    }
  };

  const handleSaveAccountingEntry = (entry: any) => {
    console.log('حفظ القيد المحاسبي:', entry);
    
    // هنا يتم تحديث البيانات المالية في النظام
    // - حساب الموجودات بعد إضافة الإيراد وحسم المصروفات
    // - تحديث لوحة التشغيل والإدارة
    // - إضافة القيد وتفاصيله إلى دفتر القيود
    
    // سيتم التكامل مع API النظام لاحقاً
    alert(`تم حفظ القيد المحاسبي بنجاح: ${entry.description}`);
  };
  return (
    <div className="space-y-6">
      <UnifiedSystemCard
        title="النفقات والإيرادات"
        headerActions={
          <div className="flex gap-2">
            <UnifiedSystemButton variant="outline" icon={<Upload />}>
              رفع مستند
            </UnifiedSystemButton>
            <UnifiedSystemButton 
              variant="primary"
              icon={<FileText />}
              onClick={() => setIsAccountingEntryModalOpen(true)}
            >
              إضافة قيد
            </UnifiedSystemButton>
          </div>
        }
      >
        <div className="space-y-3">
          {mockTransactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-black/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-transparent border border-black flex items-center justify-center">
                  {transaction.type === 'revenue' ? <ArrowUp className="h-6 w-6 text-black" /> : <ArrowDown className="h-6 w-6 text-black" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-arabic">{transaction.description}</h4>
                  <p className="text-sm font-normal text-black font-arabic">{transaction.date} • {transaction.category}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-black font-bold text-sm mx-[10px] text-center my-[8px]">
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
                <UnifiedSystemBadge 
                  variant={
                    transaction.status === 'completed' ? 'success' :
                    transaction.status === 'pending' ? 'warning' :
                    transaction.status === 'cancelled' ? 'error' : 'info'
                  }
                >
                  {getStatusText(transaction.status)}
                </UnifiedSystemBadge>
              </div>
            </div>
          ))}
        </div>
      </UnifiedSystemCard>

      {/* Modal إضافة القيد المحاسبي */}
      <AccountingEntryModal
        isOpen={isAccountingEntryModalOpen}
        onClose={() => setIsAccountingEntryModalOpen(false)}
        onSave={handleSaveAccountingEntry}
      />
    </div>
  );
};