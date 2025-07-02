
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, MessageCircle } from 'lucide-react';

interface NPSScore {
  id: number;
  score: number;
  client: string;
  category: 'promoter' | 'passive' | 'detractor';
  feedback?: string;
  date: string;
}

interface NPSScoresProps {
  nps: NPSScore[];
}

export const NPSScores: React.FC<NPSScoresProps> = ({ nps }) => {
  const getNPSColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const getNPSRating = (score: number): string => {
    if (score >= 90) return 'ممتاز';
    if (score >= 75) return 'جيد جداً';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'مقبول';
    return 'ضعيف';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'promoter':
        return 'bg-green-100 text-green-800';
      case 'passive':
        return 'bg-yellow-100 text-yellow-800';
      case 'detractor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'promoter':
        return 'مروج';
      case 'passive':
        return 'محايد';
      case 'detractor':
        return 'منتقد';
      default:
        return 'غير محدد';
    }
  };

  const averageNPS = nps.length > 0 ? Math.round(nps.reduce((sum, item) => sum + item.score, 0) / nps.length) : 0;

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic flex items-center gap-2">
          <Star className="w-5 h-5" />
          مؤشر رضا العملاء (NPS)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* المتوسط العام */}
        <div className="bg-white/20 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">المتوسط العام</p>
              <p className="text-3xl font-bold">{averageNPS}</p>
              <p className="text-sm text-gray-600">{getNPSRating(averageNPS)}</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getNPSColor(averageNPS) }}></div>
            </div>
          </div>
        </div>

        {/* قائمة العملاء */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {nps.map(item => (
            <div 
              key={item.id}
              className="bg-white/20 rounded-2xl p-4 transition-all duration-200 hover:bg-white/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-right flex-1">
                  <h4 className="font-medium text-sm">{item.client}</h4>
                  <p className="text-xs text-gray-600">{item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {getCategoryText(item.category)}
                  </Badge>
                  <span className="text-lg font-bold">{item.score}</span>
                </div>
              </div>
              
              {item.feedback && (
                <div className="flex items-start gap-2 mt-3 p-2 bg-white/20 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">{item.feedback}</p>
                </div>
              )}
              
              <div className="mt-3 bg-gray-200 h-2 rounded-full">
                <div 
                  className={`h-2 rounded-full transition-all duration-300`}
                  style={{ 
                    width: `${item.score}%`,
                    backgroundColor: getNPSColor(item.score)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
