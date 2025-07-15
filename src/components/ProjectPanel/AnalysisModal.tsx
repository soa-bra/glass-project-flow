import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart } from 'lucide-react';

interface AnalysisData {
  totalBudget: number;
  totalExpenses: number;
  budgetRemaining: number;
  expenses: Array<{
    id: number;
    category: string;
    amount: number;
    description: string;
    date: string;
  }>;
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisData;
  userRole?: string;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ 
  isOpen, 
  onClose, 
  data,
  userRole = 'team_member'
}) => {
  // Check if user has permission (Project Manager or above)
  const hasPermission = ['project_manager', 'department_manager', 'admin', 'owner'].includes(userRole);

  // Generate AI analysis
  const generateAnalysis = () => {
    const utilizationRate = (data.totalExpenses / data.totalBudget) * 100;
    const remainingRate = ((data.totalBudget - data.totalExpenses) / data.totalBudget) * 100;
    
    // Calculate category breakdown
    const categoryTotals = data.expenses.reduce((acc: any, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryTotals).reduce((a: any, b: any) => 
      categoryTotals[a[0]] > categoryTotals[b[0]] ? a : b
    );

    return {
      utilizationRate,
      remainingRate,
      status: utilizationRate > 80 ? 'warning' : utilizationRate > 60 ? 'caution' : 'good',
      topCategory: topCategory[0],
      topCategoryAmount: topCategory[1],
      categoryTotals,
      projectedOverrun: utilizationRate > 85 ? (data.totalExpenses * 1.15) - data.totalBudget : 0,
      recommendations: generateRecommendations(utilizationRate, categoryTotals, data.totalBudget)
    };
  };

  const generateRecommendations = (utilizationRate: number, categoryTotals: any, totalBudget: number) => {
    const recommendations = [];

    if (utilizationRate > 85) {
      recommendations.push({
        type: 'urgent',
        icon: AlertTriangle,
        title: 'تحذير: اقتراب من تجاوز الميزانية',
        description: 'معدل الاستهلاك الحالي يشير إلى احتمالية تجاوز الميزانية المخططة. يُنصح بمراجعة المصروفات غير الضرورية فوراً.'
      });
    }

    if (categoryTotals['تشغيلية'] > totalBudget * 0.4) {
      recommendations.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'المصروفات التشغيلية مرتفعة',
        description: 'المصروفات التشغيلية تتجاوز 40% من إجمالي الميزانية. فكر في إعادة تفاوض الإيجار أو تحسين كفاءة العمليات.'
      });
    }

    if (utilizationRate < 50) {
      recommendations.push({
        type: 'info',
        icon: CheckCircle,
        title: 'أداء مالي ممتاز',
        description: 'المشروع يسير بوتيرة مالية محافظة. يمكن الاستثمار في تحسينات إضافية أو تسريع الجدول الزمني.'
      });
    }

    recommendations.push({
      type: 'suggestion',
      icon: BarChart,
      title: 'توصية ذكية',
      description: `بناءً على النمط الحالي للإنفاق، من المتوقع إنهاء المشروع بمعدل استهلاك ${utilizationRate.toFixed(1)}% من الميزانية المخططة.`
    });

    return recommendations;
  };

  if (!hasPermission) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="sm:max-w-md w-[95%] rounded-3xl border-0 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="relative text-center p-6">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-bold text-white font-arabic">
                غير مصرح
              </DialogTitle>
            </DialogHeader>

            <p className="text-white/90 mb-4 font-arabic">
              هذه الميزة متاحة فقط لمدير المشروع فأعلى
            </p>
            
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors font-arabic"
            >
              موافق
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const analysis = generateAnalysis();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'text-red-300';
      case 'caution': return 'text-yellow-300';
      default: return 'text-green-300';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'warning': return 'bg-red-500/20';
      case 'caution': return 'bg-yellow-500/20';
      default: return 'bg-green-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-4xl w-[95%] rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-xl font-bold text-white font-arabic">
              تحليل الانحرافات المالية بالذكاء الاصطناعي
            </DialogTitle>
            <p className="text-white/70 text-sm mt-2 font-arabic">
              تقرير مفصل عن الوضع المالي الحالي والتوقعات المستقبلية
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* ملخص الحالة المالية */}
            <div className={`p-6 rounded-2xl ${getStatusBg(analysis.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-arabic">ملخص الوضع المالي</h3>
                <div className={`px-4 py-2 rounded-full bg-white/20 ${getStatusColor(analysis.status)}`}>
                  <span className="text-sm font-medium font-arabic">
                    {analysis.status === 'warning' ? 'تحذير' : 
                     analysis.status === 'caution' ? 'تنبيه' : 'جيد'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-white/70 text-sm font-arabic mb-1">معدل الاستهلاك</p>
                  <p className={`text-2xl font-bold ${getStatusColor(analysis.status)}`}>
                    {analysis.utilizationRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm font-arabic mb-1">المبلغ المستهلك</p>
                  <p className="text-2xl font-bold text-white">
                    {data.totalExpenses.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm font-arabic mb-1">المتبقي</p>
                  <p className="text-2xl font-bold text-white">
                    {data.budgetRemaining.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>

            {/* تحليل المصروفات بالفئات */}
            <div className="bg-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white font-arabic mb-4">
                تحليل المصروفات حسب الفئة
              </h3>
              
              <div className="space-y-3">
                {Object.entries(analysis.categoryTotals).map(([category, amount]: [string, any]) => {
                  const percentage = (amount / data.totalBudget) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-arabic">{category}</span>
                        <div className="text-right">
                          <span className="text-white font-bold">{amount.toLocaleString()} ر.س</span>
                          <span className="text-white/70 text-sm mr-2">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* التوقعات والإنذارات */}
            {analysis.projectedOverrun > 0 && (
              <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-300" />
                  <h3 className="text-lg font-bold text-red-300 font-arabic">
                    تحذير: توقع تجاوز الميزانية
                  </h3>
                </div>
                <p className="text-white/90 font-arabic mb-3">
                  بناءً على النمط الحالي للإنفاق، من المتوقع تجاوز الميزانية بمبلغ{' '}
                  <span className="font-bold text-red-300">
                    {analysis.projectedOverrun.toLocaleString()} ر.س
                  </span>
                </p>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-white/80 text-sm font-arabic">
                    💡 نصيحة: راجع المصروفات في فئة "{analysis.topCategory}" والتي تمثل أكبر نسبة من الإنفاق
                  </p>
                </div>
              </div>
            )}

            {/* التوصيات الذكية */}
            <div className="bg-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white font-arabic mb-4">
                التوصيات الذكية
              </h3>
              
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => {
                  const IconComponent = rec.icon;
                  return (
                    <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white font-arabic mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-white/80 text-sm font-arabic">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* معلومات التقرير */}
            <div className="bg-white/5 p-4 rounded-2xl text-center">
              <p className="text-white/60 text-xs font-arabic">
                تم إنشاء هذا التقرير بواسطة نظام التحليل الذكي • آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
              </p>
            </div>

            {/* زر الإغلاق */}
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors font-arabic"
              >
                إغلاق التقرير
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};