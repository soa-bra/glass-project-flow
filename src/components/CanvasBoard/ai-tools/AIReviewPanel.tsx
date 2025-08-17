import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Search, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { LayerInfo } from '../../../types/canvas-ai-tools';

interface AIReviewPanelProps {
  selectedTool: string;
  projectId: string;
  layers: LayerInfo[];
}

export const AIReviewPanel: React.FC<AIReviewPanelProps> = ({ 
  selectedTool, 
  projectId,
  layers 
}) => {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<{
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    score: number;
  } | null>(null);

  if (selectedTool !== 'review') return null;

  const handleGenerateReview = async () => {
    if (!layers.length) {
      toast.error('لا توجد عناصر للمراجعة');
      return;
    }

    setLoading(true);
    setReview(null);
    
    try {
      // محاكاة مراجعة ذكية للمشروع
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockReview = {
        summary: `تم تحليل ${layers.length} عنصر في المشروع. المشروع يظهر هيكلاً جيداً مع بعض النقاط التي تحتاج للتحسين.`,
        strengths: [
          'تنوع جيد في أنواع العناصر',
          'ترتيب منطقي للمكونات',
          'استخدام فعال للمساحة المتاحة'
        ],
        weaknesses: [
          'بعض العناصر تفتقر للوصف التفصيلي',
          'قد تحتاج لمزيد من الروابط بين العناصر',
          'بعض العناصر قريبة جداً من بعضها'
        ],
        suggestions: [
          'إضافة المزيد من العناصر التوضيحية',
          'تحسين التباعد بين العناصر',
          'إضافة ألوان مميزة لتصنيف العناصر',
          'إنشاء مجموعات للعناصر المترابطة'
        ],
        score: Math.floor(70 + Math.random() * 25) // 70-95
      };
      
      setReview(mockReview);
      toast.success('تم إنشاء مراجعة شاملة للمشروع');
    } catch (error) {
      toast.error('فشل في إنشاء المراجعة');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  return (
    <ToolPanelContainer title="مراجعة المشروع بالذكاء الاصطناعي">
      <div className="space-y-4">
        {/* معلومات المشروع */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-arabic">
            <div>معرف المشروع: <span className="font-mono text-xs">{projectId}</span></div>
            <div>عدد العناصر: <strong>{layers.length}</strong></div>
          </div>
        </div>

        {/* زر إنشاء المراجعة */}
        <Button 
          onClick={handleGenerateReview}
          disabled={loading || !layers.length}
          className="w-full rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري المراجعة...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              إنشاء مراجعة شاملة
            </>
          )}
        </Button>

        {/* نتائج المراجعة */}
        {review && (
          <div className="space-y-3">
            {/* التقييم العام */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium font-arabic">التقييم العام</h4>
                <div className="flex items-center gap-2">
                  {React.createElement(getScoreIcon(review.score), {
                    className: `w-5 h-5 ${getScoreColor(review.score)}`
                  })}
                  <span className={`font-bold ${getScoreColor(review.score)}`}>
                    {review.score}/100
                  </span>
                </div>
              </div>
              <p className="text-sm font-arabic text-blue-800">
                {review.summary}
              </p>
            </div>

            {/* نقاط القوة */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium font-arabic mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                نقاط القوة
              </h4>
              <ul className="text-sm font-arabic space-y-1">
                {review.strengths.map((item, index) => (
                  <li key={index} className="text-green-700">• {item}</li>
                ))}
              </ul>
            </div>

            {/* نقاط التحسين */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium font-arabic mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                نقاط التحسين
              </h4>
              <ul className="text-sm font-arabic space-y-1">
                {review.weaknesses.map((item, index) => (
                  <li key={index} className="text-yellow-700">• {item}</li>
                ))}
              </ul>
            </div>

            {/* الاقتراحات */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h4 className="font-medium font-arabic mb-2">💡 اقتراحات للتطوير</h4>
              <ul className="text-sm font-arabic space-y-1">
                {review.suggestions.map((item, index) => (
                  <li key={index} className="text-purple-700">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 font-arabic">
            💡 المراجعة تتضمن تحليلاً شاملاً لهيكل المشروع والعلاقات بين العناصر والتوزيع المكاني والتنظيم العام
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};