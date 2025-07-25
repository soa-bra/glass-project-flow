import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
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
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-large font-semibold text-black font-arabic">النفقات والإيرادات</h3>
        <div className="flex gap-2">
          <button className="bg-transparent border border-black text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            رفع مستند
          </button>
          <button 
            onClick={() => setIsAccountingEntryModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            إضافة قيد
          </button>
        </div>
      </div>

      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">دفتر القيود</h3>
        </div>
        <div className="px-0">
          <div className="space-y-3">
            {mockTransactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'revenue' ? 'bg-[#bdeed3]' : 'bg-[#f1b5b9]'}`}>
                    {transaction.type === 'revenue' ? <TrendingUp className="h-6 w-6 text-black" /> : <TrendingDown className="h-6 w-6 text-black" />}
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
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${getTransactionStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {/* Modal إضافة القيد المحاسبي */}
      <AccountingEntryModal
        isOpen={isAccountingEntryModalOpen}
        onClose={() => setIsAccountingEntryModalOpen(false)}
        onSave={handleSaveAccountingEntry}
      />
    </div>;
};