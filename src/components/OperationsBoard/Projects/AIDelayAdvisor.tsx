
import React from 'react';
import { AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

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

export const AIDelayAdvisor: React.FC<AIDelayAdvisorProps> = ({ aiAdvice }) => {
  const getAdviceIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'suggestion':
        return Lightbulb;
      case 'optimization':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const getAdviceColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#f1b5b9';
      case 'suggestion':
        return '#a4e2f6';
      case 'optimization':
        return '#bdeed3';
      default:
        return '#d0e0e2';
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-black/10" style={{ backgroundColor: '#d0e0e2' }}>
      <div className="mb-6">
        <h3 className="text-large font-semibold text-black font-arabic">مستشار الذكاء الاصطناعي</h3>
      </div>
      <div className="space-y-4">
        {aiAdvice.map((advice) => {
          const Icon = getAdviceIcon(advice.type);
          return (
            <div 
              key={advice.id} 
              className="p-4 rounded-2xl border border-black/10"
              style={{ backgroundColor: getAdviceColor(advice.type) }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-black/20 bg-transparent flex items-center justify-center">
                  <Icon className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-black font-arabic mb-1">{advice.title}</h4>
                  <p className="text-sm font-medium text-black font-arabic mb-2">{advice.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-normal text-gray-400 font-arabic">
                      درجة الثقة: {advice.confidence}%
                    </span>
                    {advice.projectId && (
                      <span className="text-xs font-normal text-gray-400 font-arabic">
                        المشروع: {advice.projectId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
