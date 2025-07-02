
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export const AIInsightsCard: React.FC = () => {
  const insights = [
    {
      type: 'opportunity',
      title: 'فرصة تحسين المحتوى الثقافي',
      description: 'يُظهر التحليل زيادة في الاهتمام بمواضيع "التراث الرقمي" بنسبة 23%. يُنصح بإنتاج محتوى متخصص في هذا المجال.',
      confidence: 87
    },
    {
      type: 'improvement',
      title: 'تحسن في الانسجام الثقافي',
      description: 'مستوى الانسجام الثقافي في المشاريع الأخيرة أعلى بـ 15% من المتوسط السنوي، مما يشير لفعالية الاستراتيجية الحالية.',
      confidence: 92
    }
  ];

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">رؤى الذكاء الاصطناعي</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-black font-arabic">{insight.title}</h4>
                <p className="text-sm text-black mt-1 font-arabic">{insight.description}</p>
                <Badge variant="outline" className="mt-2 text-black border-black">
                  ثقة: {insight.confidence}%
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
