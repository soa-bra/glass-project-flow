import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
interface AIAdvice {
  id: string;
  type: 'warning' | 'suggestion' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  projectId?: string;
}
interface AIDelayAdvisorProps {
  aiAdvice: AIAdvice[];
}
export const AIDelayAdvisor: React.FC<AIDelayAdvisorProps> = ({
  aiAdvice
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'optimization':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Bot className="h-5 w-5 text-blue-500" />;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suggestion':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'optimization':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  const getTypeText = (type: string) => {
    switch (type) {
      case 'warning':
        return 'تحذير';
      case 'suggestion':
        return 'اقتراح';
      case 'optimization':
        return 'تحسين';
      default:
        return 'عام';
    }
  };
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  return <Card className="glass-enhanced rounded-[40px] bg-[#ffffff] border-[#DADCE0]">
      <CardHeader>
        <CardTitle className="text-right font-arabic text-lg flex items-center justify-between">
          <span>مستشار التأخير بالذكاء الاصطناعي</span>
          <Bot className="h-6 w-6 text-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {aiAdvice.length === 0 ? <div className="text-center py-8 text-gray-500 font-arabic">
              لا توجد توصيات حالياً
            </div> : aiAdvice.map(advice => <div key={advice.id} className={`border rounded-lg p-4 ${getTypeColor(advice.type)} transition-all duration-200 hover:shadow-md`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {getTypeIcon(advice.type)}
                    <Badge variant="outline" className="font-arabic">
                      {getTypeText(advice.type)}
                    </Badge>
                  </div>
                  <div className={`text-sm font-semibold ${getConfidenceColor(advice.confidence)}`}>
                    دقة {advice.confidence}%
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-800 font-arabic mb-2 text-right">
                  {advice.title}
                </h4>
                
                <p className="text-gray-700 text-sm font-arabic text-right leading-relaxed">
                  {advice.description}
                </p>
                
                {advice.projectId && <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500 font-arabic">
                      المشروع المتأثر: {advice.projectId}
                    </span>
                  </div>}
              </div>)}
        </div>
      </CardContent>
    </Card>;
};