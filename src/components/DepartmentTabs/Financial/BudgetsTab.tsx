
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Download } from 'lucide-react';
import { mockBudgetTree } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

export const BudgetsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black font-arabic mx-[30px]">إدارة الميزانيات</h3>
        <Button className="rounded-full mx-[25px] bg-transparent border border-black/20 text-black hover:bg-black/5">
          <FileText className="w-4 h-4 mr-2" />
          إنشاء ميزانية جديدة
        </Button>
      </div>

      <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black font-arabic">شجرة الميزانيات</h3>
          <CircularIconButton 
            icon={Download}
            size="sm"
            className="w-8 h-8 bg-transparent border border-black/20 text-black"
          />
        </div>
        <div className="bg-transparent">
          {mockBudgetTree.map(budget => (
            <div key={budget.id} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-transparent border border-black/10">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-black" />
                  <div>
                    <h4 className="text-sm font-bold text-black font-arabic">{budget.name}</h4>
                    <p className="text-sm font-medium text-black font-arabic">{formatCurrency(budget.amount)}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-normal text-black ${
                  budget.status === 'active' ? 'bg-[#bdeed3]' :
                  budget.status === 'pending' ? 'bg-[#fbe2aa]' :
                  budget.status === 'over' ? 'bg-[#f1b5b9]' :
                  'bg-[#d9d2fd]'
                }`}>
                  {getStatusText(budget.status)}
                </div>
              </div>
              
              <div className="ml-8 space-y-2">
                {budget.children?.map(child => (
                  <div key={child.id} className="flex items-center justify-between p-3 border border-black/10 rounded-2xl bg-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-black/20 rounded-full"></div>
                      <div>
                        <h5 className="text-sm font-medium text-black font-arabic">{child.name}</h5>
                        <p className="text-sm font-normal text-black font-arabic">{formatCurrency(child.amount)}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-normal text-black ${
                      child.status === 'active' ? 'bg-[#bdeed3]' :
                      child.status === 'pending' ? 'bg-[#fbe2aa]' :
                      child.status === 'over' ? 'bg-[#f1b5b9]' :
                      'bg-[#d9d2fd]'
                    }`}>
                      {getStatusText(child.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
