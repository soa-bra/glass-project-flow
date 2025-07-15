import React, { useState } from 'react';
import { StatusBox } from '@/components/custom/StatusBox';
import { ClientProfile } from '@/components/custom/ClientProfile';
import { TeamRoster } from '@/components/custom/TeamRoster';
import { DocumentsGrid } from '@/components/custom/DocumentsGrid';
import { TemplateLibrary } from '@/components/custom/TemplateLibrary';
import { ExpenseModal } from '@/components/custom/ExpenseModal';
import { ApprovalRequestModal } from '@/components/custom/ApprovalRequestModal';
import { FinancialAnalysisModal } from '@/components/custom/FinancialAnalysisModal';
import { TaskAssignmentModal } from '@/components/custom/TaskAssignmentModal';
import { TaskRedistributionModal } from '@/components/custom/TaskRedistributionModal';

// تبويب الوضع المالي
export const FinancialTab = ({
  data
}: any) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isApprovalRequestOpen, setIsApprovalRequestOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState({
    totalBudget: 50000,
    totalExpenses: 35000,
    expenses: [
      { category: 'رواتب الفريق والمكافآت', amount: 20000, percentage: 57, color: '#fbe2aa' },
      { category: 'أدوات وبرمجيات متخصصة', amount: 8000, percentage: 23, color: '#a4e2f6' },
      { category: 'استشارات خارجية وخدمات', amount: 5000, percentage: 14, color: '#d9d2fd' },
      { category: 'مصاريف إدارية وأخرى', amount: 2000, percentage: 6, color: '#f1b5b9' }
    ]
  });

  const handleAddExpense = (expense: {
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    setFinancialData(prev => {
      const newTotalExpenses = prev.totalExpenses + expense.amount;
      const newExpenses = [...prev.expenses];
      
      // Find and update the category
      const categoryIndex = newExpenses.findIndex(exp => exp.category === expense.category);
      if (categoryIndex !== -1) {
        newExpenses[categoryIndex].amount += expense.amount;
      }
      
      // Recalculate percentages
      const updatedExpenses = newExpenses.map(exp => ({
        ...exp,
        percentage: Math.round((exp.amount / newTotalExpenses) * 100)
      }));

      return {
        ...prev,
        totalExpenses: newTotalExpenses,
        expenses: updatedExpenses
      };
    });
  };

  const handleApprovalRequest = (request: {
    requiredBudget: number;
    justification: string;
    attachments: File[];
  }) => {
    const newRequest = {
      id: Date.now().toString(),
      ...request,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedBy: 'مدير المشروع', // This should come from user context
    };
    
    setApprovalRequests(prev => [...prev, newRequest]);
    
    // Here you would typically send notifications to Financial Manager and Admin
    console.log('طلب موافقة مالية جديد:', newRequest);
    alert('تم إرسال طلب الموافقة المالية بنجاح وسيتم مراجعته من قبل الإدارة المالية');
  };

  const remainingBudget = financialData.totalBudget - financialData.totalExpenses;
  const remainingPercentage = Math.round((remainingBudget / financialData.totalBudget) * 100);
  const expensePercentage = Math.round((financialData.totalExpenses / financialData.totalBudget) * 100);
  const expectedProfit = remainingBudget - (financialData.totalBudget * 0.1); // Assuming 10% operational costs

  return <div className="space-y-6">
      {/* حالة الميزانية */}
      <div className="bg-[#96d8d0] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">الحالة المالية</h3>
          <div className="bg-[#bdeed3] px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-black">مستقرة</span>
          </div>
        </div>
        <p className="text-sm font-medium text-black">المشروع ضمن الميزانية المحددة ويسير وفق الخطة المالية المعتمدة</p>
      </div>

      {/* الإحصائيات المالية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المتبقي من الميزانية</h4>
          <p className="text-2xl font-bold text-black mb-1">{remainingBudget.toLocaleString()} ر.س</p>
          <p className="text-sm font-normal text-black">من إجمالي {financialData.totalBudget.toLocaleString()} ر.س</p>
          <div className="mt-3">
            <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
              <span className="text-sm font-medium text-black">{remainingPercentage}% متبقية</span>
            </div>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي المصروفات</h4>
          <p className="text-2xl font-bold text-black mb-1">{financialData.totalExpenses.toLocaleString()} ر.س</p>
          <p className="text-sm font-normal text-black">{expensePercentage}% من الميزانية المخططة</p>
          <div className="mt-3">
            <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
              <span className="text-sm font-medium text-black">ضمن الحدود</span>
            </div>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">الربح المتوقع</h4>
          <p className="text-2xl font-bold text-black mb-1">{Math.max(0, expectedProfit).toLocaleString()} ر.س</p>
          <p className="text-sm font-normal text-black">{Math.round((expectedProfit / financialData.totalBudget) * 100)}% هامش ربح متوقع</p>
          <div className="mt-3">
            <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
              <span className="text-sm font-medium text-black">مربح</span>
            </div>
          </div>
        </div>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">تفصيل المصروفات حسب الفئة</h3>
        <div className="space-y-4">
          {financialData.expenses.map((expense, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-transparent border border-black/10 rounded-full">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full`} style={{ backgroundColor: expense.color }}>
                  <span className="text-sm font-medium text-black">{expense.percentage}%</span>
                </div>
                <span className="text-sm font-bold text-black">{expense.amount.toLocaleString()} ر.س</span>
              </div>
              <span className="text-sm font-bold text-black">{expense.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* التدفق النقدي المتوقع */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">التدفق النقدي المتوقع (الأشهر القادمة)</h3>
          <div className="flex gap-2">
            
            <button className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors">
              تصدير التقرير
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-transparent border border-black/10 rounded-3xl">
            <h4 className="text-sm font-bold text-black mb-2">الشهر الحالي</h4>
            <p className="text-2xl font-bold text-black mb-1">8,000 ر.س</p>
            <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">مدفوعات جزئية</span>
            </div>
          </div>
          <div className="p-4 bg-transparent border border-black/10 rounded-3xl">
            <h4 className="text-sm font-bold text-black mb-2">الشهر القادم</h4>
            <p className="text-2xl font-bold text-black mb-1">12,000 ر.س</p>
            <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">مرحلة متوسطة</span>
            </div>
          </div>
          <div className="p-4 bg-transparent border border-black/10 rounded-3xl">
            <h4 className="text-sm font-bold text-black mb-2">بعد شهرين</h4>
            <p className="text-2xl font-bold text-black mb-1">15,000 ر.س</p>
            <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">مرحلة نهائية</span>
            </div>
          </div>
          <div className="p-4 bg-transparent border border-black/10 rounded-3xl">
            <h4 className="text-sm font-bold text-black mb-2">المتبقي بعد التسليم</h4>
            <p className="text-2xl font-bold text-black mb-1">15,000 ر.س</p>
            <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-black">دفعة إغلاق</span>
            </div>
          </div>
        </div>
      </div>

      {/* أدوات إدارة الميزانية */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">أدوات إدارة ميزانية المشروع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-black/10 bg-transparent">
            <h4 className="font-bold text-black mb-3 text-base">إضافة مصروف جديد</h4>
            <p className="text-xs text-black/70 mb-3">تسجيل مصروف جديد وتصنيفه حسب الفئة</p>
            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors"
            >
              إضافة مصروف
            </button>
          </div>
          <div className="p-4 rounded-2xl border border-black/10 bg-transparent">
            <h4 className="font-bold text-black mb-3 text-base">طلب موافقة مالية</h4>
            <p className="text-xs text-black/70 mb-3">تقديم طلب موافقة على تعديل الميزانية</p>
            <button 
              onClick={() => setIsApprovalRequestOpen(true)}
              className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors"
            >
              طلب موافقة
            </button>
          </div>
          <div className="p-4 rounded-2xl border border-black/10 bg-transparent">
            <h4 className="font-bold text-black mb-3 text-base">تحليل الانحرافات</h4>
            <p className="text-xs text-black/70 mb-3">مراجعة الانحرافات عن الميزانية المخططة</p>
            <button 
              onClick={() => setIsAnalysisModalOpen(true)}
              className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors"
            >
              عرض التحليل
            </button>
          </div>
        </div>
      </div>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleAddExpense}
      />
      
      <ApprovalRequestModal
        isOpen={isApprovalRequestOpen}
        onClose={() => setIsApprovalRequestOpen(false)}
        onSave={handleApprovalRequest}
      />
      
      <FinancialAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
      />
    </div>;
};

// تبويب العميل
export const ClientTab = ({
  clientData
}: any) => {
  const mockClient = {
    id: '1',
    name: 'شركة التقنية المتقدمة',
    company: 'شركة التقنية المتقدمة',
    email: 'info@techcompany.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    contractStatus: 'active' as const,
    joinDate: '2024-01-01',
    totalProjects: 5,
    sentiment: 0.85
  };
  return <div className="space-y-6">
      {/* حالة رضا العميل */}
      <div className="bg-[#96d8d0] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">رضا العميل</h3>
          <div className="bg-[#bdeed3] px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-black">ممتاز</span>
          </div>
        </div>
        <p className="text-sm font-medium text-black">العميل راضٍ جداً عن سير المشروع والتسليم في المواعيد المحددة</p>
      </div>
      
      {/* إحصائيات العميل */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">تقييم العميل</h4>
          <p className="text-2xl font-bold text-black mb-1">4.8/5</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">تقييم ممتاز</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المشاريع السابقة</h4>
          <p className="text-2xl font-bold text-black mb-1">5</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">عميل دائم</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الاستجابة</h4>
          <p className="text-2xl font-bold text-black mb-1">2.1 ساعة</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">سريع الاستجابة</span>
          </div>
        </div>
      </div>
      
      <ClientProfile client={mockClient} />
    </div>;
};

// تبويب الفريق
export const TeamTab = ({
  teamData
}: any) => {
  const [isTaskAssignmentModalOpen, setIsTaskAssignmentModalOpen] = useState(false);
  const [isTaskRedistributionModalOpen, setIsTaskRedistributionModalOpen] = useState(false);
  
  const mockTeamData = [{
    id: '1',
    name: 'أحمد محمد',
    role: 'مطور رئيسي',
    email: 'ahmed@company.com',
    phone: '+966501234567',
    avatar: '',
    productivity: 85,
    availability: 'available' as const,
    currentTasks: 3,
    hoursLogged: 156,
    targetHours: 180
  }, {
    id: '2',
    name: 'فاطمة علي',
    role: 'مصممة واجهات',
    email: 'fatima@company.com',
    phone: '+966502345678',
    avatar: '',
    productivity: 95,
    availability: 'busy' as const,
    currentTasks: 4,
    hoursLogged: 168,
    targetHours: 180
  }, {
    id: '3',
    name: 'محمد خالد',
    role: 'محلل أنظمة',
    email: 'mohammed@company.com',
    phone: '+966503456789',
    avatar: '',
    productivity: 70,
    availability: 'available' as const,
    currentTasks: 2,
    hoursLogged: 125,
    targetHours: 180
  }, {
    id: '4',
    name: 'نورا سعد',
    role: 'مختبرة جودة',
    email: 'nora@company.com',
    phone: '+966504567890',
    avatar: '',
    productivity: 0,
    availability: 'away' as const,
    currentTasks: 0,
    hoursLogged: 0,
    targetHours: 180
  }];
  return <div className="space-y-6">
      {/* حالة الفريق */}
      <div className="bg-[#96d8d0] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">حالة الفريق</h3>
          <div className="bg-[#bdeed3] px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-black">ممتاز</span>
          </div>
        </div>
        <p className="text-sm font-medium text-black">الفريق يعمل بكفاءة عالية ومعدل الإنجاز يتجاوز التوقعات بنسبة 94%</p>
      </div>

      {/* إحصائيات الفريق */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي الأعضاء</h4>
          <p className="text-2xl font-bold text-black mb-1">4</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">أعضاء نشطين</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الأداء العام</h4>
          <p className="text-2xl font-bold text-black mb-1">91%</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">أداء ممتاز</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">معدل الحمولة</h4>
          <p className="text-2xl font-bold text-black mb-1">83%</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">مثالي</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المهام المكتملة</h4>
          <p className="text-2xl font-bold text-black mb-1">47/50</p>
          <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">94% مكتمل</span>
          </div>
        </div>
      </div>

      <TeamRoster data={mockTeamData} />

      {/* أدوات إدارة الفريق */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">أدوات إدارة فريق المشروع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-black/10 bg-transparent">
            <h4 className="text-sm font-bold text-black mb-3">إسناد مهام للموارد البشرية</h4>
            <p className="text-xs text-black/70 mb-3">إسناد مهام المشروع لموظفي قسم الموارد البشرية</p>
            <button 
              onClick={() => setIsTaskAssignmentModalOpen(true)}
              className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors"
            >
              إضافة عضو
            </button>
          </div>
          <div className="p-4 rounded-2xl border border-black/10 bg-transparent">
            <h4 className="text-sm font-bold text-black mb-3">توزيع المهام</h4>
            <p className="text-xs text-black/70 mb-3">إعادة توزيع المهام بين أعضاء الفريق</p>
            <button 
              onClick={() => setIsTaskRedistributionModalOpen(true)}
              className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors"
            >
              توزيع المهام
            </button>
          </div>
          <div className="p-4 rounded-2xl border border-black/10 bg-transparent">
            <h4 className="text-sm font-bold text-black mb-3">تقييم الأداء</h4>
            <p className="text-xs text-black/70 mb-3">إجراء تقييم دوري لأداء الفريق</p>
            <button className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors">
              تقييم الأداء
            </button>
          </div>
        </div>
      </div>

      {/* تحليل توزيع المهارات */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">توزيع المهارات والكفاءات في الفريق</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">تطوير البرمجيات المتقدمة</span>
              <span className="text-sm font-bold text-black">85%</span>
            </div>
            <div className="w-full bg-transparent border border-black/10 rounded-full h-3">
              <div className="bg-[#bdeed3] h-3 rounded-full" style={{
              width: '85%'
            }}></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">تصميم الواجهات التفاعلية</span>
              <span className="text-sm font-bold text-black">92%</span>
            </div>
            <div className="w-full bg-transparent border border-black/10 rounded-full h-3">
              <div className="bg-[#a4e2f6] h-3 rounded-full" style={{
              width: '92%'
            }}></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">تحليل الأنظمة المعقدة</span>
              <span className="text-sm font-bold text-black">78%</span>
            </div>
            <div className="w-full bg-transparent border border-black/10 rounded-full h-3">
              <div className="bg-[#d9d2fd] h-3 rounded-full" style={{
              width: '78%'
            }}></div>
            </div>
          </div>
          <div className="space-y-4 bg-transparent">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">اختبار الجودة والأمان</span>
              <span className="text-sm font-bold text-black bg-transparent ">88%</span>
            </div>
            <div className="w-full bg-transparent border border-black/10 rounded-full h-3">
              <div className="bg-[#f1b5b9] h-3 rounded-full" style={{
              width: '88%'
            }}></div>
            </div>
          </div>
        </div>
      </div>

      <TaskAssignmentModal
        isOpen={isTaskAssignmentModalOpen}
        onClose={() => setIsTaskAssignmentModalOpen(false)}
        onSave={(employeeId, taskIds) => {
          console.log('إسناد مهام:', { employeeId, taskIds });
          alert(`تم إسناد ${taskIds.length} مهام بنجاح إلى الموظف المحدد`);
        }}
      />

      <TaskRedistributionModal
        isOpen={isTaskRedistributionModalOpen}
        onClose={() => setIsTaskRedistributionModalOpen(false)}
        onRedistribute={(redistributedTasks) => {
          console.log('إعادة توزيع المهام:', redistributedTasks);
          alert(`تم إعادة توزيع ${redistributedTasks.length} مهام بنجاح باستخدام الذكاء الاصطناعي`);
        }}
      />
    </div>;
};

// تبويب المرفقات
export const AttachmentsTab = ({
  documents
}: any) => {
  const mockDocuments = [{
    id: '1',
    name: 'مواصفات المشروع.pdf',
    type: 'document' as const,
    size: '2.5 MB',
    uploadDate: '2024-01-15',
    classification: 'Medium' as const,
    version: '1.0',
    uploadedBy: 'أحمد محمد',
    tags: ['مواصفات', 'متطلبات']
  }, {
    id: '2',
    name: 'التصاميم الأولية.figma',
    type: 'image' as const,
    size: '15.8 MB',
    uploadDate: '2024-01-20',
    classification: 'High' as const,
    version: '2.1',
    uploadedBy: 'فاطمة علي',
    tags: ['تصميم', 'واجهات']
  }, {
    id: '3',
    name: 'خطة المشروع.xlsx',
    type: 'document' as const,
    size: '1.2 MB',
    uploadDate: '2024-01-18',
    classification: 'High' as const,
    version: '1.5',
    uploadedBy: 'محمد خالد',
    tags: ['تخطيط', 'جدولة']
  }, {
    id: '4',
    name: 'تقرير الاختبار.docx',
    type: 'document' as const,
    size: '3.7 MB',
    uploadDate: '2024-01-22',
    classification: 'Low' as const,
    version: '1.0',
    uploadedBy: 'نورا سعد',
    tags: ['اختبار', 'جودة']
  }];
  return <div className="space-y-6">
      {/* حالة المرفقات */}
      <div className="bg-[#96d8d0] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">إدارة المرفقات</h3>
          <div className="bg-[#bdeed3] px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-black">محدثة</span>
          </div>
        </div>
        <p className="text-sm font-medium text-black">جميع المستندات محدثة ومنظمة بشكل احترافي - آخر رفع منذ ساعتين</p>
      </div>

      {/* إحصائيات المرفقات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي الملفات</h4>
          <p className="text-2xl font-bold text-black mb-1">23</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">ملف مرفوع</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">الحجم الإجمالي</h4>
          <p className="text-2xl font-bold text-black mb-1">156 MB</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">مساحة مستخدمة</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">الملفات المشتركة</h4>
          <p className="text-2xl font-bold text-black mb-1">8</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">ملفات مشتركة</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">المعدلة حديثاً</h4>
          <p className="text-2xl font-bold text-black mb-1">5</p>
          <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">خلال اليوم</span>
          </div>
        </div>
      </div>

      {/* أدوات إدارة المرفقات */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">أدوات إدارة مرفقات المشروع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 rounded-2xl border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">رفع ملف جديد</h4>
            <p className="text-xs text-black/70 mb-3">إضافة مستندات وملفات جديدة للمشروع</p>
            <button className="w-full px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors">
              رفع ملف
            </button>
          </div>
          <div className="p-4 bg-white/50 rounded-2xl border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">تنظيم المجلدات</h4>
            <p className="text-xs text-black/70 mb-3">إنشاء وتنظيم مجلدات المشروع</p>
            <button className="w-full px-3 py-2 bg-transparent border border-black/20 text-black rounded-full text-sm hover:bg-black/5 transition-colors">
              تنظيم المجلدات
            </button>
          </div>
          <div className="p-4 bg-white/50 rounded-2xl border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">إدارة الصلاحيات</h4>
            <p className="text-xs text-black/70 mb-3">تحديد صلاحيات الوصول للملفات</p>
            <button className="w-full px-3 py-2 bg-transparent border border-black/20 text-black rounded-full text-sm hover:bg-black/5 transition-colors">
              إدارة الصلاحيات
            </button>
          </div>
        </div>
      </div>

      {/* فئات الملفات */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">توزيع الملفات حسب النوع والتصنيف</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">7</p>
            <h4 className="text-sm font-bold text-black mb-2">مستندات PDF</h4>
            <div className="bg-[#f1b5b9] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">تقارير رسمية</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">5</p>
            <h4 className="text-sm font-bold text-black mb-2">مستندات Word</h4>
            <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">وثائق تحريرية</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">4</p>
            <h4 className="text-sm font-bold text-black mb-2">جداول Excel</h4>
            <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">بيانات تحليلية</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">7</p>
            <h4 className="text-sm font-bold text-black mb-2">ملفات أخرى</h4>
            <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">صور وتصاميم</span>
            </div>
          </div>
        </div>
      </div>

      <DocumentsGrid documents={mockDocuments} />
    </div>;
};

// تبويب القوالب
export const TemplatesTab = ({
  templates
}: any) => {
  const mockTemplates = [{
    id: '1',
    name: 'قالب تقرير المشروع الشهري',
    category: 'تقارير',
    downloads: 45,
    lastUsed: '2024-01-20'
  }, {
    id: '2',
    name: 'نموذج اتفاقية العمل',
    category: 'قانوني',
    downloads: 32,
    lastUsed: '2024-01-18'
  }, {
    id: '3',
    name: 'قالب خطة المشروع',
    category: 'تخطيط',
    downloads: 67,
    lastUsed: '2024-01-22'
  }, {
    id: '4',
    name: 'نموذج تقييم الأداء',
    category: 'موارد بشرية',
    downloads: 28,
    lastUsed: '2024-01-15'
  }, {
    id: '5',
    name: 'قالب المراسلات الرسمية',
    category: 'إداري',
    downloads: 51,
    lastUsed: '2024-01-19'
  }, {
    id: '6',
    name: 'نموذج محضر الاجتماع',
    category: 'إداري',
    downloads: 38,
    lastUsed: '2024-01-21'
  }];
  return <div className="space-y-6">
      {/* حالة مكتبة القوالب */}
      <div className="bg-[#96d8d0] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">مكتبة القوالب</h3>
          <div className="bg-[#bdeed3] px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-black">محدثة</span>
          </div>
        </div>
        <p className="text-sm font-medium text-black">القوالب محدثة وجاهزة للاستخدام الفوري - 12 قالب احترافي متاح</p>
      </div>

      {/* إحصائيات القوالب */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي القوالب</h4>
          <p className="text-2xl font-bold text-black mb-1">12</p>
          <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">قالب متاح</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">الأكثر استخداماً</h4>
          <p className="text-2xl font-bold text-black mb-1">6</p>
          <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">قوالب شائعة</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">تم التحديث</h4>
          <p className="text-2xl font-bold text-black mb-1">3</p>
          <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">هذا الأسبوع</span>
          </div>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
          <h4 className="text-lg font-semibold text-black mb-2">إجمالي التحميلات</h4>
          <p className="text-2xl font-bold text-black mb-1">261</p>
          <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
            <span className="text-sm font-medium text-black">هذا الشهر</span>
          </div>
        </div>
      </div>

      {/* فئات القوالب */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <h3 className="text-lg font-semibold text-black mb-6">توزيع القوالب حسب الفئة والاستخدام</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">4</p>
            <h4 className="text-sm font-bold text-black mb-2">قوالب التقارير</h4>
            <div className="bg-[#f1b5b9] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">تقارير دورية</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">3</p>
            <h4 className="text-sm font-bold text-black mb-2">نماذج إدارية</h4>
            <div className="bg-[#a4e2f6] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">إجراءات داخلية</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">2</p>
            <h4 className="text-sm font-bold text-black mb-2">وثائق قانونية</h4>
            <div className="bg-[#d9d2fd] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">عقود واتفاقيات</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">2</p>
            <h4 className="text-sm font-bold text-black mb-2">خطط التخطيط</h4>
            <div className="bg-[#fbe2aa] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">جدولة المشاريع</span>
            </div>
          </div>
          <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
            <p className="text-2xl font-bold text-black mb-1">1</p>
            <h4 className="text-sm font-bold text-black mb-2">موارد بشرية</h4>
            <div className="bg-[#bdeed3] px-3 py-1 rounded-full inline-block">
              <span className="text-xs font-normal text-gray-400">تقييم الأداء</span>
            </div>
          </div>
        </div>
      </div>

      <TemplateLibrary templates={mockTemplates} />
    </div>;
};