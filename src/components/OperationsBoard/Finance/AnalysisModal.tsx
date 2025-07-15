import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetData?: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    forecastAccuracy: number;
  };
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  budgetData = {
    totalBudget: 500000,
    totalSpent: 320000,
    remaining: 180000,
    forecastAccuracy: 87
  }
}) => {
  const { toast } = useToast();

  // حساب النسب والمؤشرات
  const spentPercentage = (budgetData.totalSpent / budgetData.totalBudget) * 100;
  const remainingPercentage = (budgetData.remaining / budgetData.totalBudget) * 100;
  const isOverBudget = budgetData.totalSpent > budgetData.totalBudget;
  const variance = budgetData.totalSpent - (budgetData.totalBudget * 0.8); // افتراض أننا يجب أن نكون عند 80% من الإنفاق

  // تحليل الذكاء الاصطناعي المحاكي
  const generateAIAnalysis = () => {
    const insights = [];

    if (spentPercentage > 90) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'تجاوز الميزانية المخططة',
        description: `تم استنفاد ${spentPercentage.toFixed(1)}% من الميزانية. يُنصح بإعادة تقييم المصروفات المتبقية.`,
        recommendation: 'قم بتأجيل المشتريات غير الضرورية أو طلب موافقة على ميزانية إضافية.'
      });
    } else if (spentPercentage > 75) {
      insights.push({
        type: 'caution',
        icon: TrendingUp,
        title: 'معدل إنفاق مرتفع',
        description: `تم استنفاد ${spentPercentage.toFixed(1)}% من الميزانية. المعدل الحالي قد يؤدي لتجاوز الميزانية.`,
        recommendation: 'راقب المصروفات بعناية أكبر وأعد تقييم الأولويات.'
      });
    } else {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'الإنفاق ضمن الحدود الآمنة',
        description: `تم استنفاد ${spentPercentage.toFixed(1)}% من الميزانية، وهو معدل صحي للمرحلة الحالية.`,
        recommendation: 'استمر في المراقبة الدورية للحفاظ على هذا الأداء الجيد.'
      });
    }

    if (budgetData.forecastAccuracy < 70) {
      insights.push({
        type: 'warning',
        icon: BarChart3,
        title: 'دقة التنبؤات منخفضة',
        description: `دقة التنبؤات الحالية ${budgetData.forecastAccuracy}% وهي أقل من المستوى المطلوب.`,
        recommendation: 'راجع منهجية التخطيط المالي وحسّن عملية تقدير التكاليف.'
      });
    }

    if (Math.abs(variance) > budgetData.totalBudget * 0.1) {
      insights.push({
        type: 'info',
        icon: PieChart,
        title: 'انحراف في التوقيت المالي',
        description: `هناك انحراف بقيمة ${Math.abs(variance).toLocaleString()} ريال عن الجدول الزمني المخطط.`,
        recommendation: variance > 0 ? 
          'يُنصح بتسريع وتيرة المشروع لتعويض التأخير المالي.' :
          'الأداء متقدم عن الجدول، يمكن إعادة توزيع الموارد.'
      });
    }

    return insights;
  };

  const analysisInsights = generateAIAnalysis();

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-500';
      case 'caution': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-red-50 border-red-200';
      case 'caution': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const handleExportReport = () => {
    toast({
      title: "تم تصدير التقرير",
      description: "تم تصدير تقرير التحليل المالي بنجاح"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '24px'
      }}>
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
        >
          <X size={18} className="text-black" />
        </button>

        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-right font-arabic">
            تحليل الأداء المالي بالذكاء الاصطناعي
          </DialogTitle>
          <p className="text-sm text-gray-600 text-right font-arabic mt-2">
            تحليل شامل لأداء المشروع المالي مع توصيات مدعومة بالذكاء الاصطناعي
          </p>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-6">
          {/* ملخص المؤشرات المالية */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-arabic">إجمالي الميزانية</p>
              <p className="text-lg font-bold text-gray-800 font-arabic">
                {budgetData.totalBudget.toLocaleString()} ر.س
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-arabic">المبلغ المنفق</p>
              <p className="text-lg font-bold text-red-600 font-arabic">
                {budgetData.totalSpent.toLocaleString()} ر.س
              </p>
              <p className="text-xs text-gray-500 font-arabic">
                {spentPercentage.toFixed(1)}% من الميزانية
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-arabic">المبلغ المتبقي</p>
              <p className="text-lg font-bold text-green-600 font-arabic">
                {budgetData.remaining.toLocaleString()} ر.س
              </p>
              <p className="text-xs text-gray-500 font-arabic">
                {remainingPercentage.toFixed(1)}% من الميزانية
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-arabic">دقة التنبؤات</p>
              <p className="text-lg font-bold text-blue-600 font-arabic">
                {budgetData.forecastAccuracy}%
              </p>
            </div>
          </div>

          {/* التحليلات والتوصيات */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-right text-gray-800 font-arabic">
              التحليلات والتوصيات
            </h3>
            
            {analysisInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className={`p-4 rounded-lg border ${getBgColor(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800 font-arabic">
                          {insight.title}
                        </h4>
                        <IconComponent size={20} className={getIconColor(insight.type)} />
                      </div>
                      <p className="text-sm text-gray-700 font-arabic mb-2">
                        {insight.description}
                      </p>
                      <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm font-medium text-gray-800 font-arabic">
                          💡 التوصية:
                        </p>
                        <p className="text-sm text-gray-700 font-arabic">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* التوقعات المستقبلية */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-right text-gray-800 font-arabic mb-4">
              التوقعات المستقبلية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 font-arabic">
                  التوقع لنهاية المشروع:
                </p>
                <p className="text-lg font-bold text-blue-600 font-arabic">
                  {Math.round(budgetData.totalSpent * 1.15).toLocaleString()} ر.س
                </p>
                <p className="text-xs text-gray-500 font-arabic">
                  بناءً على المعدل الحالي للإنفاق
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 font-arabic">
                  احتمالية تجاوز الميزانية:
                </p>
                <p className="text-lg font-bold text-orange-600 font-arabic">
                  {spentPercentage > 80 ? 'مرتفعة' : spentPercentage > 60 ? 'متوسطة' : 'منخفضة'}
                </p>
                <p className="text-xs text-gray-500 font-arabic">
                  مع الحفاظ على المعدل الحالي
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-arabic"
            >
              إغلاق
            </button>
            <button
              onClick={handleExportReport}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-arabic"
            >
              تصدير التقرير
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};