import React from 'react';
import { X } from 'lucide-react';

interface FinancialAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialAnalysisModal: React.FC<FinancialAnalysisModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Mock AI-generated analysis data
  const analysisReport = {
    overallStatus: "انحراف متوسط",
    totalVariance: 12500,
    variancePercentage: 8.3,
    criticalAreas: [
      {
        category: "رواتب الفريق والمكافآت",
        planned: 18000,
        actual: 20000,
        variance: 2000,
        impact: "مرتفع"
      },
      {
        category: "أدوات وبرمجيات متخصصة",
        planned: 7500,
        actual: 8000,
        variance: 500,
        impact: "منخفض"
      }
    ],
    recommendations: [
      "مراجعة ساعات العمل الإضافية للفريق وإعادة تقييم التكاليف",
      "البحث عن بدائل أقل تكلفة للأدوات المتخصصة",
      "وضع خطة للتحكم في النفقات للمراحل القادمة"
    ],
    riskLevel: "متوسط",
    projectedImpact: "قد يؤثر على هامش الربح المتوقع بنسبة 3-5%"
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         style={{ 
           background: 'rgba(255,255,255,0.30)',
           backdropFilter: 'blur(18px)',
           WebkitBackdropFilter: 'blur(18px)' 
         }}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden font-arabic transition-all duration-500 ease-out"
           style={{
             background: 'rgba(255,255,255,0.4)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: '1px solid rgba(255,255,255,0.2)',
             borderRadius: '24px',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
             zIndex: 9999
           }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div>
            <h2 className="text-xl font-bold text-black">تحليل انحرافات الميزانية</h2>
            <p className="text-sm text-black/70 mt-1">تقرير تحليلي مُولد بواسطة الذكاء الاصطناعي</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status Overview */}
          <div className="bg-white/50 rounded-2xl p-6 border border-black/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">نظرة عامة على الانحرافات</h3>
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-black">{analysisReport.overallStatus}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black mb-1">{analysisReport.totalVariance.toLocaleString()} ر.س</p>
                <p className="text-sm text-black/70">إجمالي الانحراف</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black mb-1">{analysisReport.variancePercentage}%</p>
                <p className="text-sm text-black/70">نسبة الانحراف</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-black mb-1">{analysisReport.riskLevel}</p>
                <p className="text-sm text-black/70">مستوى المخاطر</p>
              </div>
            </div>
          </div>

          {/* Critical Areas */}
          <div className="bg-white/50 rounded-2xl p-6 border border-black/10 mb-6">
            <h3 className="text-lg font-bold text-black mb-4">المجالات الحرجة</h3>
            <div className="space-y-4">
              {analysisReport.criticalAreas.map((area, index) => (
                <div key={index} className="bg-white/30 rounded-xl p-4 border border-black/10">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-black">{area.category}</h4>
                    <div className={`px-3 py-1 rounded-full ${
                      area.impact === 'مرتفع' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <span className="text-xs font-medium text-black">تأثير {area.impact}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-black/70">المخطط</p>
                      <p className="font-bold text-black">{area.planned.toLocaleString()} ر.س</p>
                    </div>
                    <div>
                      <p className="text-black/70">الفعلي</p>
                      <p className="font-bold text-black">{area.actual.toLocaleString()} ر.س</p>
                    </div>
                    <div>
                      <p className="text-black/70">الانحراف</p>
                      <p className="font-bold text-red-600">+{area.variance.toLocaleString()} ر.س</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white/50 rounded-2xl p-6 border border-black/10 mb-6">
            <h3 className="text-lg font-bold text-black mb-4">توصيات الذكاء الاصطناعي</h3>
            <div className="space-y-3">
              {analysisReport.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-black text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white/50 rounded-2xl p-6 border border-black/10">
            <h3 className="text-lg font-bold text-black mb-4">تقييم المخاطر والتأثير المتوقع</h3>
            <div className="bg-white/30 rounded-xl p-4 border border-black/10">
              <p className="text-black text-sm">{analysisReport.projectedImpact}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/50 backdrop-blur-sm border border-black/20 text-black rounded-full text-sm hover:bg-white/70 transition-colors"
          >
            إغلاق
          </button>
          <button className="px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors">
            تصدير التقرير
          </button>
        </div>
      </div>
    </div>
  );
};