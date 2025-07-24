
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockBudgetTree } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
import { CreateBudgetModal } from './CreateBudgetModal';

export const BudgetsTab: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#bdeed3] text-black';
      case 'completed': return 'bg-[#a4e2f6] text-black';
      case 'overbudget': return 'bg-[#f1b5b9] text-black';
      case 'pending': return 'bg-[#fbe2aa] text-black';
      default: return 'bg-[#d9d2fd] text-black';
    }
  };

  const handleBudgetCreated = (budgetData: any) => {
    console.log('Budget created:', budgetData);
    // Here you would typically update the budget tree with the new budget
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-large font-semibold text-black font-arabic mx-[30px]">إدارة الميزانيات</h3>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium mx-[25px] flex items-center gap-2 hover:bg-black/90 transition-colors"
        >
          <FileText className="w-4 h-4" />
          إنشاء ميزانية جديدة
        </button>
      </div>

      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">شجرة الميزانيات</h3>
        </div>
        <div className="px-0">
          {mockBudgetTree.map(budget => (
            <div key={budget.id} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-3xl bg-transparent border border-black/10">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-black" />
                  <div>
                    <h4 className="text-sm font-bold text-black font-arabic">{budget.name}</h4>
                    <p className="text-sm font-normal text-black font-arabic">{formatCurrency(budget.amount)}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-normal ${getBudgetStatusColor(budget.status)}`}>
                  {getStatusText(budget.status)}
                </div>
              </div>
              
              <div className="ml-8 space-y-2">
                {budget.children?.map(child => (
                  <div key={child.id} className="flex items-center justify-between p-3 bg-transparent border border-black/10 rounded-3xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                      <div>
                        <h5 className="text-sm font-medium text-black font-arabic">{child.name}</h5>
                        <p className="text-sm font-normal text-black font-arabic">{formatCurrency(child.amount)}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-normal ${getBudgetStatusColor(child.status)}`}>
                      {getStatusText(child.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBudgetCreated={handleBudgetCreated}
      />
    </div>
  );
};
