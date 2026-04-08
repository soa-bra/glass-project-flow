import React from 'react';
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

export const AIDelayAdvisor: React.FC<AIDelayAdvisorProps> = ({ aiAdvice }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-[#E5564D]" />;
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-[#F6C445]" />;
      case 'optimization': return <TrendingUp className="h-4 w-4 text-[#3DBE8B]" />;
      default: return <Bot className="h-4 w-4 text-[#3DA8F5]" />;
    }
  };

  const getAccentColor = (type: string) => {
    switch (type) {
      case 'warning': return '#f1b5b9';
      case 'suggestion': return '#fbe2aa';
      case 'optimization': return '#bdeed3';
      default: return '#a4e2f6';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'warning': return 'تحذير';
      case 'suggestion': return 'اقتراح';
      case 'optimization': return 'تحسين';
      default: return 'عام';
    }
  };

  return (
    <div className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">مستشار التأخير بالذكاء الاصطناعي</h3>
        <div className="w-8 h-8 rounded-full ring-1 ring-[rgba(11,15,18,0.15)] flex items-center justify-center">
          <Bot className="h-4 w-4 text-[#3DA8F5]" />
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {aiAdvice.length === 0 ? (
          <div className="text-center py-10 text-[rgba(11,15,18,0.4)] text-sm">لا توجد توصيات حالياً</div>
        ) : (
          aiAdvice.map(advice => (
            <div
              key={advice.id}
              className="rounded-[18px] p-4 ring-1 ring-[rgba(11,15,18,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow relative overflow-hidden"
            >
              {/* Accent line */}
              <div className="absolute right-0 top-3 bottom-3 w-[3px] rounded-full" style={{ backgroundColor: getAccentColor(advice.type) }} />

              <div className="flex items-start justify-between mb-2 pr-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(advice.type)}
                  <div className="px-2.5 py-0.5 rounded-full" style={{ backgroundColor: getAccentColor(advice.type) }}>
                    <span className="text-[10px] font-medium text-[#0B0F12]">{getTypeText(advice.type)}</span>
                  </div>
                </div>
                <div className="text-[28px] font-bold text-[#0B0F12]">{advice.confidence}%</div>
              </div>

              <h4 className="font-bold text-[#0B0F12] text-sm mb-1 pr-3">{advice.title}</h4>
              <p className="text-[12px] text-[rgba(11,15,18,0.6)] leading-relaxed pr-3">{advice.description}</p>

              {advice.projectId && (
                <div className="mt-3 pt-2 border-t border-[rgba(11,15,18,0.06)] pr-3">
                  <span className="text-[10px] text-[rgba(11,15,18,0.4)]">المشروع المتأثر: {advice.projectId}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
