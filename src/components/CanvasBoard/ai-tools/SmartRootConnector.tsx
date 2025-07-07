import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { GitBranch, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SmartRootConnectorProps {
  sourceId: string | null;
  targetId: string | null;
  selectedTool: string;
  onConfirm: (result: { 
    source: string; 
    target: string; 
    text: string; 
    generatedNodes: any[] 
  }) => void;
}

export const SmartRootConnector: React.FC<SmartRootConnectorProps> = ({ 
  sourceId, 
  targetId, 
  selectedTool,
  onConfirm 
}) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (selectedTool !== 'smart-connector') return null;

  const handleAnalyze = async () => {
    if (!sourceId || !targetId) {
      toast.error('يرجى تحديد عنصرين أولاً');
      return;
    }

    if (!description.trim()) {
      toast.error('يرجى إدخال وصف للعلاقة');
      return;
    }

    setLoading(true);
    try {
      // محاكاة تحليل العلاقة بالذكاء الاصطناعي
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGeneratedNodes = [
        {
          id: `bridge-${Date.now()}`,
          type: 'connector',
          content: 'نقطة ربط ذكية',
          x: 200,
          y: 150
        },
        {
          id: `analysis-${Date.now()}`,
          type: 'analysis',
          content: `تحليل العلاقة: ${description}`,
          x: 300,
          y: 200
        }
      ];

      const result = {
        source: sourceId,
        target: targetId,
        text: description,
        generatedNodes: mockGeneratedNodes
      };

      onConfirm(result);
      setDescription('');
      toast.success('تم تحليل العلاقة وإنشاء عقد ذكية');
    } catch (error) {
      toast.error('فشل في تحليل العلاقة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPanelContainer title="الربط الذكي بين العناصر">
      <div className="space-y-4">
        {/* حالة العناصر المحددة */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-arabic space-y-1">
            <div>العنصر الأول: {sourceId ? `✓ ${sourceId}` : '❌ غير محدد'}</div>
            <div>العنصر الثاني: {targetId ? `✓ ${targetId}` : '❌ غير محدد'}</div>
          </div>
        </div>

        {/* وصف العلاقة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">
            وصف العلاقة بين العنصرين
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: هذان العنصران مترابطان في التسلسل الزمني..."
            className="font-arabic resize-none"
            rows={3}
          />
        </div>

        {/* أمثلة سريعة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">أمثلة سريعة</label>
          <div className="grid gap-1">
            {[
              'علاقة سبب ونتيجة',
              'تسلسل زمني',
              'علاقة تكاملية',
              'علاقة تنافسية',
              'علاقة هرمية'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setDescription(example)}
                className="text-xs p-2 bg-blue-50 hover:bg-blue-100 rounded text-right font-arabic border border-blue-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* زر التحليل */}
        <Button 
          onClick={handleAnalyze}
          disabled={loading || !sourceId || !targetId || !description.trim()}
          className="w-full rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري التحليل...
            </>
          ) : (
            <>
              <GitBranch className="w-4 h-4 mr-2" />
              تحليل وإنشاء الرابط
            </>
          )}
        </Button>

        {/* تعليمات */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium font-arabic mb-1">كيفية الاستخدام:</h4>
          <ul className="text-xs font-arabic text-blue-800 space-y-1">
            <li>1. حدد العنصر الأول بالنقر عليه</li>
            <li>2. حدد العنصر الثاني بالنقر عليه</li>
            <li>3. اكتب وصفاً للعلاقة بينهما</li>
            <li>4. اضغط على زر التحليل</li>
          </ul>
        </div>
      </div>
    </ToolPanelContainer>
  );
};