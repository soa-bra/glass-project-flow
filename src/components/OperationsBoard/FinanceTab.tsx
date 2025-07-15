import React, { useState } from 'react';
import { BudgetVsActualChart } from './Finance/BudgetVsActualChart';
import { CashFlowForecast } from './Finance/CashFlowForecast';
import { FinancialKPICards } from './Finance/FinancialKPICards';
import { ExportButton } from './Finance/ExportButton';
import { ExpenseModal } from './Finance/ExpenseModal';
import { ApprovalRequestModal } from './Finance/ApprovalRequestModal';
import { AnalysisModal } from './Finance/AnalysisModal';
import { Plus, CheckCircle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface MonthlyBudget {
  month: string;
  budget: number;
  actual: number;
  variance: number;
}
interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeBalance: number;
}
interface FinancialKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number';
}
export interface FinanceData {
  monthlyBudget: MonthlyBudget[];
  cashFlow: CashFlowData[];
  kpis: FinancialKPI[];
  totalBudget: number;
  totalSpent: number;
  forecastAccuracy: number;
}
interface FinanceTabProps {
  data?: FinanceData;
  loading: boolean;
}
export const FinanceTab: React.FC<FinanceTabProps> = ({
  data,
  loading
}) => {
  const { toast } = useToast();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [financeData, setFinanceData] = useState(data);

  // محاكاة دور المستخدم (في التطبيق الحقيقي سيتم جلبه من نظام المصادقة)
  const userRole = 'project_manager'; // project_manager, finance_manager, admin

  const canRequestApproval = ['project_manager', 'department_manager', 'admin'].includes(userRole);
  const canViewAnalysis = ['project_manager', 'department_manager', 'finance_manager', 'admin'].includes(userRole);

  if (loading || !financeData) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  const handleExpenseAdded = (expense: any) => {
    // تحديث البيانات المالية
    const updatedData = {
      ...financeData,
      totalSpent: financeData.totalSpent + expense.amount,
      // تحديث بيانات أخرى حسب الحاجة
    };
    setFinanceData(updatedData);
    
    toast({
      title: "تم إضافة المصروف بنجاح",
      description: `تم خصم ${expense.amount} ريال من ميزانية المشروع`
    });
  };

  const handleApprovalRequestSubmitted = (request: any) => {
    toast({
      title: "تم إرسال طلب الموافقة",
      description: "سيتم إشعارك عند مراجعة الطلب من قبل الإدارة المالية"
    });
  };
  return <div style={{
    backgroundColor: '#f3ffff'
  }} className="space-y-4 h-full overflow-auto bg-transparent">
      {/* العنوان و KPI في نفس السطر */}
      <div className="flex justify-between items-start px-6 pt-6" style={{
        backgroundColor: '#f3ffff'
      }}>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">الوضع المالي</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">مراقبة الأداء المالي الكلي والتنبؤات النقدية</p>
        </div>
        <div className="flex-1 max-w-2xl">
          <FinancialKPICards kpis={financeData.kpis} />
        </div>
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <BudgetVsActualChart monthlyData={financeData.monthlyBudget} />
        <CashFlowForecast cashFlowData={financeData.cashFlow} />
      </div>
      
      {/* أزرار الإجراءات المالية */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* زر إضافة مصروف */}
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-arabic"
          >
            <Plus size={20} />
            <span>إضافة مصروف</span>
          </button>

          {/* زر طلب موافقة */}
          <button
            onClick={() => setShowApprovalModal(true)}
            disabled={!canRequestApproval}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-arabic ${
              canRequestApproval
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle size={20} />
            <span>طلب موافقة</span>
          </button>

          {/* زر عرض التحليل */}
          <button
            onClick={() => setShowAnalysisModal(true)}
            disabled={!canViewAnalysis}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-arabic ${
              canViewAnalysis
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <BarChart3 size={20} />
            <span>عرض التحليل</span>
          </button>
        </div>
      </div>
      
      {/* أدوات التصدير والتحليل */}
      <div className="flex justify-between items-center pt-4 px-6">
        <div className="text-sm font-normal text-black font-arabic">
          دقة التنبؤات: {financeData.forecastAccuracy}%
        </div>
        <ExportButton />
      </div>
      {/* النوافذ المنبثقة */}
      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onExpenseAdded={handleExpenseAdded}
      />

      <ApprovalRequestModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onRequestSubmitted={handleApprovalRequestSubmitted}
      />

      <AnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        budgetData={{
          totalBudget: financeData.totalBudget,
          totalSpent: financeData.totalSpent,
          remaining: financeData.totalBudget - financeData.totalSpent,
          forecastAccuracy: financeData.forecastAccuracy
        }}
      />
    </div>;
};