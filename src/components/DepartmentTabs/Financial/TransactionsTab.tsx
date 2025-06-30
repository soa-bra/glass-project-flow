
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockTransactions } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';

export const TransactionsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">النفقات والإيرادات</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            رفع مستند
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            إضافة قيد
          </Button>
        </div>
      </div>

      <BaseCard variant="operations" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>دفتر القيود</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            {mockTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'revenue' ? 
                      <TrendingUp className="h-6 w-6 text-green-600" /> : 
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-sm text-gray-600">{transaction.date} • {transaction.category}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <Badge className={getStatusColor(transaction.status)}>
                    {getStatusText(transaction.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </BaseCard>
    </div>
  );
};
