import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, DollarSign, FileText, TrendingUp, Settings, PieChart, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FinancialManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string; // يجب أن يأتي من context الخاص بالمستخدم
}

export const FinancialManagementModal: React.FC<FinancialManagementModalProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const { toast } = useToast();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // التحقق من صلاحيات المستخدم (مدير قسم فأعلى)
  const hasPermission = ['department_manager', 'finance_admin', 'owner', 'cfo'].includes(userRole.toLowerCase());

  const financialActions = [
    {
      id: 'budget_planning',
      title: 'تخطيط الميزانية',
      description: 'إنشاء وتعديل خطط الميزانية الشهرية والسنوية',
      icon: Calculator,
      color: 'text-blue-600'
    },
    {
      id: 'expense_approval',
      title: 'موافقة المصروفات',
      description: 'مراجعة والموافقة على طلبات المصروفات',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'financial_reports',
      title: 'التقارير المالية',
      description: 'إنشاء وتصدير التقارير المالية الشاملة',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 'cash_flow',
      title: 'إدارة التدفق النقدي',
      description: 'مراقبة وتنبؤ التدفقات النقدية',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      id: 'financial_analysis',
      title: 'التحليل المالي',
      description: 'تحليل الأداء المالي ومؤشرات الربحية',
      icon: PieChart,
      color: 'text-indigo-600'
    },
    {
      id: 'financial_settings',
      title: 'إعدادات النظام المالي',
      description: 'تكوين الحسابات والضرائب والسياسات المالية',
      icon: Settings,
      color: 'text-gray-600'
    }
  ];

  const handleActionClick = (actionId: string) => {
    if (!hasPermission) {
      toast({
        title: "غير مخول للوصول",
        description: "هذه الوظيفة متاحة فقط لمدير القسم فأعلى",
        variant: "destructive",
      });
      return;
    }

    setSelectedAction(actionId);
    const action = financialActions.find(a => a.id === actionId);
    
    toast({
      title: "تم اختيار العملية",
      description: `سيتم فتح: ${action?.title}`,
    });

    // هنا يمكن إضافة المنطق الخاص بكل عملية
    console.log(`تم اختيار العملية: ${actionId}`);
    
    // إغلاق النافذة بعد 2 ثانية للعرض فقط
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden font-arabic"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
          >
            <X className="text-black" size={18} />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-right font-arabic text-black">
              إدارة الأوضاع المالية
            </DialogTitle>
            <p className="text-sm text-black/70 text-right mt-2">
              اختر العملية المالية التي تريد تنفيذها
            </p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-8 pb-4 flex-1 overflow-y-auto">
          {!hasPermission && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm text-center font-arabic">
                ⚠️ أنت غير مخول للوصول إلى هذه الوظائف. هذه العمليات متاحة فقط لمدير القسم فأعلى.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className={`
                  bg-white/60 backdrop-blur-sm border border-black/20 rounded-xl p-6 
                  cursor-pointer transition-all duration-200 hover:bg-white/80 hover:scale-[1.02]
                  ${selectedAction === action.id ? 'ring-2 ring-black/30' : ''}
                  ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black font-arabic mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-black/70 font-arabic leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/50 ${action.color}`}>
                    <action.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-8 pb-8">
          <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
            <Button
              onClick={onClose}
              className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full"
            >
              إغلاق
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/50 font-arabic rounded-full"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};