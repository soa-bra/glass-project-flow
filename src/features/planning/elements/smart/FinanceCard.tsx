import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FinanceCardData {
  title?: string;
  totalBudget?: number;
  spentAmount?: number;
  remainingBudget?: number;
  revenue?: number;
  expenses?: number;
  profit?: number;
  profitMargin?: number;
  categories?: { name: string; amount: number; percentage: number; color: string }[];
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
}

interface FinanceCardProps {
  data: FinanceCardData;
  onUpdate: (data: Partial<FinanceCardData>) => void;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({ data }) => {
  const title = data.title || 'نظرة مالية';
  const totalBudget = data.totalBudget || 0;
  const spentAmount = data.spentAmount || 0;
  const remainingBudget = data.remainingBudget ?? (totalBudget - spentAmount);
  const revenue = data.revenue || 0;
  const expenses = data.expenses || 0;
  const profit = data.profit ?? (revenue - expenses);
  const profitMargin = data.profitMargin ?? (revenue > 0 ? (profit / revenue) * 100 : 0);
  const trend = data.trend || 'stable';
  const trendPercentage = data.trendPercentage || 0;

  const budgetUsedPercentage = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;
  const isOverBudget = budgetUsedPercentage > 100;

  const defaultCategories = [
    { name: 'رواتب', amount: 45000, percentage: 45, color: 'hsl(var(--accent-blue))' },
    { name: 'تشغيل', amount: 25000, percentage: 25, color: 'hsl(var(--accent-green))' },
    { name: 'تسويق', amount: 20000, percentage: 20, color: 'hsl(var(--accent-yellow))' },
    { name: 'أخرى', amount: 10000, percentage: 10, color: 'hsl(var(--accent-red))' },
  ];

  const categories = data.categories || defaultCategories;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-green-600" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        
        {trend !== 'stable' && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trendPercentage}%
          </div>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 border-b border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">الإيرادات</p>
          <p className="font-bold text-green-600">{revenue.toLocaleString('ar-SA')} ﷼</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-xs text-muted-foreground mb-1">المصروفات</p>
          <p className="font-bold text-red-600">{expenses.toLocaleString('ar-SA')} ﷼</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">الربح</p>
          <p className={cn("font-bold", profit >= 0 ? "text-green-600" : "text-red-600")}>
            {profit.toLocaleString('ar-SA')} ﷼
          </p>
        </div>
      </div>

      {/* Budget Progress */}
      {totalBudget > 0 && (
        <div className="p-3 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">استهلاك الميزانية</span>
            <span className={cn(
              "text-sm font-bold",
              isOverBudget ? "text-red-600" : "text-foreground"
            )}>
              {budgetUsedPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.min(budgetUsedPercentage, 100)} 
            className={cn("h-2", isOverBudget && "[&>div]:bg-red-500")}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>المصروف: {spentAmount.toLocaleString('ar-SA')} ﷼</span>
            <span>المتبقي: {remainingBudget.toLocaleString('ar-SA')} ﷼</span>
          </div>
        </div>
      )}

      {/* Categories Breakdown */}
      <div className="flex-1 p-3">
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">توزيع المصروفات</span>
        </div>
        
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs">{cat.name}</span>
                </div>
                <span className="text-xs font-medium">{cat.percentage}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profit Margin */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">هامش الربح</span>
          <div className="flex items-center gap-2">
            {profitMargin >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              "font-bold",
              profitMargin >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
