
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockInvoices } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';

export const InvoicesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">الفواتير والمدفوعات</h3>
        <Button>
          <Receipt className="w-4 h-4 mr-2" />
          إنشاء فاتورة
        </Button>
      </div>

      <BaseCard variant="operations" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>جدول الفواتير</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            {mockInvoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{invoice.id}</h4>
                    <p className="text-sm text-gray-600">{invoice.client}</p>
                    <p className="text-xs text-gray-500">تاريخ الاستحقاق: {invoice.dueDate}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusText(invoice.status)}
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
