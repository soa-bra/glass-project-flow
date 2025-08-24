import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface FinanceDashboard {
  project_id: string;
  project_name: string;
  budget: number;
  spent_amount: number;
  remaining_budget: number;
  budget_used_percentage: number;
  expense_categories: any;
  last_expense_date: string;
  expense_trend: 'increasing' | 'decreasing' | 'stable';
}

interface FinanceWidgetProps {
  element: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
}

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({ 
  element, 
  isSelected, 
  onUpdate 
}) => {
  const [financeData, setFinanceData] = useState<FinanceDashboard[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch finance dashboard data
      const { data: financeResponseData, error: financeError } = await supabase.rpc('get_widget_data' as any, {
        widget_type: 'finance_dashboard',
        limit_count: 8
      }) as { data: any[] | null; error: any };

      if (financeError) throw financeError;

      // Fetch finance stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_widget_stats' as any, {
        widget_type: 'finance_dashboard'
      }) as { data: any; error: any };

      if (statsError) throw statsError;

      setFinanceData(financeResponseData?.map((item: any) => item.data) || []);
      setStats(statsData || {});
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('فشل في تحميل البيانات المالية');
    } finally {
      setLoading(false);
    }
  };

  const getBudgetStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-accent-red';
    if (percentage >= 75) return 'text-accent-yellow';
    return 'text-accent-green';
  };

  const getBudgetBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-accent-red';
    if (percentage >= 90) return 'bg-accent-yellow';
    return 'bg-accent-green';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➖';
      default: return '📊';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-gray-300'} p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-red-300'} p-6`}>
        <div className="text-center text-red-500">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchFinanceData}
            className="mt-2 px-4 py-2 bg-accent-red text-white rounded-lg text-sm hover:bg-accent-red/80 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-white rounded-2xl border-2 ${isSelected ? 'border-black' : 'border-gray-200'} shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-green to-accent-blue p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">لوحة المالية</h3>
          <div className="text-xs opacity-90">
            {financeData.length} مشروع
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-bold">{formatCurrency(stats.total_budget || 0)}</div>
            <div className="text-xs opacity-90">إجمالي الميزانيات</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-bold">{formatCurrency(stats.total_spent || 0)}</div>
            <div className="text-xs opacity-90">إجمالي المُنفق</div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="mt-3 flex justify-between text-center">
          <div>
            <div className="text-lg font-bold">{Math.round(stats.avg_budget_usage || 0)}%</div>
            <div className="text-xs opacity-90">متوسط الاستخدام</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-red">{stats.projects_over_budget || 0}</div>
            <div className="text-xs opacity-90">تجاوز الميزانية</div>
          </div>
        </div>
      </div>

      {/* Finance Data */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        {financeData.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-sm">لا توجد بيانات مالية</p>
          </div>
        ) : (
          financeData.map((project, index) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Project Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-black text-sm mb-1">
                    {project.project_name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{getTrendIcon(project.expense_trend)}</span>
                    <span>آخر مصروف: {formatDate(project.last_expense_date)}</span>
                  </div>
                </div>
                
                <div className={`text-right ${getBudgetStatusColor(project.budget_used_percentage)}`}>
                  <div className="text-sm font-bold">
                    {Math.round(project.budget_used_percentage)}%
                  </div>
                  <div className="text-xs">مُستخدم</div>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>الميزانية المستخدمة</span>
                  <span>{formatCurrency(project.spent_amount)} من {formatCurrency(project.budget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getBudgetBarColor(project.budget_used_percentage)}`}
                    style={{ width: `${Math.min(project.budget_used_percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">الميزانية الكلية:</span>
                  <div className="font-bold text-black">
                    {formatCurrency(project.budget)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">المبلغ المُنفق:</span>
                  <div className="font-bold text-accent-red">
                    {formatCurrency(project.spent_amount)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">المتبقي:</span>
                  <div className={`font-bold ${project.remaining_budget >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {formatCurrency(project.remaining_budget)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">حالة الميزانية:</span>
                  <div className={`font-bold ${getBudgetStatusColor(project.budget_used_percentage)}`}>
                    {project.budget_used_percentage >= 100 ? 'تجاوزت الميزانية' :
                     project.budget_used_percentage >= 90 ? 'قريبة من النفاد' :
                     project.budget_used_percentage >= 75 ? 'تحت المراقبة' : 'آمنة'}
                  </div>
                </div>
              </div>

              {/* Expense Categories Preview */}
              {project.expense_categories && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">فئات المصروفات الرئيسية:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(project.expense_categories).slice(0, 3).map(([category, amount]: [string, any]) => (
                      <span key={category} className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded text-xs">
                        {category}: {formatCurrency(amount)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <button 
          onClick={fetchFinanceData}
          className="text-xs text-accent-green hover:text-accent-green/80 transition-colors"
        >
          🔄 تحديث البيانات المالية
        </button>
      </div>
    </div>
  );
};