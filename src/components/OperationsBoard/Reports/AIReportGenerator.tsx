import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Bot, Brain, Zap, Clock, BarChart } from 'lucide-react';
interface AIReportSuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  dataPoints: string[];
  estimatedTime: string;
}
interface AIReportGeneratorProps {
  suggestions: AIReportSuggestion[];
}
export const AIReportGenerator: React.FC<AIReportGeneratorProps> = ({
  suggestions
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  return <Card className="rounded-[40px] bg-[#ffffff] border-[#DADCE0]">
      <CardHeader>
        <CardTitle className="text-right font-arabic flex items-center gap-2">
          <Bot className="w-5 h-5" />
          مولد التقارير الذكي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.length === 0 ? <div className="text-center py-8 text-gray-500 font-arabic">
              لا توجد اقتراحات ذكية حالياً
            </div> : suggestions.map(suggestion => <div key={suggestion.id} className="bg-white/20 rounded-2xl p-4 hover:bg-white/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-right flex-1">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                  <Badge className={`${getConfidenceColor(suggestion.confidence)}`}>
                    {suggestion.confidence}% دقة
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1 text-right">مصادر البيانات:</h5>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.dataPoints.map((point, idx) => <Badge key={idx} variant="outline" className="text-xs">
                          <BarChart className="w-3 h-3 mr-1" />
                          {point}
                        </Badge>)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>الوقت المتوقع: {suggestion.estimatedTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-full">
                        معاينة
                      </Button>
                      <Button size="sm" className="gap-1 rounded-full">
                        <Zap className="w-3 h-3" />
                        إنتاج التقرير
                      </Button>
                    </div>
                  </div>
                </div>
              </div>)}
        </div>

        <div className="border-t mt-6 pt-4">
          <div className="text-center">
            <Button variant="outline" className="gap-2 rounded-full bg-black text-base text-slate-50">
              <Bot className="w-4 h-4" />
              اقتراح تقارير جديدة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};