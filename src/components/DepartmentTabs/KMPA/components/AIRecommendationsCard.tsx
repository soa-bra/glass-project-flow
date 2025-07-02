
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { mockAIRecommendations } from '../data/mockData';

export const AIRecommendationsCard: React.FC = () => {
  const recommendations = mockAIRecommendations.slice(0, 3);

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">توصيات الذكاء الاصطناعي</h3>
      </div>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-3 border rounded-lg bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm text-black font-arabic">{rec.title}</h4>
              <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                {rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
              </Badge>
            </div>
            <p className="text-xs text-black mb-2 font-arabic">{rec.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-black font-arabic">الثقة: {Math.round(rec.confidence * 100)}%</span>
              <Badge variant="outline" className="text-xs text-black">
                {rec.type === 'gap_analysis' ? 'تحليل الفجوات' : 
                 rec.type === 'content_suggestion' ? 'اقتراح محتوى' : 'موضوع بحث'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
