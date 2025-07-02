
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { mockKnowledgeGaps } from '../data/mockData';

export const KnowledgeGapsCard: React.FC = () => {
  const gaps = mockKnowledgeGaps.slice(0, 2);

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">فجوات المعرفة المكتشفة</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gaps.map((gap) => (
          <div key={gap.id} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-black font-arabic">{gap.topic}</h4>
              <Badge variant={gap.priority === 'high' ? 'destructive' : 'default'}>
                {gap.priority === 'high' ? 'عالي' : 'متوسط'}
              </Badge>
            </div>
            <p className="text-sm text-black mb-3 font-arabic">{gap.description}</p>
            <div className="space-y-2">
              <div className="text-xs text-black font-arabic">
                استعلامات البحث المتكررة:
              </div>
              <div className="flex flex-wrap gap-1">
                {gap.searchQueries.map((query, index) => (
                  <Badge key={index} variant="secondary" className="text-xs text-black">
                    {query}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
