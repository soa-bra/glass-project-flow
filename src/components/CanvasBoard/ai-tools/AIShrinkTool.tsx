import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Minimize2, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface AIShrinkToolProps {
  selectedTool: string;
  layers: any[];
  onShrink: (isolateIds: string[]) => void;
}

export const AIShrinkTool: React.FC<AIShrinkToolProps> = ({ 
  selectedTool, 
  layers, 
  onShrink 
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    coreElements: string[];
    isolatedElements: string[];
    confidence: number;
  } | null>(null);

  if (selectedTool !== 'shrink') return null;

  const handleAnalyze = async () => {
    if (!layers.length) {
      toast.error('لا توجد عناصر للتحليل');
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    
    try {
      // محاكاة تحليل ذكي للعناصر
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // تحليل وهمي - في التطبيق الحقيقي سيكون عبر API
      const totalElements = layers.length;
      const corePercentage = 0.6; // 60% عناصر أساسية
      const coreCount = Math.ceil(totalElements * corePercentage);
      
      const shuffled = [...layers].sort(() => 0.5 - Math.random());
      const coreElements = shuffled.slice(0, coreCount).map(l => l.id);
      const isolatedElements = shuffled.slice(coreCount).map(l => l.id);
      
      const result = {
        coreElements,
        isolatedElements,
        confidence: Math.floor(75 + Math.random() * 20) // 75-95%
      };
      
      setAnalysisResult(result);
      toast.success(`تم تحليل ${totalElements} عنصر بنجاح`);
    } catch (error) {
      toast.error('فشل في تحليل العناصر');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyShrink = () => {
    if (!analysisResult) return;
    
    onShrink(analysisResult.isolatedElements);
    toast.success(`تم عزل ${analysisResult.isolatedElements.length} عنصر`);
    setAnalysisResult(null);
  };

  return (
    <ToolPanelContainer title="أداة الاختصار الذكي">
      <div className="space-y-4">
        {/* معلومات العناصر */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-arabic">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4" />
              <span>إجمالي العناصر: <strong>{layers.length}</strong></span>
            </div>
            <div className="text-xs text-gray-600">
              سيتم تحليل جميع العناصر لتحديد الأساسية وغير المترابطة
            </div>
          </div>
        </div>

        {/* تحليل العناصر */}
        <Button 
          onClick={handleAnalyze}
          disabled={loading || !layers.length}
          className="w-full rounded-full"
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري التحليل الذكي...
            </>
          ) : (
            <>
              <Minimize2 className="w-4 h-4 mr-2" />
              تحليل العناصر
            </>
          )}
        </Button>

        {/* نتائج التحليل */}
        {analysisResult && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium font-arabic mb-2">📊 نتائج التحليل</h4>
              <div className="text-sm font-arabic space-y-1">
                <div>العناصر الأساسية: <strong>{analysisResult.coreElements.length}</strong></div>
                <div>العناصر المنعزلة: <strong>{analysisResult.isolatedElements.length}</strong></div>
                <div>مستوى الثقة: <strong>{analysisResult.confidence}%</strong></div>
              </div>
            </div>

            {/* معاينة العناصر المعزولة */}
            {analysisResult.isolatedElements.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium font-arabic mb-2">العناصر التي سيتم عزلها:</h4>
                <div className="text-xs font-arabic space-y-1 max-h-20 overflow-y-auto">
                  {analysisResult.isolatedElements.map((id, index) => (
                    <div key={id}>• {id}</div>
                  ))}
                </div>
              </div>
            )}

            {/* تطبيق النتائج */}
            <Button 
              onClick={handleApplyShrink}
              className="w-full rounded-full"
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              تطبيق الاختصار
            </Button>
          </div>
        )}

        {/* إرشادات */}
        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>💡 كيف يعمل الاختصار الذكي:</div>
            <div>• يحلل العلاقات بين العناصر</div>
            <div>• يحدد العناصر الأساسية والمترابطة</div>
            <div>• يعزل العناصر غير المترابطة</div>
            <div>• يحافظ على هيكل المشروع الأساسي</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};