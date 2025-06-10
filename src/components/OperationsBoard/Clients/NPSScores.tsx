
import React from 'react';

interface NPSScore {
  id: number;
  score: number;
  client: string;
}

interface NPSScoresProps {
  nps: NPSScore[];
}

export const NPSScores: React.FC<NPSScoresProps> = ({ nps }) => {
  const getNPSColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-green-400';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-red-500';
  };

  const getNPSRating = (score: number): string => {
    if (score >= 90) return 'ممتاز';
    if (score >= 75) return 'جيد جداً';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'مقبول';
    return 'ضعيف';
  };

  return (
    <div>
      <h3 className="text-xl font-arabic font-medium text-right mb-4">مؤشر رضا العملاء (NPS)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nps.map(item => (
          <div 
            key={item.id}
            className="glass-enhanced rounded-[40px] p-4 transition-all duration-200 ease-in-out hover:bg-white/50"
          >
            <div className="text-right mb-2">
              <h4 className="font-medium">{item.client}</h4>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium px-2.5 py-1 rounded ${
                  item.score >= 75 ? 'bg-green-100 text-green-800' :
                  item.score >= 60 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getNPSRating(item.score)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{item.score}</span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNPSColor(item.score) }}></div>
              </div>
            </div>
            
            <div className="mt-3 bg-gray-200 h-2 rounded-full">
              <div 
                className={`h-2 rounded-full ${getNPSColor(item.score)}`}
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
