import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockBudgetTree } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
export const BudgetsTab: React.FC = () => {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium mx-[30px]">إدارة الميزانيات</h3>
        <Button className="rounded-full mx-[25px]">
          <FileText className="w-4 h-4 mr-2" />
          إنشاء ميزانية جديدة
        </Button>
      </div>

      <BaseCard variant="operations" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>شجرة الميزانيات</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {mockBudgetTree.map(budget => <div key={budget.id} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-transparent">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5" />
                  <div>
                    <h4 className="font-semibold">{budget.name}</h4>
                    <p className="text-sm text-gray-600">{formatCurrency(budget.amount)}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(budget.status)}>
                  {getStatusText(budget.status)}
                </Badge>
              </div>
              
              <div className="ml-8 space-y-2">
                {budget.children?.map(child => <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div>
                        <h5 className="font-medium">{child.name}</h5>
                        <p className="text-sm text-gray-600">{formatCurrency(child.amount)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(child.status)}>
                      {getStatusText(child.status)}
                    </Badge>
                  </div>)}
              </div>
            </div>)}
        </CardContent>
      </BaseCard>
    </div>;
};