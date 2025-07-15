import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BudgetVsActualChart } from './Finance/BudgetVsActualChart';
import { CashFlowForecast } from './Finance/CashFlowForecast';
import { FinancialKPICards } from './Finance/FinancialKPICards';
import { ExportButton } from './Finance/ExportButton';
import { ExpenseModal } from './Finance/ExpenseModal';
import { ApprovalRequestModal } from './Finance/ApprovalRequestModal';
import { AnalysisModal } from './Finance/AnalysisModal';
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
  const [expenses, setExpenses] = useState<any[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);

  // محاكاة صلاحيات المستخدم (سيتم ربطها بنظام المصادقة لاحقاً)
  const userRole = 'project_manager'; // أو 'team_member'
  const canRequestApproval = ['project_manager', 'department_manager', 'owner'].includes(userRole);
  const canViewAnalysis = ['project_manager', 'department_manager', 'owner'].includes(userRole);

  const handleExpenseAdded = (expense: any) => {
    setExpenses(prev => [...prev, expense]);
    // تحديث بيانات الميزانية
    toast({
      title: "تم إضافة المصروف بنجاح",
      description: `تم خصم ${expense.amount} ريال من ميزانية المشروع`
    });
  };

  const handleApprovalRequestSubmitted = (request: any) => {
    setApprovalRequests(prev => [...prev, request]);
    // إرسال إشعارات للمدير المالي والأدمن
    toast({
      title: "تم إرسال طلب الموافقة",
      description: "سيتم إشعارك عند مراجعة الطلب"
    });
  };

  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }
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
          <FinancialKPICards kpis={data.kpis} />
        </div>
      </div>
      
      {/* صندوق أدوات إدارة ميزانية المشروع */}
      <div className="px-6">
        <div className="bg-white/40 backdrop-blur-[20px] rounded-3xl p-6 border border-white/20 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black font-arabic text-right">
              أدوات إدارة ميزانية المشروع
            </h3>
            <div className="text-sm text-gray-600 font-arabic">
              إجمالي الميزانية: {data.totalBudget.toLocaleString()} ريال | 
              المستخدم: {data.totalSpent.toLocaleString()} ريال
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* زر إضافة مصروف */}
            <Button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 p-4 h-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-arabic"
            >
              <Plus className="w-5 h-5" />
              <div className="text-right">
                <div className="font-semibold">إضافة مصروف</div>
                <div className="text-xs opacity-90">تسجيل مصروف جديد</div>
              </div>
            </Button>

            {/* زر طلب موافقة */}
            <Button
              onClick={() => setShowApprovalModal(true)}
              disabled={!canRequestApproval}
              className="flex items-center gap-2 p-4 h-auto bg-green-600 hover:bg-green-700 text-white rounded-xl font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCheck className="w-5 h-5" />
              <div className="text-right">
                <div className="font-semibold">طلب موافقة</div>
                <div className="text-xs opacity-90">
                  {canRequestApproval ? 'طلب ميزانية إضافية' : 'مقيد للمديرين'}
                </div>
              </div>
            </Button>

            {/* زر عرض التحليل */}
            <Button
              onClick={() => setShowAnalysisModal(true)}
              disabled={!canViewAnalysis}
              className="flex items-center gap-2 p-4 h-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="w-5 h-5" />
              <div className="text-right">
                <div className="font-semibold">عرض التحليل</div>
                <div className="text-xs opacity-90">
                  {canViewAnalysis ? 'تحليل بالذكاء الاصطناعي' : 'مقيد للمديرين'}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <BudgetVsActualChart monthlyData={data.monthlyBudget} />
        <CashFlowForecast cashFlowData={data.cashFlow} />
      </div>
      
      {/* أدوات التصدير والتحليل */}
      <div className="flex justify-between items-center pt-4 px-6">
        <div className="text-sm font-normal text-black font-arabic">
          دقة التنبؤات: {data.forecastAccuracy}%
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
        projectData={{
          totalBudget: data.totalBudget,
          totalSpent: data.totalSpent,
          monthlyBudget: data.monthlyBudget
        }}
      />
    </div>;
};