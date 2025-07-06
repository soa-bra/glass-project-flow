import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Zap, GitBranch, Loader2, Network, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface SmartConnectionsPanelProps {
  selectedTool: string;
  elements: any[];
  onCreateConnections: (connections: any[]) => void;
}

export const SmartConnectionsPanel: React.FC<SmartConnectionsPanelProps> = ({ 
  selectedTool, 
  elements,
  onCreateConnections 
}) => {
  const [connectionType, setConnectionType] = useState<'logical' | 'temporal' | 'hierarchical' | 'semantic'>('logical');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (selectedTool !== 'smart-connections') return null;

  const connectionTypes = [
    {
      value: 'logical',
      label: 'منطقي',
      description: 'ربط العناصر بناءً على العلاقات المنطقية',
      icon: '🧠',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      value: 'temporal',
      label: 'زمني',
      description: 'ربط العناصر بناءً على التسلسل الزمني',
      icon: '⏰',
      color: 'bg-green-50 border-green-200'
    },
    {
      value: 'hierarchical',
      label: 'هرمي',
      description: 'إنشاء هيكل هرمي للعناصر',
      icon: '🏗️',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      value: 'semantic',
      label: 'دلالي',
      description: 'ربط العناصر ذات المعاني المتشابهة',
      icon: '🔗',
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const analyzeElements = async () => {
    setLoading(true);
    setAnalysisResult(null);

    try {
      // محاكاة تحليل ذكي للعناصر
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis = {
        elementsCount: elements.length,
        possibleConnections: Math.floor(elements.length * 1.5),
        confidence: 85,
        suggestions: [
          { from: 'element-1', to: 'element-2', reason: 'تشابه في المحتوى', strength: 90 },
          { from: 'element-2', to: 'element-3', reason: 'تسلسل منطقي', strength: 75 },
          { from: 'element-1', to: 'element-4', reason: 'علاقة هرمية', strength: 65 }
        ]
      };

      setAnalysisResult(mockAnalysis);
      toast.success('تم تحليل العناصر بنجاح');
    } catch (error) {
      toast.error('فشل في تحليل العناصر');
    } finally {
      setLoading(false);
    }
  };

  const createConnections = () => {
    if (!analysisResult) return;

    const connections = analysisResult.suggestions.map((suggestion: any, index: number) => ({
      id: `connection-${index}`,
      from: suggestion.from,
      to: suggestion.to,
      type: connectionType,
      reason: suggestion.reason,
      strength: suggestion.strength,
      style: getConnectionStyle(connectionType)
    }));

    onCreateConnections(connections);
    toast.success(`تم إنشاء ${connections.length} اتصال ذكي`);
  };

  const getConnectionStyle = (type: string) => {
    switch (type) {
      case 'logical':
        return { color: '#3b82f6', style: 'solid', width: 2 };
      case 'temporal':
        return { color: '#10b981', style: 'dashed', width: 2 };
      case 'hierarchical':
        return { color: '#8b5cf6', style: 'dotted', width: 3 };
      case 'semantic':
        return { color: '#f59e0b', style: 'solid', width: 1 };
      default:
        return { color: '#6b7280', style: 'solid', width: 1 };
    }
  };

  return (
    <ToolPanelContainer title="الاتصالات الذكية">
      <div className="space-y-4">
        {/* عدد العناصر */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-arabic">
            <Network className="w-4 h-4 inline mr-2" />
            عدد العناصر المتاحة: <span className="font-bold">{elements.length}</span>
          </div>
        </div>

        {/* نوع الاتصال */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع الاتصال</label>
          <div className="grid gap-2">
            {connectionTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setConnectionType(type.value as any)}
                className={`p-3 rounded-lg border text-sm text-right font-arabic transition-colors ${
                  connectionType === type.value 
                    ? 'bg-black text-white border-black' 
                    : `${type.color} hover:opacity-80`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs opacity-80">{type.description}</div>
                  </div>
                  <span className="text-lg">{type.icon}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* تحليل العناصر */}
        <Button 
          onClick={analyzeElements}
          disabled={loading || elements.length < 2}
          className="w-full rounded-full"
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري التحليل...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
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
                <div>العناصر المحللة: {analysisResult.elementsCount}</div>
                <div>الاتصالات المحتملة: {analysisResult.possibleConnections}</div>
                <div>مستوى الثقة: {analysisResult.confidence}%</div>
              </div>
            </div>

            {/* اقتراحات الاتصال */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">اقتراحات الاتصال</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {analysisResult.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded p-2">
                    <div className="flex items-center text-xs font-arabic">
                      <span className="font-medium">{suggestion.from}</span>
                      <ArrowRight className="w-3 h-3 mx-1" />
                      <span className="font-medium">{suggestion.to}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {suggestion.reason} ({suggestion.strength}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* إنشاء الاتصالات */}
            <Button 
              onClick={createConnections}
              className="w-full rounded-full"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              إنشاء الاتصالات
            </Button>
          </div>
        )}

        {/* رسالة عدم توفر عناصر */}
        {elements.length < 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-arabic text-yellow-800">
              يجب توفر عنصرين على الأقل لإنشاء اتصالات ذكية
            </p>
          </div>
        )}
      </div>
    </ToolPanelContainer>
  );
};