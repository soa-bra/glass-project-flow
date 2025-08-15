
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BaseCard } from '@/components/shared/BaseCard';
import { mockBudgetTree } from './data';
import { formatCurrency, getStatusColor, getStatusText } from './utils';
import { CreateBudgetModal } from './CreateBudgetModal';
import { BudgetManagementModal } from './BudgetManagementModal';
import { BudgetTreeItem } from './types';

export const BudgetsTab: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetTreeItem | null>(null);
  const [budgetTree, setBudgetTree] = useState(mockBudgetTree);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([1]));
  
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
    // Budget created successfully
    
    // تحويل البيانات الجديدة لتنسيق شجرة الميزانيات
    const newBudgetTreeItem = {
      id: budgetData.id,
      name: budgetData.name,
      amount: parseFloat(budgetData.totalAmount),
      status: budgetData.status,
      children: budgetData.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        amount: parseFloat(item.amount),
        status: 'approved'
      }))
    };
    
    // إضافة الميزانية الجديدة إلى شجرة الميزانيات
    setBudgetTree(prev => [...prev, newBudgetTreeItem]);
  };

  const handleBudgetClick = (budget: BudgetTreeItem) => {
    setSelectedBudget(budget);
    setIsManagementModalOpen(true);
  };

  const handleBudgetUpdate = (budgetId: number, updateData: any) => {
    // Budget updated successfully
    // هنا يمكن تحديث بيانات الميزانية في القاعدة
  };

  const toggleExpand = (itemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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

      <div className="bg-white p-6 rounded-[40px] border border-[#DADCE0]">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">شجرة الميزانيات</h3>
        </div>
        <div className="px-0">
          {budgetTree.map(budget => (
            <Collapsible 
              key={budget.id} 
              open={expandedItems.has(budget.id)}
              onOpenChange={() => toggleExpand(budget.id)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-3xl bg-transparent border border-black/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3" onClick={() => handleBudgetClick(budget)}>
                    <BookOpen className="h-5 w-5 text-black" />
                    <div>
                      <h4 className="text-sm font-bold text-black font-arabic">{budget.name}</h4>
                      <p className="text-sm font-normal text-black font-arabic">{formatCurrency(budget.amount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-normal ${getBudgetStatusColor(budget.status)}`}>
                      {getStatusText(budget.status)}
                    </div>
                    {budget.children && budget.children.length > 0 && (
                      <CollapsibleTrigger className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-colors">
                        {expandedItems.has(budget.id) ? (
                          <ChevronDown className="h-4 w-4 text-black" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-black" />
                        )}
                      </CollapsibleTrigger>
                    )}
                  </div>
                </div>
                
                <CollapsibleContent className="ml-8">
                  <div className="space-y-2">
                    {budget.children?.map(child => (
                      <div 
                        key={child.id} 
                        className="flex items-center justify-between p-3 bg-transparent border border-black/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleBudgetClick(child)}
                      >
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
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>

      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBudgetCreated={handleBudgetCreated}
      />

      <BudgetManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        budget={selectedBudget}
        onUpdate={handleBudgetUpdate}
      />
    </div>
  );
};
