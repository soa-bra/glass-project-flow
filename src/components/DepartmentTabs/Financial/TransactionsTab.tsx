
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { mockTransactions } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

export const TransactionsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black font-arabic">النفقات والإيرادات</h3>
        <div className="flex gap-2">
          <Button className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full">
            <Upload className="w-4 h-4 mr-2" />
            رفع مستند
          </Button>
          <Button className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full">
            <FileText className="w-4 h-4 mr-2" />
            إضافة قيد
          </Button>
        </div>
      </div>

      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black font-arabic">دفتر القيود</h3>
          <CircularIconButton 
            icon={Download}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
        <div className="space-y-3 bg-transparent">
          {mockTransactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-black/10 rounded-2xl bg-transparent">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  transaction.type === 'revenue' ? 'bg-[#bdeed3]' : 'bg-[#f1b5b9]'
                }`}>
                  {transaction.type === 'revenue' ? 
                    <TrendingUp className="h-6 w-6 text-black" /> : 
                    <TrendingDown className="h-6 w-6 text-black" />
                  }
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-arabic">{transaction.description}</h4>
                  <p className="text-sm font-medium text-black font-arabic">{transaction.date} • {transaction.category}</p>
                </div>
              </div>
              <div className="text-left">
                <p className={`text-2xl font-bold ${transaction.amount > 0 ? 'text-black' : 'text-black'}`}>
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
                <div className={`px-3 py-1 rounded-full text-xs font-normal text-black inline-block ${
                  transaction.status === 'completed' ? 'bg-[#bdeed3]' :
                  transaction.status === 'pending' ? 'bg-[#fbe2aa]' :
                  'bg-[#f1b5b9]'
                }`}>
                  {getStatusText(transaction.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
