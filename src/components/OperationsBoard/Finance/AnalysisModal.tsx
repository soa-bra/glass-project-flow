import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Download } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData?: {
    totalBudget: number;
    totalSpent: number;
    monthlyBudget: any[];
  };
}

interface AnalysisData {
  budgetVariance: {
    percentage: number;
    amount: number;
    status: 'over' | 'under' | 'on-track';
  };
  trendAnalysis: {
    direction: 'increasing' | 'decreasing' | 'stable';
    monthlyGrowth: number;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  recommendations: string[];
  projectedCompletion: {
    budgetUtilization: number;
    timeRemaining: number;
  };
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  projectData
}) => {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // محاكاة تحليل بيانات بالذكاء الاصطناعي
  useEffect(() => {
    if (isOpen && projectData) {
      setLoading(true);
      
      // محاكاة استدعاء API للذكاء الاصطناعي
      setTimeout(() => {
        const budgetUsagePercentage = (projectData.totalSpent / projectData.totalBudget) * 100;
        const variance = projectData.totalSpent - projectData.totalBudget;
        const variancePercentage = (variance / projectData.totalBudget) * 100;

        const analysis: AnalysisData = {
          budgetVariance: {
            percentage: Math.abs(variancePercentage),
            amount: Math.abs(variance),
            status: variance > 0 ? 'over' : variance < -projectData.totalBudget * 0.1 ? 'under' : 'on-track'
          },
          trendAnalysis: {
            direction: variance > 0 ? 'increasing' : 'decreasing',
            monthlyGrowth: Math.random() * 15 - 5 // محاكاة نمو شهري
          },
          riskAssessment: {
            level: budgetUsagePercentage > 90 ? 'high' : budgetUsagePercentage > 70 ? 'medium' : 'low',
            factors: generateRiskFactors(budgetUsagePercentage, variance)
          },
          recommendations: generateRecommendations(budgetUsagePercentage, variance),
          projectedCompletion: {
            budgetUtilization: budgetUsagePercentage,
            timeRemaining: Math.max(0, 100 - budgetUsagePercentage)
          }
        };

        setAnalysisData(analysis);
        setLoading(false);
      }, 2000); // محاكاة وقت المعالجة
    }
  }, [isOpen, projectData]);

  const generateRiskFactors = (budgetUsage: number, variance: number): string[] => {
    const factors = [];
    
    if (budgetUsage > 90) {
      factors.push('استنزاف سريع للميزانية');
    }
    if (variance > 0) {
      factors.push('تجاوز الميزانية المخططة');
    }
    if (budgetUsage > 80) {
      factors.push('نفاد الميزانية قبل انتهاء المشروع');
    }
    if (factors.length === 0) {
      factors.push('لا توجد مخاطر مالية حاليًا');
    }
    
    return factors;
  };

  const generateRecommendations = (budgetUsage: number, variance: number): string[] => {
    const recommendations = [];
    
    if (budgetUsage > 90) {
      recommendations.push('طلب ميزانية إضافية فورية');
      recommendations.push('مراجعة وتقليل المصروفات غير الضرورية');
    } else if (budgetUsage > 70) {
      recommendations.push('مراقبة المصروفات عن كثب');
      recommendations.push('تحسين كفاءة استخدام الموارد');
    } else {
      recommendations.push('الاستمرار في التحكم الجيد بالميزانية');
      recommendations.push('استكشاف فرص التوفير');
    }
    
    if (variance > 0) {
      recommendations.push('تحليل أسباب تجاوز الميزانية');
    }
    
    return recommendations;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'text-red-600';
      case 'under': return 'text-blue-600';
      case 'on-track': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleExportReport = () => {
    // محاكاة تصدير التقرير
    const reportData = {
      generatedAt: new Date().toISOString(),
      analysis: analysisData,
      projectData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            تحليل انحرافات الميزانية بالذكاء الاصطناعي
          </DialogTitle>
          <p className="text-sm text-gray-600 text-right font-arabic mt-2">
            تقرير شامل حول الوضع المالي الحالي وتوقعات المستقبل
          </p>
        </DialogHeader>

        <div className="px-8 pb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-arabic text-center">
                جارٍ تحليل البيانات بالذكاء الاصطناعي...
              </p>
            </div>
          ) : analysisData ? (
            <div className="space-y-6">
              {/* ملخص الحالة المالية */}
              <div className="bg-white/30 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-right font-arabic mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  ملخص الحالة المالية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getStatusColor(analysisData.budgetVariance.status)}`}>
                      {analysisData.budgetVariance.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 font-arabic">
                      انحراف الميزانية
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisData.projectedCompletion.budgetUtilization.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 font-arabic">
                      استخدام الميزانية
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysisData.projectedCompletion.timeRemaining.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 font-arabic">
                      المتبقي للاكتمال
                    </div>
                  </div>
                </div>
              </div>

              {/* تحليل الاتجاهات */}
              <div className="bg-white/30 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-right font-arabic mb-4 flex items-center gap-2">
                  {analysisData.trendAnalysis.direction === 'increasing' ? 
                    <TrendingUp className="w-5 h-5 text-red-600" /> : 
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  }
                  تحليل الاتجاهات
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-arabic">اتجاه الإنفاق:</span>
                    <span className={`font-semibold ${
                      analysisData.trendAnalysis.direction === 'increasing' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {analysisData.trendAnalysis.direction === 'increasing' ? 'متزايد' : 'متناقص'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-arabic">النمو الشهري:</span>
                    <span className="font-semibold">
                      {analysisData.trendAnalysis.monthlyGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* تقييم المخاطر */}
              <div className="bg-white/30 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-right font-arabic mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  تقييم المخاطر
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-arabic">مستوى المخاطر:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(analysisData.riskAssessment.level)}`}>
                      {analysisData.riskAssessment.level === 'high' ? 'مرتفع' : 
                       analysisData.riskAssessment.level === 'medium' ? 'متوسط' : 'منخفض'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-arabic block mb-2">عوامل المخاطر:</span>
                    <ul className="space-y-1">
                      {analysisData.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-600 font-arabic text-right">
                          • {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* التوصيات */}
              <div className="bg-white/30 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-right font-arabic mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  التوصيات
                </h3>
                <ul className="space-y-3">
                  {analysisData.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3 text-right">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 font-arabic">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 py-3 text-black border-black/30 hover:bg-black/5 font-arabic"
                >
                  إغلاق
                </Button>
                <Button
                  onClick={handleExportReport}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-arabic flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  تصدير التقرير
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 font-arabic">
                فشل في تحليل البيانات. يرجى المحاولة مرة أخرى.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};